import { getByteOccus, getISOFromBufferSlice, getBinaryFromBufferSlice } from './convert';
// 针对扩展类型的webp单独判断
const extendChunkName = 'VP8X'
const ccipChunkName = 'ICCP'
const animationBitLoc = 6
const iccBitLoc = 3

export const isExtendWebpType = (buffer) => {
  const chunkHeader = getISOFromBufferSlice(buffer, getByteOccus(12, 4)).join('')
  
  return chunkHeader === extendChunkName
}


// 参考 https://developers.google.com/speed/webp/docs/riff_container#animation
export const supportAnimation = (buffer) => {
  const option = getBinaryFromBufferSlice(buffer, getByteOccus(16, 1)).join('')
  const nextChunkHeader = getISOFromBufferSlice(buffer, getByteOccus(30, 4)).join('')
  if (nextChunkHeader === ccipChunkName && parseInt(option[iccBitLoc] || 0) === 0) return false
  
  return parseInt(option[animationBitLoc] || 0) === 1
}
