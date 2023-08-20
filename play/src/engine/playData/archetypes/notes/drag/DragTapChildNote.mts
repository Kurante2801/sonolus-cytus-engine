import { Direction } from "../../../direction.mjs";
import { particle } from "../../../particle.mjs";
import { skin } from "../../../skin.mjs";
import { DragNote } from "./DragNote.mjs";

export class DragTapChildNote extends DragNote {
	effect = particle.effects.tap;

	preprocess(): void {
		super.preprocess();

		this.sprite = this.data.direction === Direction.Up ? skin.sprites.dragTapChildUp.id : skin.sprites.dragTapChildDown.id;
		if (!skin.sprites.exists(this.sprite)) this.sprite = skin.sprites.dragTapChildFallback.id;

		this.shared.sprite = this.sprite;
	}
}
