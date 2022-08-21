import React, { useCallback, useRef } from 'react';
import { Space, Button, Progress, Typography } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons'
import useConvertor from './useConvertor';
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
  const canvasRef = useRef()
  const {
    isProgress, progress, translate,
    isPlaying, play, pause
  } = useConvertor({
    needControll: true,
    controllRef: canvasRef
  })
  const clearRef = () => {
    rawRef.current.src = ''
    gifRef.current.src = ''
    // canvas
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
  // 处理上传的视频
  const handleChange = useCallback(async (event) => {
    const file = event.target.files[0]
    if (!file) return
    clearRef()
    // raw
    const rawBlob = URL.createObjectURL(file)
    rawRef.current.src = rawBlob
    // gif
    const blob = await translate(file)
    gifRef.current.src = blob
  }, [])
  const handleControl = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying])
  const showInfo = isProgress || rawRef.current

  return (
    <div className="convertor">
      <Describtion />
      <Button type="primary" icon={<CloudUploadOutlined />}>
        <input type="file" onChange={handleChange} />
        Upload
      </Button>
      <div className="list" style={{
        visibility: showInfo ? 'visible' : 'hidden'
      }}>
        <div className="item">
          <span className="tag">Raw Vedio</span>
          <video src="" alt="" ref={rawRef} />
        </div>
        <div className="item">
          <span className="tag">Convert GIF</span>
          <img src="" alt="" ref={gifRef} />
          {
            isProgress ? <Progress
              showInfo={false}
              percent={parseInt(progress * 100)}
              steps={4}
              strokeColor={['#bfbfbf', '#595959', '#434343', '#1f1f1f']}
            /> : ''
          }
        </div>
        <div className="item item-control">
          <span className="tag">Controller</span>
          <div className="control-content">
            <canvas ref={canvasRef} width="240" height="170"/>
            <div className="controllBtn" onClick={handleControl}>
              {
                isPlaying ? 'pause' : 'play'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoConvertor;
