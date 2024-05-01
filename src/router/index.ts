import type { RouteRecordRaw, Router } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/home/index.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: '/table',
        name: 'table',
        component: () => import('@/pages/table/index.vue'),
        meta: {
          title: 'table',
        },
      },
      {
        path: '/form',
        name: 'form',
        component: () => import('@/pages/form/index.vue'),
        meta: {
          title: 'form',
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
