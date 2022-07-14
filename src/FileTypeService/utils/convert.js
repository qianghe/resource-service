// 十进制转换成十六进制
export const convert2Hex = (num) => {
  if (num === 0) return 0
  
  let hexBits = [] 
  while (num) {
    hexBits.push(~~(num / 16))
    num %= 16

    if (num < 16) {
      hexBits.push(num)
      num = 0
    }
  }

  if (hexBits.length === 1) {
    hexBits.unshift('0')
  }

  return hexBits.map(bit => {
    if (bit >= 10) {
      return String.fromCharCode('A'.charCodeAt(0) + bit - 10) 
    }
    return bit
  }).join('')
}

// 转换成2进制
const convert2Raw = (num) => {
  let bits = ''
 
  while (num) {
    bits = num % 2 + bits
    num = ~~(num / 2)
  }

  const fillLen = 8 - bits.length
  if (fillLen > 0) {
    return new Array(fillLen).fill('0').join('') + bits
  }
  return bits
}
export const base64ToBlob = async (base64) => {
  const res = await fetch(base64)
  const blob = await res.blob()

  return URL.createObjectURL(blob)
}

export const getByteOccus = (offset, len) => new Array(len).fill(0).map((_, index) => index + offset)
const getFormatCharsFromBS = (type) => {
  let convertor = null
  switch(type) {
    case 'hex':
      convertor = convert2Hex
      break
    case 'iso':
      convertor = String.fromCharCode
      break
    case 'raw':
      convertor = convert2Raw
      break
    default:
      convertor = (res) => res
  }
  return (buffer, occus) => {
    if (!convertor) return
    
    return occus.map((elm) => {
      const dv = new DataView(buffer.slice(elm, elm + 1))
      return convertor(dv.getUint8(0))
    })
  }
}
export const getHexsFromBufferSlice = getFormatCharsFromBS('hex')
export const getISOFromBufferSlice = getFormatCharsFromBS('iso')
export const getBinaryFromBufferSlice = getFormatCharsFromBS('raw')