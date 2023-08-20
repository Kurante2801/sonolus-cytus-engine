import { note as shared } from "$shared/data/note.mjs";

export const note = {
	...shared,
	...levelMemory({
		longHoldBarSprite: SkinSpriteId,
		flickThreshold: Number,
	}),
};
