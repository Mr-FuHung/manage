/* 
*接口统一管理，方便统一更换接口，多次调用同一个接口不需要再次定义
*
* */
import $ajax from '@/utils/ajax';

const apis = {
    //登录
    login: data => $ajax({
        url: "/users/login",
        method: "post",
        mock: false,
        data,
    }),
    //用户列表
    getUserList: data => $ajax({
        url: "/users/list",
        data,
        mock: false,
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
    //删除
    userDel: data => $ajax({
        method: "delete",
        url: "/users/delete",
        data
    }),
    //角色列表
    getRoleList: () => $ajax({
        mock: true,
        url: "/roles/allList",
    }),
    //部门列表
    getDeptList: () => $ajax({
        mock: true,
        url: "/dept/list",
    }),
    //新增,修改用户
    userSubmit: (data) => $ajax({
        url: "/users/operate",
        method: 'post',
        data
    }),
    //新增,修改菜单
    menuSubmit: (data) => $ajax({
        url: "/menu/operate",
        method: 'post',
        data,
        mock:true
    })

}
export default apis;