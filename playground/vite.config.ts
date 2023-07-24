import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import PageToEditor from '../src/index'

export default defineConfig({
  plugins: [
    vue(),
    PageToEditor(),
  ],
})
