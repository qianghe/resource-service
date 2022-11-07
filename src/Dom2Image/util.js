// 构造Image
export const makeImage = (url) => {
  let resolver = null
  const promise = new Promise(resolve => resolver = resolve)
  const image = new Image()
  image.onload = () => {
    resolver(image)
  }
  image.src = url

  return promise
}

// 构造uid生成器
const generateUIDCreator = () => {
  var index = 0;

  return function () {
      return 'u' + fourRandomChars() + index++;

      function fourRandomChars() {
          /* see http://stackoverflow.com/a/6248722/2519373 */
          return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString()).slice(-4);
      }
  };
}

export const getUID = generateUIDCreator()


// image to dataURL

export const drawImage2Canvas = (image) => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height

  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0)

  return canvas
} 
export const getDataURL = (image) => {
  const canvas = drawImage2Canvas(image)

  return canvas.toDataURL()
}

// download image
export const download = (dataURL, fileType = 'png') => {
  const link = document.createElement('a')
  link.href = dataURL
  link.download = `hq_image_${(new Date().getTime).toString().slice(0, 4)}.${fileType}`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


// hack sleep function
export const sleep = async (time = 50) => new Promise(resolve => {
  setTimeout(() => resolve(), time)
})


const px = (node, property) => {
  const value = window.getComputedStyle(node).getPropertyValue(property)
  
  return parseFloat(value.replace('px', ''))
}

export const getWidth = (node) => {
  const borderLeft = px(node, 'border-left-width')
  const borderRight = px(node, 'border-right-width')

  return node.scrollWidth+ borderLeft + borderRight
}

export const getHeight = node => {
  const borderTop = px(node, 'border-top-width')
  const borderBottom = px(node, 'border-bottom-width')

  return node.scrollHeight + borderTop + borderBottom
}
