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
    const base64 = await getFileDataURL(file)
    const buffer = await getFileBuffer(file)
    let imgType = getImgType(buffer)
    if (!imgType) {
      const mimeType = base64.match(/^data:(.+);base64/)[1]
      if (mimeType.indexOf('image/svg') > -1) {
        imgType = mimeType
      }
    }
    let preview = null
    if (imgType && withPreview) {
      preview = await base64ToBlob(base64)
    }

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