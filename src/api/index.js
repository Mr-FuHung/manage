/* 
*接口统一管理，方便统一更换接口，多次调用同一个接口不需要再次定义
*
* */
import $ajax from '@/utils/ajax';

const api = {
    //登录
    login: data => $ajax({
        url: "/users/login",
        method: "post",
        data,
    }),
    //全量用户列表
    getAllUserList: () => $ajax({
        url: "/users/all/list"
    }),
    //用户列表
    getUserList: data => $ajax({
        url: "/users/list",
        data,
    }),
    //菜单列表
    getMenuList: (data) => $ajax({
        url: "/menu/list",
        data
    }),
    //待办事项
    getNoticeCount: () => $ajax({
        url: "/leave/count",
    }),
    //删除
    userDel: data => $ajax({
        method: "delete",
        url: "/users/delete",
        data
    }),
    //全部角色列表
    getRoleAllList: () => $ajax({
        url: "/roles/allList",
    }),
    //角色列表
    getRoleList: data => $ajax({
        url: "/roles/list",
        data
    }),
    //部门列表
    getDeptList: data => $ajax({
        url: "/dept/list",
        data
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
    }),
    //菜单删除
    menuDel: data => $ajax({
        method: "delete",
        url: "/menu/delete",
        data
    }),
    //新增，修改角色
    roleSubmit: data => $ajax({
        method: 'post',
        url: '/roles/operate',
        data
    }),
    //删除角色
    roleDelete: data => $ajax({
        method: 'delete',
        url: '/roles/delete',
        data
    }),
    //角色权限配置
    roleUpdatePermission: data => $ajax({
        method: 'post',
        url: '/roles/update/permission',
        data
    }),
    //部门新增修改
    deptSubmit: data => $ajax({
        method: 'post',
        url: '/dept/operate',
        data
    }),
    //部门删除
    deptDel: data => $ajax({
        method: 'delete',
        url: '/dept/delete',
        data
    }),
    //获取权限列表
    getPermissionList: () => $ajax({
        method: 'post',
        url: '/users/permissionList'
    }),
    //获取休假申请列表
    getLeaveList: data => $ajax({
        url: '/leave/list',
        data
    }),
    //休假申请新增
    leaveOperate: data => $ajax({
        method: 'post',
        url: '/leave/operate',
        data
    }),
    //休假申请作废
    leaveDel: data => $ajax({
        method: 'delete',
        url: '/leave/delete',
        data
    }),
    //休假申请  审核操作
    leaveApprove: data => $ajax({
        method: 'post',
        url: '/leave/approve',
        data
    }),
    //博客列表
    getArticleList: data => $ajax({
        url: '/article/list',
        data
    }),
    //文件上传
    uploadFile: data => $ajax({
        method: 'post',
        url: '/article/uploadFile',
        data
    }),
    //文件上传
    articleSubmit: data => $ajax({
        method: 'post',
        url: '/article/operate',
        data
    }),
    //文件上传
    removeFile: data => $ajax({
        method: 'delete',
        url: '/article/removeFile',
        data
    }),
    //文章删除
    articleDel: data => $ajax({
        method: 'delete',
        url: '/article/delete',
        data
    }),
    //博客用户列表
    getBlogUserList: data => $ajax({
        url: "/blogUsers/list",
        data,
    }),
    //博客用户列表
    getCommentList: data => $ajax({
        url: "/comment/list",
        data,
    }),
    //修改留言状态
    commentOperate: data => $ajax({
        method: 'post',
        url: "/comment/operate",
        data,
    }),
    //文章分类列表
    getArticleClassifyList: data => $ajax({
        url: "/articleClassify/list",
        data
    }),
    //文章分类新增编辑
    articleClassifySubmit: data => $ajax({
        method: 'post',
        url: "/articleClassify/operate",
        data
    }),
    //文章分类全量
    getClassifyAll: () => $ajax({
        url: "/articleClassify/all/list"
    }),
}
export default api;