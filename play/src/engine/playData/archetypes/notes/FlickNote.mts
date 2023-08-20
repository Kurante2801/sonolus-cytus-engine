import { options } from "$shared/configuration/options.mjs";
import { leftRotated, rightRotated } from "$shared/data/util.mjs";
import { buckets } from "../../buckets.mjs";
import { Direction } from "../../direction.mjs";
import { note } from "../../note.mjs";
import { particle } from "../../particle.mjs";
import { skin } from "../../skin.mjs";
import { windows } from "../../windows.mjs";
import { isUsed, markAsUsed } from "../InputManager.mjs";
import { Note, NoteType } from "./Note.mjs";

export class FlickNote extends Note {
	bucket = buckets.flick;
	windows = windows.flick;
	effect = particle.effects.flick;
	type = NoteType.FLICK;

	inputLayout = this.entityMemory(Rect);
	activatedTouch = this.entityMemory(TouchId);
	fallback = this.entityMemory(Boolean);

	globalPreprocess(): void {
		super.globalPreprocess();

		// Require moving a flick note by at least 0.25% of the screen to trigger it
		note.flickThreshold = Math.lerp(0, screen.w, 0.025);
	}

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.flickUp.id : skin.sprites.flickDown.id;

		this.fallback = !skin.sprites.exists(this.sprite);
		if (this.fallback) this.sprite = skin.sprites.flickFallback.id;
	}

	draw(): void {
		super.draw();

		// Draw arrows indicating this note must be flicked
		const alpha = Math.min(1, Math.unlerp(this.times.alpha.start, this.times.alpha.end, time.now));
		const scale = Math.min(1, Math.unlerp(this.times.scale.start, this.times.scale.end, time.now));

		const left = leftRotated.scale(note.radius * scale, note.radius * scale).translate(this.pos.x - note.radius * scale, this.pos.y);
		const right = rightRotated.scale(note.radius * scale, note.radius * scale).translate(this.pos.x + note.radius * scale, this.pos.y);

		if (skin.sprites.flickArrow.exists) {
			skin.sprites.flickArrow.draw(right, this.pos.z + 0.0001, alpha);
			skin.sprites.flickArrow.draw(left, this.pos.z + 0.0001, alpha);
		} else {
			skin.sprites.flickArrowFallback.draw(right, this.pos.z + 0.0001, alpha);
			skin.sprites.flickArrowFallback.draw(left, this.pos.z + 0.0001, alpha);
		}
	}

	touch(): void {
		if (options.autoplay || time.now < this.input.min) return;

		if (!this.activatedTouch) {
			for (const touch of touches) {
				if (!touch.started || !this.isTouching(touch.x, touch.y) || isUsed(touch)) continue;

				markAsUsed(touch);
				this.activatedTouch = touch.id;
				break;
			}
		}

		// Trigger flick
		if (this.activatedTouch) {
			for (const touch of touches) {
				if (touch.id !== this.activatedTouch) continue;
				const offset = Math.abs(touch.position.x - touch.startPosition.x);

				if (offset >= note.flickThreshold) this.judge(touch, time.now, false);
				else if (touch.ended) this.despawn = true;

				break;
			}
		}
	}
}
