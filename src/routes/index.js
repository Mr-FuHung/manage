import { createRouter, createWebHashHistory } from 'vue-router';
// createWebHashHistory  以#的路由
import Home from './../views/Home.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        component: Home,
        redirect:'/welcome',
        meta: {
            title: '首页'
        },
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎页'
                },
                component: () => import('./../views/Welcome.vue'),
            },
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录页'
        },
        component: () => import('./../views/Login.vue'),
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

export default router;