import React from 'react'
const routes = [{
  path: '/file-type',
  name: '文件类型检测',
  component: React.lazy(() => import('./FileTypeService'))
}, {
  path: '/video-convertor',
  name: '视频转GIF',
  component: React.lazy(() => import('./VideoConvertor'))
}, {
  path: '/lucky-card',
  name: 'Canvas处理图像Demo',
  component: React.lazy(() => import('./LuckyCard'))
}]

export default routes