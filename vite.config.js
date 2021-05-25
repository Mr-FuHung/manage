import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path');
// https://vitejs.dev/config/
export default defineConfig({
  server: {//服务相关配置
    host: 'localhost',
    port: 8080,//端口
    open: true,//自动打开
    proxy: {//代理
      "/v1": {
        target: 'http://localhost:3000'
      }
    }
  },
  resolve: {
    alias: {//别名
      '@': path.resolve(__dirname, './src')
    }
  },
  css:{
    preprocessorOptions:{
      scss:{
        // additionalData: `@import '@/assets/style/base.scss';`//可全局引入scss变量，与app.vue中的引入不同
      }
    }
  },
  plugins: [vue()]
})
