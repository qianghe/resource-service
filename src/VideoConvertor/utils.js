import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({
  log: true,
});

export const translate = async (file) => {
  await ffmpeg.load()
  console.log('Start transcoding')
  ffmpeg.FS('writeFile', file.name, await fetchFile(file));
  ffmpeg.setProgress((p)=> {
    console.log('*************progress..........', p)
  })

  const targetFile = 'demo.gif'
  const res = await ffmpeg.run('-i', file.name, targetFile);
  console.log('Complete transcoding');

  const data = ffmpeg.FS('readFile', targetFile);
  const resourceBlob = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))
  
  return resourceBlob
}