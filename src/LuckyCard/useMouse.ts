import { useState, useCallback, useRef } from "react"
import { getMouse, distanceBetween, angleBetween, getFilledInPixels} from './utils'

interface useMouse {
	canvasRef: React.RefObject<HTMLCanvasElement>
	brushRef: React.RefObject<HTMLImageElement>
	dpr: number
}

function useMouse({
	canvasRef,
	brushRef,
	dpr
}: useMouse) {
	const [isDone, setIsDone] = useState(false)
	const ctxRef = useRef<CanvasRenderingContext2D | null>()
	const brushInfo = useRef({ width: 0, height: 0 })
	const isDrawing = useRef(false)
	const lastPoint = useRef({ x: 0, y: 0})

	const handlePercentage = (filledInPixels: number) => {
    filledInPixels = filledInPixels || 0;
		const canvas = canvasRef.current
    console.log(filledInPixels + '%');
    
		if (canvas && filledInPixels > 50) {
      canvas.parentNode?.removeChild(canvas)
			return true
    }
  }
  
	// mouse-down
	const handleMouseDown = useCallback((e) => {
		isDrawing.current = true
		lastPoint.current = getMouse(e, canvasRef.current)
	}, [])

	// mouse-up
	const handleMouseUp = useCallback((e) => {
		isDrawing.current = false
	}, [])

	// mouse-move
	const handleMouseMove = useCallback((e) => {
		if (!isDrawing.current || !ctxRef.current) return
		e.preventDefault()
		
		const { width: brushWidth, height: brushHeight} = brushInfo.current
		const currentPoint = getMouse(e, canvasRef.current)
		const dist = distanceBetween(lastPoint.current, currentPoint)
		const angle = angleBetween(lastPoint.current, currentPoint)
		let x = 0
		let y = 0

		for (var i = 0; i < dist; i++) {
			x = lastPoint.current.x + (Math.sin(angle) * i)
			y = lastPoint.current.y + (Math.cos(angle) * i)
			ctxRef.current.globalCompositeOperation = 'destination-out';
			ctxRef.current.drawImage(
				brushRef.current as CanvasImageSource, 
				x * dpr - brushWidth / dpr,
				y * dpr - brushHeight / dpr,
				brushWidth,
				brushHeight
			);
		}

		lastPoint.current = currentPoint
		
		const doneRes = handlePercentage(getFilledInPixels(32, ctxRef.current, {
			canvasWidth: canvasRef.current?.width || 0,
			canvasHeight: canvasRef.current?.height || 0,
			dpr
		}))

		if (doneRes) {
			setIsDone(true)
		}
	}, [])

	const registerMouse = useCallback((ctx) => {
		const canvas = canvasRef.current

		if (canvas) {
			ctxRef.current = ctx

			canvas.addEventListener('mousedown', handleMouseDown, false);
			canvas.addEventListener('mousemove', handleMouseMove, false);
			canvas.addEventListener('mouseup', handleMouseUp, false);
		}

		if (brushRef.current) {
			brushInfo.current = {
				width: brushRef.current.naturalWidth * dpr,
				height: brushRef.current.naturalHeight * dpr
			}
		}

	}, [])
	
	return {
		registerMouse,
		isDone
	}
}

export default useMouse