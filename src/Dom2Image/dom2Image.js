import { makeImage, getUID, getDataURL, getWidth, getHeight} from './util'

const SvgNamespace = 'http://www.w3.org/2000/svg'

class Dom2Image {
  fixSvg(clone) {
    if (!(clone instanceof SVGElement)) return
    
    clone.setAttribute('xmlns', SvgNamespace)
  }
  // clone pseudo elements
  // for it is created by css, so we copy it as style element
  clonePseudoElements(original, clone, element) {
    const currentStyles = window.getComputedStyle(original, element)
    const content = currentStyles.getPropertyValue('content')
    if (!content || content === 'none') return

    const className = getUID()
    const style = document.createElement('style')
    // add pseudo inline style
    clone.className = clone.className + ' ' + className
    style.appendChild(getPseudoElementStyle(currentStyles, className))
    clone.appendChild(style)

    function getPseudoElementStyle(styles, className, pseudo) {
      const selector = `.${className}:${pseudo}`
      const content = styles.getPropertyValue('content')
      
      let cssText = ''
      if (styles.cssText) {
        cssText = `${cssText} content: ${content};`
      } else {
        cssText = [...styles]
          .map(name => `${name}: ${styles.getPropertyValue(name)} ${styles.getPropertyPriority(name) || '!important'};`)
          .join('; ')
      }
      
      return document.createTextNode(`${selector} { ${cssText} }`)
    }
  }

  // clone css style
  cloneStyle(original, clone) {
    const currentStyles = window.getComputedStyle(original)

    // inline style
    if (currentStyles.cssText) clone.style.cssText = currentStyles.cssText

    // css style
    ;[...currentStyles].forEach(styleName => {
      clone.style.setProperty(
        styleName, 
        currentStyles.getPropertyValue(styleName),
        currentStyles.getPropertyPriority(styleName)
      )
    })
  }

  // clone dom node
  async cloneNode(node) {
    // canvas dom, need convert to dataURL resource
    if (node instanceof HTMLCanvasElement) return await makeImage(node.toDataURL())
    
    // clone dom
    const clone = node.cloneNode(false)

    if (!(clone instanceof Element)) return clone;
    // convert image.src to dataURL
    if (node instanceof HTMLImageElement) {
      clone.src = getDataURL(node)
    }
    // style
    this.cloneStyle(node, clone)
    // pseudo element
    ;['before', 'after'].forEach(element => {
      this.clonePseudoElements(node, clone, element)
    })

    // add namespace
    this.fixSvg(clone)

    // iterate to get the cloned domNode(with styles)
    const children = [...node.childNodes]
    if (children.length > 0) {
      const childNodes = await Promise.all([...children].map(child => this.cloneNode(child)))
      childNodes.forEach(childNode => clone.appendChild(childNode))
    }
   
    return clone
  }

  async toSvg(dom) {
    const clone = await this.cloneNode(dom)
    return Promise.resolve(clone)
      .then((clone) => {
        return new XMLSerializer().serializeToString(clone)
      })
      .then((str) => str.replace(/#/g, '%23').replace(/\n/g, '%0A'))
      .then((xhtml) => `<foreignObject x="0" y="0" width="100%" height="100%">${xhtml}</foreignObject>`)
      .then((foreignObject) => {
        const width = getWidth(dom)
        const height = getHeight(dom)
        return `<svg xmlns="${SvgNamespace}" width="${width}" height="${height}">${foreignObject}</svg>`
      })
      .then((svg) => {
        return 'data:image/svg+xml;charset=utf-8,' + svg
      })
  }

  toPng(dom) {
    return this.toSvg(dom)
      .then(svg => makeImage(svg))
      .then(image => getDataURL(image))
  }

  toJpeg(dom) {
    return this.toSvg(dom)
      .then(svg => makeImage(svg))
      .then(image => drawImage2Canvas(image))
      .then(canvas => canvas.toDataURL('image/jpeg', 1.0))
  }
}


export default Dom2Image