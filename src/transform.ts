import type { Option } from './types'
import { SOURCE_KEY } from './index'

function addAttr(code: string, line: number, id: string, option?: Option) {
  if (!/^\s+</.test(code))
    return code

  const reg = /((((^(\s)+\<))|(^\<))[\w-]+)|(<\/template)/g
  let matchedTag = code.match(reg)
  if (matchedTag) {
    // @ts-expect-error
    matchedTag = Array.from(new Set(matchedTag))
    let skip = [
      'KeepAlive',
      'template',
      'keep-alive',
      'transition',
      'router-view',
    ]
    if (option?.skipTags?.length)
      skip = skip.concat(option.skipTags)
      // @ts-expect-error
    matchedTag.forEach((item) => {
      if (item && !skip.some(i => item.includes(i))) {
        const reg = new RegExp(`${item}`)
        const location = `${item} code-location="${id}:${line}"`
        code = code.replace(reg, location)
      }
    })
  }
  return code
}

function getCodeLine(code: string, id: string, option?: Option) {
  const codeList = code.split('\n')
  const processed = codeList.map((item, index) => {
    return addAttr(item, index + 1, id, option)
  })
  return processed.join('\n')
}

export function transform(code: string, id: string, option?: Option) {
  const index = id.lastIndexOf('.')
  const ext = id.substring(index + 1)
  if (
    ['main.ts', 'main.js']
      .includes(id.substring(id.lastIndexOf('/') + 1))
  ) {
    const imported: any = `${code}\nimport '${SOURCE_KEY}init.js'`
    return {
      code: imported,
    }
  }

  if (ext.toLowerCase() === 'vue')
    return getCodeLine(code, id, option)
  return code
}
