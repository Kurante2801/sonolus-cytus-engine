// Scale and alpha animations for notes
export type AnimationData = {
	spawn: number;
	target: number;
	alpha: { start: number; end: number };
	scale: { start: number; end: number };
};

export function defineAnimation(drag: boolean, speed: number, data: AnimationData, windows: JudgmentWindows) {
	if (drag) data.spawn = data.target - 1.175 / speed;
	else data.spawn = data.target - 1.367 / speed;

	data.alpha.start = data.spawn;
	data.alpha.end = data.target + windows.perfect.min;

	data.scale.start = data.spawn;
	data.scale.end = data.target + windows.great.min;
}
