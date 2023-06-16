import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PageToEditor from 'vite-plugin-vue-page-to-editor'

export default defineConfig({
  plugins: [
    vue(),
    PageToEditor(),
  ],
})
