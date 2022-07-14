import { getByteOccus, getHexsFromBufferSlice } from './convert'
import { isExtendWebpType, supportAnimation } from './webp'
const signatureLen = 8
const signatureByteOccus = getByteOccus(0, signatureLen)

const getImgType = (buffer) => {
  const signature = getHexsFromBufferSlice(buffer, signatureByteOccus).join(' ')
  const imgSignMap = {
    '89 50 4E 47 0D 0A 1A 0A': 'png',
    'FF D8 FF': 'jpg/jpeg',
    '52 49 46 46 ': 'webp',
    '47 49 46 38': 'gif'
  }
  const signs = Object.keys(imgSignMap)
  for (let i = 0; i < signs.length; i++) {
    const curSign = signs[i]

    if (signature.indexOf(curSign) > -1) {
      if (imgSignMap[curSign] === 'webp') {
         if (isExtendWebpType(buffer) && supportAnimation(buffer)) {
          return 'webp-animated'
         }
      }
      return imgSignMap[curSign]
    }
  }

  return ''
}

export default getImgType