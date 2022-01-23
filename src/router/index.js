import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'PortfolioLayout',
    component: () => import('@/layouts/PortfolioLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/portfolio/Home.vue')
      },
      {
        path: '/experiences',
        name: 'Experiences',
        component: () => import('@/views/portfolio/Experiences.vue')
      },
      {
        path: '/projects',
        name: 'Projects',
        component: () => import('@/views/portfolio/Projects.vue')
      },
      {
        path: '/hello',
        name: 'Hello',
        component: () => import('@/views/portfolio/Hello.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  linkExactActiveClass: 'active',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
      }
    }
  }
})

export default router