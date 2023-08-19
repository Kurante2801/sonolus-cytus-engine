import { scanline as shared } from "../../../../shared/src/engine/data/scanline.mjs";

export const scanline = {
	...shared,
	...levelMemory({
		y: Number,
		bounds: Rect,
	}),
};
