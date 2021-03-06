import { createRouter, createWebHashHistory } from 'vue-router';
// createWebHashHistory  以#的路由
import Home from '@/views/Home.vue';
import storage from '@/utils/storage';
import store from '@/store/index.js';
// import $api from '@/api'
import utils from "@/utils/utils.js";

const routes = [
    {
        name: 'home',
        path: '/',
        component: Home,
        redirect: '/welcome',
        meta: {
            title: '首页'
        },
        children: [
            {
                name: 'welcome',
                path: 'welcome',
                meta: {
                    title: '欢迎页'
                },
                component: () => import('@/views/Welcome.vue'),
            },
            {
                name: 'system',
                path: '/system',
                meta: {
                    title: '系统管理'
                }
            },
            {
                name: 'user',
                path: '/system/user',
                meta: {
                    title: '用户管理'
                },
                component: () => import('@/views/User.vue'),
            },
            {
                name: 'menu',
                path: '/system/menu',
                meta: {
                    title: '菜单管理'
                },
                component: () => import('@/views/Menu.vue'),
            },
            {
                name: 'role',
                path: '/system/role',
                meta: {
                    title: '角色管理'
                },
                component: () => import('@/views/Role.vue'),
            },
            {
                name: 'dept',
                path: '/system/dept',
                meta: {
                    title: '部门管理'
                },
                component: () => import('@/views/Dept.vue'),
            },
            {
                name: 'audit',
                path: '/audit',
                meta: {
                    title: '审批管理'
                }
            },
            {
                name: 'leave',
                path: '/audit/leave',
                meta: {
                    title: '休假申请'
                },
                component: () => import('@/views/Leave.vue'),
            },
            {
                name: 'approve',
                path: '/audit/approve',
                meta: {
                    title: '待审批'
                },
                component: () => import('@/views/Approve.vue'),
            },
            {
                name: 'blog',
                path: '/blog',
                meta: {
                    title: '博客管理'
                }
            },
            {
                name: 'article',
                path: '/blog/article',
                meta: {
                    title: '博客文章管理'
                },
                component: () => import('@/views/Article.vue'),
            },
            {
                name: 'comment',
                path: '/blog/comment',
                meta: {
                    title: '博客留言管理'
                },
                component: () => import('@/views/Comment.vue'),
            },
            {
                name: 'bloguser',
                path: '/blog/blogUser',
                meta: {
                    title: '博客用户管理'
                },
                component: () => import('@/views/BlogUser.vue'),
            },
            {
                name: 'articleclassify',
                path: '/blog/ArticleClassify',
                meta: {
                    title: '文章分类管理'
                },
                component: () => import('@/views/ArticleClassify.vue'),
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录页'
        },
        component: () => import('@/views/Login.vue'),
    },
    {
        name: '404',
        path: '/404',
        meta: {
            title: '页面不存在'
        },
        component: () => import('@/views/404.vue'),
    },
    // {
    //     name: '404',
    //     path: '/:pathMatch(.*)',
    //     redirect: '/',
    // }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const routesList = ['404', 'login', 'welcome', 'home']
function asyncLoadRoutes() {//拉起路由权限
    let menuList = storage.getItem('menuList') || [];
    let routes = utils.generateRoutes(menuList);
    routes.forEach(menus => {
        //     let url = `./../views/${menus.component}.vue`;
        //     menus.component = () => import(url)
        // router.addRoute('home', menus)
        menus.name && routesList.push(menus.name.toLocaleLowerCase());
    })
    store.commit('saveRoutesList', routesList)
}
asyncLoadRoutes();
//全局守卫
router.beforeEach((to, from, next) => {
    if (store.state.routesList.includes(to.name)) {//验证路径是否存在
        document.title = to.meta.title;//修改页面title
        next()
    } else {
        next('/404')
    }
})
export default router;