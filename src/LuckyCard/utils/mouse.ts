export function getMouse(e: MouseEvent, canvas: HTMLCanvasElement | null) {
	let offsetX = 0
	let offsetY = 0
	let mx = 0
	let my = 0
	let parent = canvas as HTMLElement

	if (parent && parent.offsetParent !== undefined) {
		do {
			offsetX += parent.offsetLeft;
			offsetY += parent.offsetTop;
		} while ((parent = parent.offsetParent as HTMLElement));
	}
	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;

	return { x: mx, y: my };
}

interface Point {
	x: number
	y: number
}

export function distanceBetween(point1: Point, point2: Point): number {
	return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

export function angleBetween(point1: Point, point2: Point): number {
	return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

// Only test every `stride` pixel. `stride`x faster,
// but might lead to inaccuracy

export function getFilledInPixels(stride: number, ctx: CanvasRenderingContext2D, options: { canvasWidth: number; canvasHeight: number, dpr: number })  {
	if (!stride || stride < 1) { stride = 1 }
	const { canvasWidth, canvasHeight, dpr } = options
	
	const pixels = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
	const pdata = pixels.data
	const l = pdata.length
	const total = (l / stride)
	let count = 0
	
	// Iterate over all pixels
	for(var i = count = 0; i < l; i += stride) {
		if (pdata[i] === 0) {
			count += dpr;
		}
	}
	
	return Math.round((count / total) * 100);
}