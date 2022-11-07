export const getGrayCanvasData = (imgData, clone = true) => {
  const { data, width, height, colorSpace } = imgData
  let copyImgData = imgData

  if (clone) {
    copyImgData = new ImageData(data, width, height, { colorSpace })
  }
  const { data: colorList } = copyImgData
  
  for (let i = 0; i < colorList.length; i += 4) {
    const [r, g, b] = [
      colorList[i],
      colorList[i + 1],
      colorList[i + 2]
    ]

    const gray = (r + g + b) / 3
    ;[i, i + 1, i + 2].forEach((loc) => {
      colorList[loc] = gray
    })
  }

  return copyImgData
}