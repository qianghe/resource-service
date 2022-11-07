export {
	getFilledInPixels,
	distanceBetween,
	angleBetween,
	getMouse
} from './mouse';

export const loadImg = (imgSrc: string, width?: number, height?: number) => {
	let resolver: ((value: unknown) => void) | null = null
	
	const promise = new Promise((resolve) => {
		resolver = resolve
	})
	const customParams = width ? [width] : []

	if (customParams.length === 1 && height) {
		customParams.push(height)
	}
	const img = width ? new Image(...customParams) : new Image()
	
	img.onload = function() {
		if (resolver) {
			resolver(img)
		}
	}
	img.src = imgSrc

	return promise
}

export const getPixel = (str: string): number => {
	const matches = str.match(/([0-9]*)px$/)
	if (matches) return parseInt(matches[1])
	return 0
}
