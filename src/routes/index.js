import { createRouter, createWebHashHistory } from 'vue-router';
// createWebHashHistory  以#的路由
import Home from '@/views/Home.vue';
import storage from '@/utils/storage';
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
function asyncLoadRoutes() {//拉起路由权限
    
    let menuList = storage.getItem('menuList') || [];
    let routes = utils.generateRoutes(menuList);
    routes.forEach(menus => {
        let url = `./../views/${menus.component}.vue`;
        menus.component = () => import(url)
        router.addRoute('home', menus)
    })

}
asyncLoadRoutes();

//全局守卫
router.beforeEach((to, from, next) => {
    if (router.hasRoute(to.name)) {//验证路径是否存在
        document.title = to.meta.title;//修改页面title
        next()
    } else {
        next('/404')
    }
})
export default router;