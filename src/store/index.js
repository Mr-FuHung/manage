/* 
*vuex状态管理
*
 */
import { createStore } from 'vuex';
import mutations from './mutations';
import storage from '@/utils/storage';


const state = {
    userInfo: storage.getItem('userInfo') || {},//获取用户信息
    menuList: storage.getItem('menuList') || [],//菜单权限列表
    buttonList: storage.getItem('buttonList') || [],//按钮权限列表
    routesList:[],//权限控制
    noticeCount:0//待处理数据量
}

export default createStore({
    state,
    mutations
})