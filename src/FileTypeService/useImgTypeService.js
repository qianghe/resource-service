import { useCallback } from 'react'
import { getFileBuffer, getFileDataURL } from './utils/reader'
import { base64ToBlob } from './utils/convert'
import getImgType from './utils/imgType'

function useImgTypeService({
  withPreview = false,
  notify
}) {
  const check = useCallback(async (fileInfo) => {    
    const { file, ...props } = fileInfo
    const buffer = await getFileBuffer(file)
    const imgType = getImgType(buffer)
    let preview = null
    let base64 = null
    if (imgType && withPreview) {
      base64 = await getFileDataURL(file)
      preview = await base64ToBlob(base64)
    }
    await new Promise(resolve => {
      setTimeout(() => resolve(), 5000)
    })
    notify({
      type: imgType,
      ...props,
      preview
    })
  }, [withPreview, notify])
  
 
  return {
    check,
  }
}

export default useImgTypeService