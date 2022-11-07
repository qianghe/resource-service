import { getGrayCanvasData } from '../utils';

// 绘制指定图片到canvas
export function drawBaseCanvas(canvas, img) {
  const [width, height] = [img.width, img.height];

  // canvas draw it and get the dataset
  const ctx = canvas.getContext("2d");
  if (!canvas || !ctx) return;
  
  // draw base img
  // canvas需要通过这种方式设定长宽
  canvas.width = width
  canvas.height = height
  ctx?.drawImage(img, 0, 0, width, height)

  return ctx
}

// 绘制指定图片数据的灰度图
export function drawGrayCanvas(grayCanvas, imgData, width, height) {
  const grayImgData = getGrayCanvasData(imgData)
  const grayCtx = grayCanvas.getContext("2d");
  
  grayCanvas.width = width
  grayCanvas.height = height

  grayCtx.putImageData(grayImgData, 0, 0)

  return grayCtx
}

// 通过canny算法绘制轮廓
const defaultOption = {
  blurRadius: 4,
  lowThreshold: 20,
  highThreshold: 50,
  // 最大尺寸限制
  maxWidth: 512,
  maxHeight: 512,
}
export function drawCannyEdgeCanvas(cannyEdgeCanvas, imgData, width, height, option = defaultOption) {
  const mergedOption = Object.assign({}, defaultOption, option || {}, {
    width, 
    height,
    originWidth: width,
    originHeight: height,
  });
  const { blurRadius, lowThreshold, highThreshold } = mergedOption
  const cannyEdgeCtx = cannyEdgeCanvas.getContext("2d");
  cannyEdgeCanvas.width = width
  cannyEdgeCanvas.height = height

  const imgU8 = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);
  jsfeat.imgproc.grayscale(imgData.data, width, height, imgU8);

  const kernelSize = (blurRadius + 1) * 2;
  jsfeat.imgproc.gaussian_blur(imgU8, imgU8, kernelSize, 0);
  jsfeat.imgproc.canny(imgU8, imgU8, lowThreshold, highThreshold);

  // 渲染结果重新绘制到canvas
  const dataU32 = new Uint32Array(imgData.data.buffer);
  const alpha = (0xff << 24);
  let i = imgU8.cols * imgU8.rows, pix = 0;
  while(--i >= 0) {
      // 白底黑线
      // pix = 255 - imgU8.data[i]
      // 黑底白线
      pix = imgU8.data[i];
      dataU32[i] = alpha | (pix << 16) | (pix << 8) | pix;
  }

  cannyEdgeCtx.putImageData(imgData, 0, 0);

  return cannyEdgeCtx
}


// 绘制contours
export function drawContourCanvas(url, id) {
  let mat = cv.imread(url);
  let dst = new cv.Mat();
  // let dst = cv.Mat.zeros(mat.rows, mat.cols, cv.CV_8UC3);
  // 高斯模糊
  cv.blur(mat, dst, new cv.Size(5, 5), new cv.Point(-1, -1), cv.BORDER_DEFAULT)
  // 边缘检测
  cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
  // You can try more different parameters
  cv.Canny(mat, dst, 305, 400, 3, false);

  cv.threshold(mat, mat, 0, 400, cv.THRESH_BINARY);
  
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  
  cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  for (let i = 0; i < contours.size(); ++i) {
    let cnt = contours.get(i)
    let rect = cv.boundingRect(cnt);
    if (
      (rect.width > 30 && rect.height > 20)
      && (rect.width < 50 && rect.height < 50)
    ) {
        let contoursColor = new cv.Scalar(255, 255, 255);
        cv.drawContours(dst, contours, i, contoursColor, 1, cv.LINE_8, hierarchy, 100);

        let rectangleColor = new cv.Scalar(255, 0, 0);
        let point1 = new cv.Point(rect.x, rect.y);
        let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
        
        cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
      }
  }


  cv.imshow(id, dst);
  // 绘制后清除缓存数据
  mat.delete();
  dst.delete(); 
  contours.delete(); 
  hierarchy.delete();
  cnt.delete();
}
