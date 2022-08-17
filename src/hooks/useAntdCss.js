
import { useEffect } from 'react'
import 'antd/dist/antd.css'

let antdStyleMemo = null

function useAntdCss() {
  useEffect(() => {
    if (antdStyleMemo) {
      const $head = document.getElementsByTagName('head')
      if ($head) {
        $head[0].appendChild(antdStyleMemo)
      }
    }

    return () => {
      const $styles = document.getElementsByTagName('style')
      if (!$styles) return
      [...$styles]
        .filter($s => $s.innerHTML.indexOf('antd') > -1)
        .forEach($node => {
          antdStyleMemo = $node
          $node.remove()
        })
    }
  }, [])

  return {}
}

export default useAntdCss