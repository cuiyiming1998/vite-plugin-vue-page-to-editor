import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ChildProcess from 'node:child_process'
import os from 'node:os'
import { normalizePath } from 'vite'
import type { Option } from './types.d'

const SOURCE_KEY = 'vue-code-to-page-path:'

function getPluginPath() {
  const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)))
  // const pluginPath = path.dirname(fileURLToPath(import.meta.url))
  console.log(path.dirname(fileURLToPath(import.meta.url)))
  console.log(pluginPath)
  return pluginPath.replace(/\/dist$/, '/src')
}

export default function PageToEditor(option?: Option): any {
  function getCodeLine(code: string, id: string) {
    const codeList = code.split('\n')
    const processed = codeList.map((item, index) => {
      return addAttr(item, index + 1, id)
    })
    return processed.join('\n')
  }

  function addAttr(code: string, line: number, id: string) {
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

  return {
    name: 'vite-plugin-vue-page-to-editor',
    apply: (_: any, { command }: any) => {
      return command === 'serve'
    },
    enforce: 'pre',

    resolveId(source: string) {
      const pluginPath = getPluginPath()
      if (source.startsWith(SOURCE_KEY)) {
        const resolved = source.replace(SOURCE_KEY, `${pluginPath}/`)
        return resolved
      }
    },

    transform(code: string, id: string) {
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
        return getCodeLine(code, id)
      return code
    },

    configureServer(server: any) {
      server.middlewares.use((req: any, _: any, next: any) => {
        if (req._parsedUrl.pathname === '/code-position') {
          const path
            = req._parsedUrl.query && req._parsedUrl.query.split('=')[1]
          if (path && path !== 'null') {
            if (process.env.VITE_EDITOR === 'webstorm') {
              const linePath = path.split(':')[1]
              const filePath = path.split(':')[0]
              const platform = getOs()
              if (platform === 'win32') {
                ChildProcess.exec(
                  `webstorm64.exe  --line ${linePath} ${filePath}`,
                )
              }
              else {
                ChildProcess.exec(
                  `webstorm64  --line ${linePath} ${filePath}`,
                )
              }
            }
            else {
              ChildProcess.exec(`code -r -g ${path}`)
            }
          }
        }
        next()
      })
    },
  }
}

function getOs() {
  const platform = os.platform()
  return platform
}
