import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default ({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Default API URL if not provided in environment variables
  const apiUrl = env.VITE_APP_API_URL || ''
  
  return defineConfig({
    plugins: [react()],
    css: {
      postcss: {
        plugins: []
      },
      modules: {
        localsConvention: 'camelCaseOnly',
        generateScopedName: mode === 'development'
          ? '[local]_[hash:base64:5]'
          : '[hash:base64:5]'
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      // Make environment variables available to client-side code
      '__APP_ENV__': JSON.stringify(mode),
      '__API_URL__': JSON.stringify(apiUrl)
    },
    server: {
      hmr: {
        overlay: false
      },
      fs: {
        strict: true,
        allow: ['.']
      },
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  })
}