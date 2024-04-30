import type { RouteRecordRaw, Router } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/layout.vue'),
    children: [
      {
        path: '/',
        name: 'index',
        component: () => import('@/pages/home/index.vue'),
        meta: {
          title: '首页',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/404/index.vue'),
  },
]
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
