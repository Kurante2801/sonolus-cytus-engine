// Gets gameplay bounds based off Cytoid's math
// https://github.com/Cytoid/Cytoid/blob/e164f56b4894b70fcdcbdfae7bacb9de1c92d604/Assets/Scripts/Game/Chart/Chart.cs#L74
// This is ran once and then cached in memory
export function getGameplayBounds(screenWidth: number, screenHeight: number, horizontalMargin: number, verticalMargin: number): Rect {
	const topRatio = 0.0966666;
	const bottomRatio = 0.07;

	const horizontalRatio = 0.8 + (5 - horizontalMargin - 1) * 0.02;
	const verticalRatio = 1 - (screenWidth * (topRatio + bottomRatio)) / screenHeight + (3 - verticalMargin) * 0.05;
	const verticalOffset = -(screenWidth * (topRatio - (topRatio + bottomRatio) / 2));

	const chartToScreenX = (x: number): number => (x * 2 * horizontalRatio - horizontalRatio) * screenWidth * 0.5;
	const chartToScreenY = (y: number): number => {
		const baseSize = screenHeight * 0.5;
		return verticalRatio * (-baseSize + 2 * baseSize * y) + verticalOffset;
	};

	return new Rect({
		t: chartToScreenY(1),
		b: chartToScreenY(0),
		l: chartToScreenX(0),
		r: chartToScreenX(1),
	});
}

export function getAngle(x1: number, y1: number, x2: number, y2: number): number {
	return Math.atan2(y2 - y1, x2 - x1) + Math.PI * 1.5;
}

export const leftRotated = Quad.one.rotate(Math.PI * 0.5);
export const rightRotated = Quad.one.rotate(-Math.PI * 0.5);
