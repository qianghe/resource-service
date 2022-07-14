import React, { useCallback, useRef, useState } from 'react';
import { Typography, Upload } from 'antd'
import useImgTypeService from './useImgTypeService'
import FileList, { STATUS_FAIL, STATUS_SUCCESS, STATUS_LOADING } from './FileList'
import './index.scss'

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const Describer = (
  <>
    <Title level={3}>FileTypeService</Title>
    <Paragraph>
      You can upload any type of an image, the service can help
      you check the actual type。
    </Paragraph>
  </>
)

function FileTypeService() {
  const [fileMap, setFileMap] = useState({})
  const fileMapRef = useRef({})
  const { check } = useImgTypeService({
    withPreview: true,
    notify: ({
      type,
      id: fileId,
      preview
    }) => {
      setFileMap((ex) => {
        const fileInfo = ex[fileId]
        if (!fileInfo) return ex
        
        const status = type === '' ? STATUS_FAIL : STATUS_SUCCESS
        return {
          ...ex,
          [fileId]: {
            ...fileInfo,
            status,
            type,
            preview
          }
        }
      })
    }
  })
  const handleBeforeUplod = useCallback((file) => {
    if (!file) return
    const fileInfo = {
      id: file.uid,
      name: file.name,
      status: STATUS_LOADING,
      preview: null
    }
    
    fileMapRef.current[file.uid] = fileInfo
    setFileMap((ex) => ({
      ...ex, 
      [file.uid]: fileInfo
    }))

    check({
      file,
      id: file.uid,
      name: file.name
    })

    return false
  }, [check])
 
  return (
    <>
      <div className="itc">
        {Describer}
        <Dragger
          accept="image/*"
          multiple={true}
          beforeUpload={handleBeforeUplod}
          itemRender={() => ''}
        >
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Dragger>
      </div>
      <FileList files={Object.values(fileMap).reverse()} />
    </>
  );
}

export default FileTypeService;
