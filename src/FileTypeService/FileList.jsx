import React from 'react';
import { Tag } from 'antd';
import { LoadingOutlined, PictureOutlined, FrownTwoTone, SmileTwoTone } from '@ant-design/icons';
import './FileList.scss';

export const STATUS_FAIL = 0
export const STATUS_SUCCESS = 1
export const STATUS_LOADING = 2

const getStatusIcon = status => {
  return {
    [STATUS_FAIL]: <FrownTwoTone twoToneColor="#eb2f96" />,
    [STATUS_SUCCESS]: <SmileTwoTone twoToneColor="#52c41a" />,
    [STATUS_LOADING]: <LoadingOutlined />
  }[status]
}

const FailOrLoadingItem = ({ name, status }) => (
  <div className="file-listItem-failOrload" style={{
    '--bg': status === STATUS_FAIL ? 'rgb(255, 240, 246)' : 'rgba(214, 214, 214, 0.5)',
    ...status === '' ? { filter: 'opacity(0.6)'} : {}
  }}>
    <PictureOutlined style={{ fontSize: 50, opacity: 0.8 }} />
    <div>
      <span className="name">{name}</span>
      <span className={status === STATUS_FAIL ? 'fail-tip': 'loading-tip'}>
        {status === STATUS_FAIL ? 'check fail' : 'checking...'}
        {getStatusIcon(status)}
      </span>
    </div>
  </div>
)

const SuccessItem = ({ name, type, preview }) => (
  <div className="file-listItem-success" style={{
    '--bg': 'rgb(246, 255, 237)'
  }}>
    <img src={preview} alt="preview" />
    <div>
      <span className="name">{name}</span>
      <Tag color="lime">{type}</Tag>
    </div>
  </div>
)

function FileList({ files = [] }) {
  if (files.length === 0) return ''

  return (
   <div className="file-list">
     {
        files.map(file => {
          const { id, name, preview, status, type } = file
          if (status === STATUS_SUCCESS) {
            return (
              <SuccessItem key={id} preview={preview} name={name} type={type} />
            )
          } 
          return <FailOrLoadingItem key={id} name={name} status={status} />
        })
     }
   </div>
  )
}

export default FileList;
