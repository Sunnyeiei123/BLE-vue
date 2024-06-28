import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login' }
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('../views/Overview.vue'),
    meta: { title: 'Overview' }
  },
  {
    path: '/location',
    name: 'location',
    component: () => import('../views/ErrLog.vue'),
    meta: { title: 'Location' }
  },
  {
    path: '/list-asset',
    name: 'list-asset',
    component: () => import('../views/ListAsset.vue'),
    meta: { title: 'List Asset' }
  },
  {
    path: '/signal',
    name: 'signal',
    component: () => import('../views/SIgnalReport.vue'),
    meta: { title: 'Signal Report' }
  },
  {
    path: '/access-point',
    name: 'access-point',
    component: () => import('../views/AccessPoint.vue'),
    meta: { title: 'Acess Point List' }
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Default Title';
  next();
});

export default router;

