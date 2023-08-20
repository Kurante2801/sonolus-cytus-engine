import { options } from "$shared/configuration/options.mjs";
import { defineAnimation } from "$shared/data/animation.mjs";
import { Layer } from "$shared/data/layer.mjs";
import { buckets } from "../../../buckets.mjs";
import { Direction } from "../../../direction.mjs";
import { note } from "../../../note.mjs";
import { particle } from "../../../particle.mjs";
import { scanline } from "../../../scanline.mjs";
import { skin } from "../../../skin.mjs";
import { getY, getZ } from "../../../util.mjs";
import { windows } from "../../../windows.mjs";
import { archetypes } from "../../index.mjs";
import { Note, NoteType } from "../Note.mjs";

export class HoldEndNote extends Note {
	holdData = this.defineData({
		startRef: { name: "startRef", type: Number },
	});

	bucket = buckets.holdStart;
	windows = windows.holdEnd;
	effect = particle.effects.hold;
	type = NoteType.HOLD_END;

	startTarget = this.entityMemory(Number);
	bar = this.entityMemory({ y: Number, z: Number });
	touched = this.entityMemory(Boolean);

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.holdUp.id : skin.sprites.holdDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.holdFallback.id;

		this.bar.y = this.pos.y;
		this.bar.z = getZ(Layer.HOLD_BAR, this.times.target);

		const start = this.startData;

		// We want this note's sprite to be drawn at the start note's position
		this.pos.y = getY(this.data.direction, start.y);

		// Temporarily override target time to setup animations according to HoldStartNote
		const target = this.times.target;

		this.startTarget = bpmChanges.at(start.beat).time;

		this.times.target = this.startTarget;
		defineAnimation(false, start.speed, this.times, this.windows);
		this.times.target = target;
	}

	updateSequential(): void {
		super.updateSequential();
		this.touched = false;
	}

	act(): void {
		if (options.autoplay || this.startInfo.state !== EntityState.Despawned) return;

		// Note is being held and has time left
		if (this.touched && time.now <= this.input.max && this.startShared.judged) return;

		// Note ended or was let go
		this.despawn = true;

		// Missed start
		if (time.now < this.input.min || !this.startShared.judged) return;

		const hitTime = Math.min(time.now - input.offset, this.times.target);

		this.result.judgment = input.judge(hitTime, this.times.target, this.windows);
		this.result.accuracy = hitTime - this.times.target;

		this.result.bucket.index = this.bucket.index;
		this.result.bucket.value = this.result.accuracy * 1000;
	}

	draw(): void {
		// Draw starting note after target (because starting note despawns after being judged)
		if (time.now >= this.startTarget) super.draw();
		this.drawBar();
	}

	drawBar(): void {
		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const tall = Math.min(1, Math.unlerp(this.times.scale.start, this.times.scale.end, time.now));

		const layout = Rect.one.scale(note.holdBar, note.holdBar).translate(this.pos.x, this.pos.y);
		layout.t = Math.lerp(this.pos.y, this.bar.y, tall);

		if (skin.sprites.holdBar.exists) skin.sprites.holdBar.draw(layout, this.bar.z, alpha);
		else skin.sprites.holdBarFallback.draw(layout, this.bar.z, alpha);

		// Draw colored bar indicating progress
		if (time.now <= this.startTarget) return;

		const progress = Math.unlerp(this.startTarget, this.times.target, time.now);
		layout.t = Math.lerp(this.pos.y, this.bar.y, progress);

		if (this.data.direction === Direction.Up) skin.sprites.holdBarUp.draw(layout, this.bar.z - 0.0001, 1);
		else skin.sprites.holdBarDown.draw(layout, this.bar.z - 0.0001, 1);
	}

	touch(): void {
		if (options.autoplay) return;
		this.touched = false;

		for (const touch of touches) {
			if (this.isTouching(touch.x, touch.y)) {
				this.touched = true;
				break;
			}
		}
	}

	particleEffects(judgement: Judgment): void {
		// Move the note so the effect plays at the scanline position
		this.pos.y = scanline.y;
		super.particleEffects(judgement);
	}

	get startInfo(): EntityInfo {
		return entityInfos.get(this.holdData.startRef);
	}

	get startData() {
		return archetypes.HoldStartNote.data.get(this.holdData.startRef);
	}

	get startShared() {
		return archetypes.HoldStartNote.shared.get(this.holdData.startRef);
	}
}
