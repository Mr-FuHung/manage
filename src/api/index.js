/* 
*接口统一管理，方便统一更换接口，多次调用同一个接口不需要再次定义
*
* */
import $ajax from '@/utils/ajax';

const apis = {
    loginPage: {
        //登录
        login: data => $ajax({
            url: "/users/login",
            method: "post",
            mock: true,
            data,
        })
    },
    userPage: {
        //用户列表
        getUserList: data => $ajax({
            url: "/users/list",
            data,
            mock: true,
        }),
        //菜单列表
        getMenuList: () => $ajax({
            mock: true,
            url: "/menu/list",
        }),
        //待办事项
        getNoticeCount: () => $ajax({
            mock: true,
            url: "/leave/count",
        }),
        //待办事项
        userDel: data => $ajax({
            mock: true,
            method: "post",
            url: "/users/delete",
            data
        }),
        //角色列表
        getRoleList:()=>$ajax({
            mock: true,
            url: "/roles/allList",
        }),
        //部门列表
        getDeptList:()=>$ajax({
            mock: true,
            url: "/dept/list",
        }),
        //新增用户
        userSubmit:(data)=>$ajax({
            mock: true,
            url: "/users/operate",
            method:'post',
            data
        })
    }

}
let apiAll = {};
for (const keys in apis) {
    apiAll = Object.assign(apiAll, apis[keys])
}

export default apiAll;