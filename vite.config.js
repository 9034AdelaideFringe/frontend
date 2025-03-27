import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [] // 空数组而不是 false
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    hmr: {
      overlay: false // 禁用错误覆盖
    },
    fs: {
      strict: true, // 限制访问仅限于当前工作目录
      allow: ['.'] // 仅允许当前目录
    }
  },
  // 强制使用本地配置，忽略父目录的配置
  configFile: resolve(__dirname, 'vite.config.js')
})