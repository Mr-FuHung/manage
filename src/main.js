import { createApp } from 'vue';    //导入vue实力方法
import App from './App.vue';    //引入App模板
import router from './routes';//引入路由
import ElementPlus from 'element-plus'; //全量引入组件库
import 'element-plus/lib/theme-chalk/index.css';//组件库样式
import config from './config';
import axios from 'axios';

axios.post(`${config.mockApi}/login`).then(res => {
    console.log(res)
})

// import.meta.env //环境变量

const app = createApp(App);//创建Vue实例
app.use(router).use(ElementPlus).mount('#app')//假装相关组件并挂载dom
