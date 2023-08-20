import { scanline as shared } from "$shared/data/scanline.mjs";

export const scanline = {
	...shared,
	...levelMemory({
		y: Number,
		bounds: Rect,
	}),
};
