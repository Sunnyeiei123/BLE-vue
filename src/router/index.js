import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path:'/',
    name: 'login',

    component:()=> import('../views/Login.vue')
  },
  {
    path: '/overview',
    name: 'overview',
   
    component: () => import('../views/Overview.vue')
  },
  {
    path:'/error-log',
    name: ' error-log',

    component:()=> import('../views/ErrLog.vue')
  },
  {
    path:'/list-asset',
    name: 'list-asset',

    component:()=> import('../views/ListAsset.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
