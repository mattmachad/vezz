import { createRouter, createWebHistory } from 'vue-router'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/components/HeroSection.vue') // ou crie um Home.vue se quiser
  }, 
  {
    path: '/',
    redirect: '/login'
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
