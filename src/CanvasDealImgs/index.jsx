import React, { useRef, useEffect } from 'react';
import { loadImg } from "../LuckyCard/utils";
import * as DrawUtils from './draw';
import styles from './index.module.scss';

const rawImgUrl = new URL("./demo.png", import.meta.url).href;
const [customImgWidth, customImgHeight] = [300, 176]
const contourCanvasDomId = 'contourCanvas'

function CanvasDealImg() {
  const canvasRef = useRef(null)
  const grayCanvasRef = useRef(null)
  const cannyCanvasRef = useRef(null)
  const contourCanvasRef = useRef(null)
  const rawImgRef = useRef(null)

  useEffect(() => {
    const run = async () => {
      // load img
      const img = await loadImg(rawImgUrl, customImgWidth, customImgHeight);
      const [width, height] = [img.width, img.height];
      // set to rawImg
      rawImgRef.current.src = img.src
      rawImgRef.current.width = width
      rawImgRef.current.height = height
      
      // canvas draw it and get the dataset
      const baseCtx = DrawUtils.drawBaseCanvas(canvasRef.current, img)
      const imgData = baseCtx.getImageData(0, 0, width, height);

      // gray it
      DrawUtils.drawGrayCanvas(grayCanvasRef.current, imgData, width, height)
      
      // canny-edge
      DrawUtils.drawCannyEdgeCanvas(cannyCanvasRef.current, imgData, width, height)

      // contour-draw
      // fill default image
      const contourCanvas = contourCanvasRef.current
      const contourCtx = contourCanvas.getContext("2d")
      contourCanvas.width = width
      contourCanvas.height = height
      contourCtx.drawImage(img, 0, 0, width, height)
      
      DrawUtils.drawContourCanvas(rawImgRef.current, contourCanvasDomId)
    }

    run()
  }, [])

  return (
    <div className={styles.dealImagePage}>
      <canvas ref={canvasRef} style={{ display: 'none' }}/>
      <div>
        <p>Raw Image</p>
        <img ref={rawImgRef} alt="Raw Image" />
      </div>
      <div>
        <p>Gray Image</p>
        <canvas ref={grayCanvasRef} />
      </div>
      <div>
        <p>Canny-Edge Image</p>
        <canvas ref={cannyCanvasRef} />
      </div>
      <div>
        <p>Contour-Edge Image</p>
        <canvas ref={contourCanvasRef} id={contourCanvasDomId} />
      </div>
    </div>
  );
}

export default CanvasDealImg;
