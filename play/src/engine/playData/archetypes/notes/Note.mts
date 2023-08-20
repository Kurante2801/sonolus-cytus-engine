import { defineAnimation } from "$shared/data/animation.mjs";
import { Layer } from "$shared/data/layer.mjs";
import { note } from "$shared/data/note.mjs";
import { EngineArchetypeDataName } from "sonolus-core";
import { options } from "../../../configuration/options.mjs";
import { Direction } from "../../direction.mjs";
import { effect } from "../../effect.mjs";
import { skin } from "../../skin.mjs";
import { getX, getY, getZ } from "../../util.mjs";
import { markAsUsed } from "../InputManager.mjs";

export enum NoteType {
	TAP,
	HOLD_START,
	HOLD_END,
	DRAG,
	FLICK,
}

export abstract class Note extends Archetype {
	hasInput = true;
	touchOrder = 1;

	abstract type: NoteType;
	abstract bucket: Bucket;
	abstract windows: JudgmentWindows;
	abstract effect: ParticleEffect;

	data = this.defineData({
		beat: { name: EngineArchetypeDataName.Beat, type: Number },
		x: { name: "x", type: Number }, // [0 - 1] range (left to right)
		y: { name: "y", type: Number }, // [0 - 1] range (depends on direction)
		direction: { name: "direction", type: DataType<Direction> },
		speed: { name: "speed", type: Number },
	});

	times = this.entityMemory({
		spawn: Number,
		target: Number,
		alpha: { start: Number, end: Number },
		scale: { start: Number, end: Number },
	});

	input = this.entityMemory({ min: Number, max: Number });
	pos = this.entityMemory({ x: Number, y: Number, z: Number });
	sprite = this.entityMemory(SkinSpriteId);
	sfxScheduled = this.entityMemory(Boolean);

	globalPreprocess(): void {
		const toMs = ({ min, max }: JudgmentWindow) => ({
			min: Math.round(min * 1000),
			max: Math.round(max * 1000),
		});

		this.bucket.set({
			perfect: toMs(this.windows.perfect),
			great: toMs(this.windows.great),
			good: toMs(this.windows.good),
		});

		this.life.miss = -40;
	}

	preprocess(): void {
		this.times.target = bpmChanges.at(this.data.beat).time;

		defineAnimation(this.type === NoteType.DRAG, this.data.speed, this.times, this.windows);

		if (options.mirrorY) this.data.direction *= -1;

		this.pos.x = getX(this.data.x);
		this.pos.y = getY(this.data.direction, this.data.y);
		this.pos.z = getZ(Layer.NOTE, this.times.target);

		if (options.mirrorX) this.pos.x *= -1;

		this.sfxScheduled = false;
	}

	initialize(): void {
		this.input.min = this.times.target + this.windows.good.min;
		this.input.max = this.times.target + this.windows.good.max;

		if (options.autoplay) {
			this.result.judgment = Judgment.Perfect;
			this.result.bucket.index = this.bucket.index;
		} else this.result.accuracy = this.windows.good.max;
	}

	shouldSpawn(): boolean {
		return time.now >= this.times.spawn;
	}

	spawnOrder(): number {
		return 1000 + this.times.spawn;
	}

	updateSequential(): void {
		if (options.autoplay && time.now >= this.times.target) {
			this.despawn = true;
			this.particleEffects(Judgment.Perfect);
			return;
		}

		this.act();
	}

	updateParallel(): void {
		if (this.shouldScheduleSFX) this.scheduleSoundEffect();
		if (!this.despawn) this.draw();
	}

	act(): void {
		if (options.autoplay && time.now >= this.times.target) return;
		if (time.now > this.input.max) this.judgeMiss();
	}

	draw(): void {
		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const scale = Math.min(1, Math.unlerp(this.times.scale.start, this.times.scale.end, time.now));

		const layout = Rect.one.scale(note.radius * scale, note.radius * scale).translate(this.pos.x, this.pos.y);
		skin.sprites.draw(this.sprite, layout, this.pos.z, alpha);
	}

	judgeMiss(): void {
		this.result.judgment = Judgment.Miss;
		this.despawn = true;
		this.particleEffects(Judgment.Miss);
	}

	judge(touch: Touch, time: number, mark: boolean): void {
		if (mark) markAsUsed(touch);

		this.result.judgment = input.judge(time, this.times.target, this.windows);
		this.result.accuracy = time - this.times.target;

		this.result.bucket.index = this.bucket.index;
		this.result.bucket.value = this.result.accuracy * 1000;

		this.particleEffects(this.result.judgment);
		this.soundEffect(this.result.judgment);

		this.despawn = true;
	}

	isTouching(x: number, y: number): boolean {
		const dist = Math.sqrt((this.pos.x - x) ** 2 + (this.pos.y - y) ** 2);
		return dist <= note.radius;
	}

	particleEffects(judgment: Judgment): void {
		if (!options.effectEnabled) return;
		// TODO: judgement text

		if (judgment === Judgment.Miss) return;

		const radius = note.effect * options.effectSize;
		const layout = Rect.one.scale(radius, radius).translate(this.pos.x, this.pos.y);
		this.effect.spawn(layout, 0.25, false);
	}

	soundEffect(judgement: Judgment): void {
		if (!this.shouldPlaySFX) return;

		switch (judgement) {
			case Judgment.Perfect:
				return effect.clips.perfect.play(note.distance);
			case Judgment.Great:
				return effect.clips.great.play(note.distance);
			case Judgment.Good:
				return effect.clips.good.play(note.distance);
		}
	}

	scheduleSoundEffect(): void {
		if (this.sfxScheduled) return;

		this.sfxScheduled = true;
		effect.clips.perfect.schedule(this.times.target, note.distance);
	}

	get shouldScheduleSFX() {
		return options.sfxEnabled && (options.autoplay || options.autoSFX);
	}

	get shouldPlaySFX() {
		return options.sfxEnabled && !options.autoplay && !options.autoSFX;
	}
}
