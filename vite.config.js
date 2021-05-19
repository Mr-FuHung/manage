import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {//服务相关配置
    host:'localhost',
    port: 8080,//端口
    open:true,//自动打开
    proxy:{//代理
      "/v1":{
        target:'http://localhost:3000'
      }
    }
  },
  plugins: [vue()]
})
