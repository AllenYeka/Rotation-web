import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
const fs = require('fs')
const path = require('path')
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5379,
    proxy: {
      "/v1/chat/completions": { target: 'https://wrq6827.top:443/', secure: false },
      "/v1/images/generations": { target: 'https://wrq6827.top:443/', secure: false },
      "/gateway": { target: 'http://127.0.0.1:8079/', rewrite: (path) => path.replace('/gateway', '') },
      "/rotation/api": { target: 'http://127.0.0.1:8079/', rewrite: (path) => path.replace('/rotation/api', '') },
      
      "/gitee_oauth": { target: 'https://gitee.com/', secure: false, changeOrigin: true, rewrite: (path) => path.replace('/gitee_oauth', '') },
      "/github_oauth": { target: 'https://github.com/', secure: false, changeOrigin: true, rewrite: (path) => path.replace('/github_oauth', '') },
      "/api/github_oauth/user": { target: 'https://api.github.com/', secure: false, changeOrigin: true, rewrite: (path) => path.replace('/api/github_oauth', '') },
    },
  },
})
