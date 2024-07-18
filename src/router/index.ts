// 引入 createRouter
import { createRouter, createWebHistory } from "vue-router";
// 引入路由组件
import AppLogin from '../components/AppLogin.vue';
import AppHome from "../components/AppHome.vue";
import HomeArticle from "../pages/HomeArticle.vue";
import HomeUser from "../pages/HomeUser.vue";
import HomeCategory from "../pages/HomeCategory.vue";
import ArticleList from "../pages/article/ArticleList.vue";
import ArticleItem from "../pages/article/ArticleItem.vue";

const router = createRouter({
    // 路由器工作模式
    history: createWebHistory(),
    routes: [
        {
            name: 'index',
            path: '/',
            redirect: '/home'
        },
        {
            name: 'login',
            path: '/login',
            component: AppLogin
        },
        {
            name: 'home',
            path: '/home',
            component: AppHome,
            children: [
                {
                    name: 'article',
                    path: 'article',
                    component: HomeArticle,
                    children: [
                        {
                            name: 'article-list',
                            path: 'list',
                            component: ArticleList
                        },
                        {
                            name: 'article-create',
                            path: 'create',
                            component: ArticleItem,
                            props: { type: 'create' }
                        },
                        {
                            name: 'article-edit',
                            path: 'edit/:id',
                            component: ArticleItem,
                            props($route) {
                                return { type: 'edit', id: parseInt($route.params.id as string) }
                            }
                        },
                        {
                            name: 'article-detail',
                            path: 'detail/:id',
                            component: ArticleItem,
                            props($route) {
                                return { type: 'detail', id: parseInt($route.params.id as string) }
                            }
                        }
                    ]
                },
                {
                    name: 'user',
                    path: 'user',
                    component: HomeUser
                },
                {
                    name: 'category',
                    path: 'category',
                    component: HomeCategory
                }
            ]
        }
    ]
});
// 全局前置路由守卫，每一次路由切换前
router.beforeEach((to, from, next) => {
    if (to.name === 'login') {
        next()
    } else {
        let isAuth = localStorage.getItem('session')
        if (isAuth) {
            next()
        } else {
            alert('no permission')
            next('/login')
        }
    }
});
export default router;