import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: []
    },
    modules: {
      // 在开发模式下保留原始类名（添加后缀）
      localsConvention: 'camelCaseOnly',
      generateScopedName: process.env.NODE_ENV === 'development'
        ? '[local]_[hash:base64:5]'
        : '[hash:base64:5]'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    hmr: {
      overlay: false
    },
    fs: {
      strict: true,
      allow: ['.']
    }
  },
  configFile: resolve(__dirname, 'vite.config.js')
})