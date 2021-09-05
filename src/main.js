import { createApp, nextTick } from 'vue';    //导入vue实力方法
import App from '@/App.vue';    //引入App模板
import router from '@/routes';//引入路由
import vuex from '@/store';//引入VUEX
import ElementPlus from 'element-plus'; //全量引入组件库
import 'element-plus/lib/theme-chalk/index.css';//组件库样式
import locale from 'element-plus/lib/locale/lang/zh-cn'//切换为中文
import 'element-plus/lib/theme-chalk/display.css';//隐藏样式
// import config from './config';
// import ajax from '@/utils/ajax';
import api from '@/api';
import storage from '@/utils/storage';
import Rocket from '@/packages';

// import.meta.env //环境变量
const app = createApp(App);//创建Vue实例


app.directive('permission', {
    async beforeMount(el, binding) {
        //获取权限列表
        let buttonList = storage.getItem('buttonList');
        let hasPermission = buttonList.includes(binding.arg);
        if (!hasPermission) {
            el.style = 'display:none';//隐藏
            setTimeout(() => {
                el.parentNode.removeChild(el);//并删除自身
            }, 0)//变成宏任务
        }
    }
})


// app.config.globalProperties.$ajax = ajax;//挂载全局变量
app.config.globalProperties.$api = api;//挂载全局变量
app.config.globalProperties.$storage = storage;

app.use(router).use(vuex).use(ElementPlus, { size: 'small ', locale }).use(Rocket).mount('#app')//加载相关组件并挂载dom
