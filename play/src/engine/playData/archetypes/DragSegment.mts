import { Layer } from "$shared/data/layer.mjs";
import { getAngle } from "$shared/data/util.mjs";
import { Direction } from "../direction.mjs";
import { note } from "../note.mjs";
import { skin } from "../skin.mjs";
import { getZ } from "../util.mjs";
import { archetypes } from "./index.mjs";
import { DragType } from "./notes/drag/DragNote.mjs";

export class DragSegment extends SpawnableArchetype({
	startRef: Number,
	endRef: Number,
	startX: Number,
	startY: Number,
	startZ: Number,
	endX: Number,
	endY: Number,
	endZ: Number,
	startType: Number,
	endType: Number,
}) {
	arrowLayout = this.entityMemory(Quad);

	sprites = this.entityMemory({
		start: SkinSpriteId,
		end: SkinSpriteId,
		moving: SkinSpriteId,
	});

	times = this.entityMemory({
		start: Number,
		end: Number,
	});

	segment = this.entityMemory(Quad);
	z = this.entityMemory(Number);

	initialize(): void {
		const angle = getAngle(this.spawnData.startX, this.spawnData.startY, this.spawnData.endX, this.spawnData.endY);
		this.arrowLayout.copyFrom(Quad.one.rotate(angle).scale(note.radius, note.radius));

		this.sprites.start = this.startSprite;
		this.sprites.end = this.endShared.sprite;

		const type = this.spawnData.startType;

		if (type == DragType.DRAG_HEAD || type == DragType.DRAG_CHILD) {
			// Segment is a regular drag
			this.sprites.moving = this.startData.direction === Direction.Up ? skin.sprites.dragHeadUp.id : skin.sprites.dragHeadDown.id;
			if (!skin.sprites.exists(this.sprites.moving)) this.sprites.moving = skin.sprites.dragHeadFallback.id;
		} else {
			// Segment is a tap drag
			this.sprites.moving =
				this.startData.direction === Direction.Up ? skin.sprites.dragTapHeadUp.id : skin.sprites.dragTapHeadDown.id;
			if (!skin.sprites.exists(this.sprites.moving)) this.sprites.moving = skin.sprites.dragTapHeadFallback.id;

			// We don't want to draw a tap note if the tap drag note was pressed
			// instead we just want to draw a stationary circle
			if (type == DragType.TAP_DRAG_HEAD) this.sprites.start = this.sprites.moving;
		}

		this.times.start = bpmChanges.at(this.startData.beat).time;
		this.times.end = bpmChanges.at(this.endData.beat).time;

		this.z = getZ(Layer.DRAG_SEGMENT, this.times.start);

		// To create a bar connecting two notes, we use 2 rotated quads (one at start note and one at end note)
		// Then we create a single rectangle quad based on the two quads' points
		const layout = Quad.one.scale(note.segmentThick, 0).rotate(angle);

		const start = layout.translate(this.spawnData.startX, this.spawnData.startY);
		const end = layout.translate(this.spawnData.endX, this.spawnData.endY);

		this.segment.copyFrom(
			new Quad({
				p1: start.p1,
				p2: end.p2,
				p3: end.p3,
				p4: start.p4,
			}),
		);
	}

	updateParallel(): void {
		if (time.now >= this.times.end) {
			this.despawn = true;
			return;
		}

		// Draw notes if they were judged (judged notes are despawned)
		if (this.startJudged && time.now <= this.times.start)
			this.drawNote(this.sprites.start, this.spawnData.startX, this.spawnData.startY, this.spawnData.startZ);
		if (this.endShared.judged && time.now <= this.times.end)
			this.drawNote(this.sprites.end, this.spawnData.endX, this.spawnData.endY, this.spawnData.endZ);

		// Progress of the entire segment (when time.now is between start and end notes' targets)
		const progress = Math.clamp(Math.unlerp(this.times.start, this.times.end, time.now), 0, 1);

		// Spawn animation
		const scale = Math.clamp(Math.unlerp(this.startSpawn, this.times.start, time.now), 0, 0.5) * 2;
		const alpha = Math.clamp(Math.unlerp(this.startSpawn, this.times.start, time.now), 0, 1) * 0.5;

		// Draw bar (lerps from start note to end note)
		const layout = new Quad({
			p1: Vec.lerp(this.segment.p1, this.segment.p2, progress),
			p2: Vec.lerp(this.segment.p1, this.segment.p2, scale),
			p3: Vec.lerp(this.segment.p4, this.segment.p3, scale),
			p4: Vec.lerp(this.segment.p4, this.segment.p3, progress),
		});

		skin.sprites.dragSegment.draw(layout, this.z, alpha);

		// Draw moving arrow
		if (time.now < this.times.start) return;

		const x = Math.lerp(this.spawnData.startX, this.spawnData.endX, progress);
		const y = Math.lerp(this.spawnData.startY, this.spawnData.endY, progress);

		this.drawNote(this.sprites.moving, x, y, this.spawnData.startZ);
		skin.sprites.dragArrow.draw(this.arrowLayout.translate(x, y), this.spawnData.startZ + 0.0001, 1);
	}

	drawNote(sprite: SkinSpriteId, x: number, y: number, z: number): void {
		const layout = Rect.one.scale(note.radius, note.radius).translate(x, y);
		skin.sprites.draw(sprite, layout, z, 1);
	}

	get startData() {
		return archetypes.DragNote.data.get(this.spawnData.startRef);
	}

	get endData() {
		return archetypes.DragNote.data.get(this.spawnData.endRef);
	}

	get startSprite(): SkinSpriteId {
		return this.spawnData.startType == DragType.TAP_DRAG_HEAD
			? archetypes.TapNote.shared.get(this.spawnData.startRef).sprite
			: archetypes.DragNote.shared.get(this.spawnData.startRef).sprite;
	}

	get startJudged(): boolean {
		return this.spawnData.startType == DragType.TAP_DRAG_HEAD
			? archetypes.TapNote.shared.get(this.spawnData.startRef).judged
			: archetypes.DragNote.shared.get(this.spawnData.startRef).judged;
	}

	get startSpawn(): number {
		return this.spawnData.startType == DragType.TAP_DRAG_HEAD
			? archetypes.TapNote.shared.get(this.spawnData.startRef).spawn
			: archetypes.DragNote.shared.get(this.spawnData.startRef).spawn;
	}

	get endShared() {
		return archetypes.DragNote.shared.get(this.spawnData.endRef);
	}
}
