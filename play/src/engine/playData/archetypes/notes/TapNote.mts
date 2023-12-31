import { options } from "../../../configuration/options.mjs";
import { buckets } from "../../buckets.mjs";
import { Direction } from "../../direction.mjs";
import { particle } from "../../particle.mjs";
import { skin } from "../../skin.mjs";
import { windows } from "../../windows.mjs";
import { isUsed } from "../InputManager.mjs";
import { archetypes } from "../index.mjs";
import { Note, NoteType } from "./Note.mjs";
import { DragType } from "./drag/DragNote.mjs";

export class TapNote extends Note {
	bucket = buckets.tap;
	windows = windows.tap;
	effect = particle.effects.tap;
	type = NoteType.TAP;

	// This note may be a Tap Drag Head note
	dragData = this.defineData({
		nextRef: { name: "nextRef", type: Number },
	});

	shared = this.defineSharedMemory({
		judged: Boolean,
		sprite: SkinSpriteId,
		spawn: Number,
	});

	initialize(): void {
		super.initialize();

		// If this note is a Tap Drag Head, spawn a segment
		if (this.dragData.nextRef <= 0) return;
		const next = this.nextShared;

		archetypes.DragSegment.spawn({
			startRef: this.info.index,
			endRef: this.dragData.nextRef,
			startX: this.pos.x,
			startY: this.pos.y,
			startZ: this.pos.z,
			endX: next.x,
			endY: next.y,
			endZ: next.z,
			startType: DragType.TAP_DRAG_HEAD,
			endType: this.nextDragData.type,
		});
	}

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.tapUp.id : skin.sprites.tapDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.tapFallback.id;

		this.shared.sprite = this.sprite;
		this.shared.spawn = this.times.spawn;
	}

	touch(): void {
		if (options.autoplay || time.now < this.input.min) return;

		for (const touch of touches) {
			if (!touch.started || isUsed(touch) || !this.isTouching(touch.x, touch.y)) continue;
			this.judge(touch, touch.startTime, true);
			break;
		}
	}

	judge(touch: Touch, time: number, mark: boolean): void {
		this.shared.judged = true;
		super.judge(touch, time, mark);
	}

	judgeMiss(): void {
		this.shared.judged = true;
		super.judgeMiss();
	}

	get nextShared() {
		return archetypes.DragNote.shared.get(this.dragData.nextRef);
	}

	get nextDragData() {
		return archetypes.DragNote.dragData.get(this.dragData.nextRef);
	}
}
