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
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes
})

export default router
