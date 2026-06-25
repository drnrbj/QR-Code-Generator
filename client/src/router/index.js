import { createRouter, createWebHistory } from 'vue-router'

// Lazy load page components for better performance
const Dashboard = () => import('../pages/Dashboard.vue')
const Generate = () => import('../pages/Generate.vue')
const History = () => import('../pages/History.vue')
const Statistics = () => import('../pages/Statistics.vue')
const QRDetail = () => import('../pages/QRDetail.vue') // Placeholder for Phase 5

/**
 * Route Configuration
 * Defines all application routes with lazy loading
 */
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      description: 'QR Code Manager Dashboard'
    }
  },
  {
    path: '/generate',
    name: 'Generate',
    component: Generate,
    meta: {
      title: 'Generate QR Code',
      description: 'Create new QR codes'
    }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: {
      title: 'QR Code History',
      description: 'View generated QR codes history'
    }
  },
  {
    path: '/history/:id',
    name: 'QRDetail',
    component: QRDetail,
    meta: {
      title: 'QR Code Details',
      description: 'View QR code details'
    }
  },
  {
    // Catch all route for 404 pages
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: {
      title: '404 - Not Found',
      description: 'Page not found'
    }
  }
]

// Create router instance with HTML5 history mode
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on route change
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard to update page title
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = `${to.meta.title} | QR Code Manager`
  next()
})

export default router