const getFileDetailByType = (type) => {
  const [resolveResFn, readFnMethodName] = type === 'dataURL' ? [
    e => e.target.result,
    'readAsDataURL'
  ] : [
    e => e.target.result,
    'readAsArrayBuffer'
  ]

  return (file) => new Promise(resolve => {
    const fr = new FileReader()
    fr.onload = (e) => {
      resolve(resolveResFn(e))
    }
    fr[readFnMethodName](file)
  })
}

export const getFileBuffer = getFileDetailByType('arrayBuffer')
export const getFileDataURL = getFileDetailByType('dataURL')
