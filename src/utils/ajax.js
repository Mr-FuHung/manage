/* 
*axios二次封装
*/

import axios from 'axios';
import config from '@/config';
import { ElMessage } from 'element-plus';
import router from '@/routes';
import storage from '@/utils/storage';
const NETWORK_ERROR = '网络请求异常';
const instance = axios.create({
    baseURL: config.mock ? config.mockApi : config.baseApi,
    timeout: 8000,
    headers: {
        "Content-Type": "application/json"
    }
})

// 添加请求拦截器
instance.interceptors.request.use(request => {
    // 在发送请求之前做些什么
    const headers = request.headers;
    const { token } = storage.getItem('userInfo') || {};
    headers.Authorization || (headers.Authorization = `Bearer ${token}`)
    return request;
}, error => {
    // 对请求错误做些什么
    ElMessage.error(error || NETWORK_ERROR);
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(response => {
    const { code, data, msg } = response.data;
    // 对响应数据做点什么
    if (code === 200 || code === 0) {
        return { data, msg };
    } else if (code === 40001) {
        ElMessage.error(msg);
        router.push({ name: 'login' })
        return Promise.reject(msg);
    } else {
        ElMessage.error(msg || NETWORK_ERROR);
        return Promise.reject(msg || NETWORK_ERROR);
    }
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});
/* 
*@param {*} options 请求配置
* */
function ajax(options) {
    options.method = options.method || 'get';//默认get
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;//get请求传参改为统一的data
    }
    let isMock = config.mock;
    if (typeof options.mock !== 'undefined') {
        isMock = options.mock;
    }
    if (config.env === 'prod') {
        instance.defaults.baseURL = config.baseApi;//为生产环境时，强制切换为baseApi，以防万一
    } else {
        instance.defaults.baseURL = isMock ? config.mockApi : config.baseApi;//判断是否开启mockApi
    }
    return instance(options);
}
['get', 'post', 'put', 'delete', 'patch'].forEach(item => ajax[item] = (url, data, options) => ajax({
    method: item,
    url, data, ...options
}))
export default ajax;