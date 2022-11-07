let pyodide = null
let stdinbuffer = null
let rerun = false
let readlines = []

const replaceStdioCode = `
import sys
import fakeprint

sys.stdout = fakeprint.stdout
sys.stderr = fakeprint.stdout
sys.stdin = fakeprint.stdin
`
const getCode = ({ url, title }) => {
  return `
  import requests
  import re
  import json

  url = "https://www.bilibili.com/video/BV1eS4y157kG?p=11&vd_source=6a3b6a883ff2ce854cdaf280a1349622"
  headers = {
  'referer': "https://www.bilibili.com/",
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
  }
  response = requests.get(url, headers=headers)

  video_info = re.findall('<script>window.__playinfo__=(.*?)</script>', response.text)[0]
  json_data = json.loads(video_info)
  audio_url = json_data['data']['dash']['audio'][0]['base_url']
  video_url = json_data['data']['dash']['video'][0]['base_url']
  print('audio_url:'+audio_url)
  print('video_url:'+video_url)

  audio_content = requests.get(audio_url, headers=headers).content
  video_content = requests.get(video_url, headers=headers).content

  title = "${title}"
  with open(title + '.mp3', mode='wb') as f:
    f.write(audio_content)
  with open(title + '.mp4', mode='wb') as f:
    f.write(video_content)
  `
}

const stdout = {
  write: (s) => {
    postMessage({
      type: 'stdout',
      stdout: s,
    })
  },
  flush: () => {},
}

const stderr = {
  write: (s) => {
    postMessage({
      type: 'stderr',
      stdout: s,
    })
  },
  flush: () => {},
}

const stdin = {
  readline: () => {
    // Send message to activate stdin mode
    postMessage({
      type: 'stdin',
    })
    let text = ''
    Atomics.wait(stdinbuffer, 0, -1)
    const numberOfElements = stdinbuffer[0]
    stdinbuffer[0] = -1
    const newStdinData = new Uint8Array(numberOfElements)
    for (let i = 0; i < numberOfElements; i++) {
      newStdinData[i] = stdinbuffer[1 + i]
    }
    const responseStdin = new TextDecoder('utf-8').decode(newStdinData)
    text += responseStdin
    return text
  },
}

const run = async (code) => {
  try {
    pyodide.runPython(code)
  } catch (err) {
    postMessage({
      type: 'stderr',
      stderr: err.toString(),
    })
  }
  postMessage({
    type: 'finished',
  })
}

const initialise = async () => {
    importScripts('https://cdn.jsdelivr.net/pyodide/v0.21.0/full/pyodide.js')

    // @ts-ignore
    pyodide = await loadPyodide({
        fullStdLib: false,
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.21.0/full/',
    })

    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install('requests')
    
    postMessage({
      type: 'ready',
    })

    // Unfortunately we need to fake-out stdin/stdout/stderr because Pyodide
    // doesn't give us access to the underlying emscripten FS streams which
    // must be set up on initialisation.
    pyodide.registerJsModule('fakeprint', {
      stdout: stdout,
      stderr: stderr,
      stdin: stdin,
    })
    pyodide.runPython(replaceStdioCode)
}

initialise()

onmessage = function (e) {
  switch (e.data.type) {
    case 'run':
        stdinbuffer = new Int32Array(e.data.buffer)
        const params = e.data.params

        run(getCode(params))
        break
  }
}
