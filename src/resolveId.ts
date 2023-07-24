import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { normalizePath } from 'vite'
import { SOURCE_KEY } from './index'

function getPluginPath() {
  const pluginPath = normalizePath(path.dirname(fileURLToPath(import.meta.url)))
  return pluginPath.replace(/\/dist$/, '/src')
}

export function resolveId(source: string) {
  const pluginPath = getPluginPath()
  if (source.startsWith(SOURCE_KEY)) {
    const resolved = source.replace(SOURCE_KEY, `${pluginPath}/`)
    return resolved
  }
}
