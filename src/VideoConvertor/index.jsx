import React, { useCallback, useRef } from 'react';
import { Space, Button, Typography } from 'antd';
import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { translate } from './utils'
import './index.scss'

const { Title, Text } = Typography;

const Describtion = () => (
  <>
    <Title level={2}>Video to gif convertor</Title>
    <Space direction="vertical">
      <Text mark>help to convert</Text>
      <Text type="secondary">Just try it, upload an vedio file.</Text>
    </Space>
  </>
)

function VideoConvertor() {
  const rawRef = useRef()
  const gifRef = useRef()
  
  // 处理上传的视频
  const handleChange = useCallback(async (event) => {
    const file = event.target.files[0]
    if (!file) return
    // raw
    const rawBlob = URL.createObjectURL(file)
    rawRef.current.src = rawBlob
    // gif
    const blob = await translate(file)
    gifRef.current.src = blob
  }, [])
  const isLoading = rawRef.current && !gifRef.current

  return (
    <div className="convertor">
      <Describtion />
      <Button type="primary" icon={<CloudUploadOutlined />}>
        <input type="file" onChange={handleChange} />
        Upload
      </Button>
      <div className="list">
        <div className="item">
          <span className="tag">Raw Vedio</span>
          <video src="" alt="" ref={rawRef} />
        </div>
        <div className="item">
          <span className="tag">Convert GIF</span>
          <img src="" alt="" ref={gifRef} />
          {
            isLoading ? <LoadingOutlined className="loading" /> : ''
          }
        </div>
      </div>
    </div>
  );
}

export default VideoConvertor;
