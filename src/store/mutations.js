/* 
*vuex业务数据提交
*
* */

import storage from '@/utils/storage';
export default {
    saveUserInfo(state, userInfo) {
        state.userInfo = userInfo;//存储用户信息
        storage.setItem('userInfo', userInfo)//存储在storage，防止页面被刷新
    },
    saveMenuInfo(state, menuList) {
        state.menuList = menuList;
        storage.setItem('menuList', menuList)
    },
    saveButtonInfo(state, buttonList) {
        state.buttonList = buttonList;//存储用户信息
        storage.setItem('buttonList', buttonList)//存储在storage，防止页面被刷新
    },
    saveNoticeCount(state, noticeCount) {
        state.noticeCount = noticeCount;//存储
    }
}