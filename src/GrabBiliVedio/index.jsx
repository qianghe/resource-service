import React, { useCallback, useState, useRef } from 'react';
import { Steps } from 'antd';
import { Describer, EasyForm } from './Slot';
import useAntdCss from '../hooks/useAntdCss'
import WorkerManager from './worker-manager'
import './index.scss';

const { Step } = Steps;

const stdio = {
  stdout: (s) => { console.log('log...', s) },
  stderr: (s) => { console.log('error', s) },
  stdin: () => {
      return ''
  }
}

function GrabBiliVedio() {
  const [title, setTitle] = useState('test')
  const [url, setUrl] = useState('https://www.bilibili.com/video/BV1eS4y157kG?p=11&vd_source=6a3b6a883ff2ce854cdaf280a1349622')
  const [loading, setLoading] = useState(false)
  const workerManagerRef = useRef(null)
  // 自动加载主题
  useAntdCss({ theme: 'dark' })

  const handleChange = useCallback((e, type) => {
    const { value } = e.target
    if (type === 'title') {
      setTitle(value)
    } else {
      setUrl(value)
    }
  }, [])

  const handleClick = useCallback(async () => {
    setLoading(true)

    if (!workerManagerRef.current) {
      workerManagerRef.current = new WorkerManager(new URL('./python-worker.js', import.meta.url), stdio)
    }

    const res = await workerManagerRef.current.runCode({
      url,
      title
    })
    console.log('res', res)
    setLoading(false)
  }, [url, title])

  return (
    <div className="grab-vedio">
      {Describer}
      <EasyForm
        title={title}
        url={url}
        handleChange={handleChange}
        handleClick={handleClick}
        loading={loading}
      />
      {/* <Steps current={1} percent={60} labelPlacement="vertical">
        <Step title="Finished" description="This is a description." />
        <Step title="In Progress" description="This is a description." />
        <Step title="Waiting" description="This is a description." />
      </Steps> */}
    </div>
  );
}

export default GrabBiliVedio;
