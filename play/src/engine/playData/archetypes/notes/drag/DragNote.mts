import { Layer } from "$shared/data/layer.mjs";
import { getAngle } from "$shared/data/util.mjs";
import { options } from "../../../../configuration/options.mjs";
import { buckets } from "../../../buckets.mjs";
import { Direction } from "../../../direction.mjs";
import { note } from "../../../note.mjs";
import { particle } from "../../../particle.mjs";
import { skin } from "../../../skin.mjs";
import { getZ } from "../../../util.mjs";
import { windows } from "../../../windows.mjs";
import { archetypes } from "../../index.mjs";
import { Note, NoteType } from "../Note.mjs";

export enum DragType {
	DRAG_HEAD,
	DRAG_CHILD,
	TAP_DRAG_HEAD,
	TAP_DRAG_CHILD,
}

export class DragNote extends Note {
	dragData = this.defineData({
		type: { name: "type", type: DataType<DragType> },
		nextRef: { name: "nextRef", type: Number },
	});

	bucket = buckets.drag;
	windows = windows.drag;
	effect = particle.effects.drag;
	type = NoteType.DRAG;

	arrowLayout = this.entityMemory(Quad);

	// Whether this note's sprite was changed to a drag child sprite (because time.now reached target time)
	changed = this.entityMemory(Boolean);

	shared = this.defineSharedMemory({
		judged: Boolean,
		sprite: SkinSpriteId,
		spawn: Number,
		x: Number,
		y: Number,
		z: Number,
	});

	preprocess(): void {
		super.preprocess();
		this.shared.x = this.pos.x;
		this.shared.y = this.pos.y;

		if (this.dragData.type === DragType.DRAG_HEAD) {
			this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragHeadUp.id : skin.sprites.dragHeadDown.id;
			if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragHeadFallback.id;
		} else {
			this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragChildUp.id : skin.sprites.dragChildDown.id;
			if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragChildFallback.id;
		}

		this.shared.sprite = this.sprite;
		this.shared.spawn = this.times.spawn;
		this.pos.z = getZ(this.dragData.type === DragType.DRAG_HEAD ? Layer.NOTE : Layer.DRAG_CHILD, this.times.target);
		this.shared.z = this.pos.z;
	}

	initialize(): void {
		super.initialize();

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
			startType: this.dragData.type,
			endType: this.nextDragData.type,
		});

		if (this.dragData.type === DragType.DRAG_HEAD)
			this.arrowLayout.copyFrom(Quad.one.rotate(getAngle(this.pos.x, this.pos.y, next.x, next.y)));
	}

	touch(): void {
		if (options.autoplay || time.now < this.input.min) return;

		for (const touch of touches) {
			if (this.isTouching(touch.x, touch.y)) {
				this.judge(touch, time.now, false);
				break;
			}
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

	act(): void {
		super.act();

		// To avoid drawing two arrow graphics, change this note's sprite to a child one after its target time
		if (options.autoplay) return;
		if (this.dragData.type !== DragType.DRAG_HEAD || time.now < this.times.target || this.changed) return;

		this.changed = true;

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragChildUp.id : skin.sprites.dragChildDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragChildFallback.id;
	}

	draw(): void {
		super.draw();

		// Draw arrow (don't draw arrows on drag children)
		if (this.dragData.type !== DragType.DRAG_HEAD || this.changed) return;

		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const scale = Math.min(1, Math.unlerp(this.times.scale.start, this.times.scale.end, time.now));

		const layout = this.arrowLayout.scale(note.radius * scale, note.radius * scale).translate(this.pos.x, this.pos.y);
		skin.sprites.dragArrow.draw(layout, this.pos.z + 0.0001, alpha);
	}

	get nextShared() {
		return archetypes.DragNote.shared.get(this.dragData.nextRef);
	}

	get nextDragData() {
		return archetypes.DragNote.dragData.get(this.dragData.nextRef);
	}
}
