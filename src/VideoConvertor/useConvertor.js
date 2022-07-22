import { useCallback, useEffect, useRef, useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function useConvertor({ needControll = false, controllRef = null }) {
  const [progress, setProgress] = useState(0)
  const [isProgress, setIsProgress] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const resourceInfo = useRef({})
  const intervalTimer = useRef()
  const frameIndexRef = useRef(1)
  // 设置帧率为25,每一秒播放的帧个数
  const rate = 25
  const ffmpegRef = useRef(createFFmpeg({
    log: true,
    progress: ({ duration, ratio }) => {
      if (duration) {
        resourceInfo.current.duration = duration
      }
      if (ratio) {
        setProgress(ratio)
      }
    }
  }))
  const drawFrame = async (frameIndex, ctx) => {
    const ffmpeg = ffmpegRef.current
    const data = ffmpeg.FS('readFile', `image${frameIndex}.jpg`);
    const imageBitmap = await window.createImageBitmap(new Blob([data.buffer]));
    
    ctx.drawImage(imageBitmap, 0, 0, 240, 170);
  }
  const translate = useCallback(async (file, targetName = 'demo') => {
    const ffmpeg = ffmpegRef.current
    console.log('Start transcoding')
    await ffmpeg.load()
    
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    const targetFile = `${targetName}.gif`

    setIsProgress(true)
    await ffmpeg.run('-i', file.name, targetFile);
    if (needControll) {
      await ffmpeg.run('-i', targetFile, '-vf', `fps=${rate}`, '-s', '720x510', 'image%d.jpg');
      // 绘制第一帧
      const $canvas = controllRef.current
      const ctx = $canvas.getContext('2d')
      drawFrame(1, ctx)
    }
    setIsProgress(false)
    console.log('Complete transcoding');

    const data = ffmpeg.FS('readFile', targetFile);
    const resourceBlob = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))
    
    return resourceBlob
  }, [])
  
  // 暂停
  const pause = useCallback(() => {
    if (!needControll || !controllRef || !isPlaying) return
    
    setIsPlaying(false)
    clearInterval(intervalTimer.current)
  }, [needControll, controllRef, isPlaying])
  // 播放gif
  const play = useCallback(() => {
    if (!needControll || !controllRef || isPlaying) return
    const { duration } = resourceInfo.current
    const iframeLen = ~~(duration * rate)
    const interval = ~~((duration * 1000) / iframeLen)
    const $canvas = controllRef.current
    const ctx = $canvas.getContext('2d')
    
    setIsPlaying(true)

    intervalTimer.current = setInterval(async () => {
      await drawFrame(frameIndexRef.current, ctx)
      
      frameIndexRef.current += 1

      if (frameIndexRef.current > iframeLen) {
        frameIndexRef.current = 1
        setIsPlaying(false)
        clearInterval(intervalTimer.current)
      }
    }, interval)
  }, [needControll, controllRef, isPlaying])
  // 重新播放
  const rePlay = useCallback(() => {
    if (!needControll || !controllRef) return

    pause()
    frameIndexRef.current = 1
    play()
  }, [needControll, controllRef])

  useEffect(() => {
    return () => {
      intervalTimer.current && clearInterval(intervalTimer.current)
    }
  }, [])
  
  return {
    isProgress,
    progress,
    resourceInfo: resourceInfo.current,
    translate,
    isPlaying,
    play,
    rePlay,
    pause
  }
}

export default useConvertor