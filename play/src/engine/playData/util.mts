import { Direction } from "./direction.mjs";
import { scanline } from "./scanline.mjs";

export function getX(percent: number): number {
	return Math.lerp(scanline.bounds.l, scanline.bounds.r, percent);
}

export function getY(direction: Direction, percent: number): number {
	if (direction === Direction.Up) return Math.lerp(scanline.bounds.b, scanline.bounds.t, percent);
	else return Math.lerp(scanline.bounds.t, scanline.bounds.b, percent);
}

export function getZ(layer: number, time: number): number {
	return layer - time / 10000;
}
