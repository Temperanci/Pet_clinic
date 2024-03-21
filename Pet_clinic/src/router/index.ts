import { createRouter, createWebHistory } from 'vue-router'
import App from "@/App.vue";

// 定义路由
// 每个路由都需要映射到一个组件。
const routes = [
    { path: '/app', component: App },
    // 其他路由...
]

// 创建路由器实例
const router = createRouter({
    // 使用 HTML5 历史模式
    history: createWebHistory(),
    routes // 简写，相当于 routes: routes
})

export default router
