
import { useEffect } from 'react'

const antdStyleMemo = {
  light: null,
  dark: null
}

function useAntdCss({ theme = 'light' } = { theme: 'light' }) {
  useEffect(() => {
    if (!antdStyleMemo[theme]) {
      if (theme === 'light') {
        import('antd/dist/antd.css')
      } else {
        import("antd/dist/antd.dark.css")
      }
    } else {
      const $head = document.getElementsByTagName('head')
      if ($head) {
        $head[0].appendChild(antdStyleMemo[theme])
      }
    }
    
    
    return () => {
      const $styles = document.getElementsByTagName('style')
      if (!$styles) return
      
      ;[...$styles]
        .filter($s => $s.innerHTML.indexOf('antd') > -1)
        .forEach($node => {
          $node.remove()
          console.log('...remove')
          if (!antdStyleMemo[theme]) {
            antdStyleMemo[theme] = $node
          }
        })
    }
  }, [])

  return {}
}

export default useAntdCss