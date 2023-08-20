import { skin } from "./skin.mjs";

export const buckets = defineBuckets({
	tap: {
		sprites: [
			{
				id: skin.sprites.tapUp.id,
				x: 0,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
			{
				id: skin.sprites.tapFallback.id,
				x: 2,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
		],
	},
	holdStart: {
		sprites: [
			{
				id: skin.sprites.holdDown.id,
				x: 0,
				y: 0,
				w: 2,
				h: 2,
				rotation: 90,
			},
			{
				id: skin.sprites.holdFallback.id,
				x: 2,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
		],
	},
	longHoldStart: {
		sprites: [
			{
				id: skin.sprites.longHold.id,
				x: 0,
				y: 0,
				w: 2,
				h: 2,
				rotation: 90,
			},
			{
				id: skin.sprites.longHoldFallback.id,
				x: 2,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
		],
	},
	holdEnd: {
		sprites: [
			{
				id: skin.sprites.holdBar.id,
				x: 0,
				y: 0,
				w: 0.8,
				h: 3,
				rotation: 90,
			},
			{
				id: skin.sprites.holdDown.id,
				x: 2,
				y: 0,
				w: 2,
				h: 2,
				rotation: 90,
			},
			{
				id: skin.sprites.holdBar.id,
				x: 6,
				y: 0,
				w: 0.8,
				h: 3,
				rotation: 90,
			},
			{
				id: skin.sprites.holdFallback.id,
				x: 8,
				y: 0,
				w: 2,
				h: 2,
				rotation: 90,
			},
		],
	},
	longHoldEnd: {
		sprites: [
			{
				id: skin.sprites.holdBar.id,
				x: 0,
				y: 0,
				w: 0.8,
				h: 3,
				rotation: 90,
			},
			{
				id: skin.sprites.longHold.id,
				x: 2,
				y: 0,
				w: 2,
				h: 2,
				rotation: 90,
			},
			{
				id: skin.sprites.holdBar.id,
				x: 6,
				y: 0,
				w: 0.8,
				h: 3,
				rotation: 90,
			},
			{
				id: skin.sprites.longHoldFallback.id,
				x: 8,
				y: 0,
				w: 2,
				h: 2,
				rotation: 90,
			},
		],
	},
	drag: {
		sprites: [
			{
				id: skin.sprites.dragHeadUp.id,
				x: 0,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
			{
				id: skin.sprites.dragArrow.id,
				x: 0,
				y: 0,
				w: 2,
				h: 2,
				rotation: -45,
			},
			{
				id: skin.sprites.dragHeadFallback.id,
				x: 2,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
			{
				id: skin.sprites.dragArrow.id,
				x: 2,
				y: 0,
				w: 2,
				h: 2,
				rotation: -45,
			},
		],
	},
	flick: {
		sprites: [
			{
				id: skin.sprites.flickUp.id,
				x: 0,
				y: 0,
				w: 3.0625,
				h: 2,
				rotation: 0,
			},
			{
				id: skin.sprites.flickFallback.id,
				x: 3.0625,
				y: 0,
				w: 2,
				h: 2,
				rotation: 0,
			},
		],
	},
});
