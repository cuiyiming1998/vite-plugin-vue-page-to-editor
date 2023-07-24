import type { Plugin } from 'vite'
import { transform } from './transform'
import { configureServer } from './server'
import { resolveId } from './resolveId'
import type { Option } from './types'

export const SOURCE_KEY = 'vue-code-to-page-path:'

export default function PageToEditor(option?: Option): Plugin {
  return {
    name: 'vite-plugin-vue-page-to-editor',

    apply: (_: any, { command }: any) => {
      return command === 'serve'
    },

    enforce: 'pre',

    resolveId,

    transform(code, id) {
      return transform(code, id, option)
    },

    configureServer,
  }
}
