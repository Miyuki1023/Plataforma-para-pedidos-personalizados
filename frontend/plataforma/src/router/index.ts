/* router/index.ts */

import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeUserView from '../views/HomeUserView.vue'
import CatalogoView from '../views/Catalogo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },

    {
      path: '/home',
      name: 'home',
      component: HomeUserView
    },

    {
      path: '/catalogo',
      name: 'catalogo',
      component: CatalogoView
    }
  ]
})

export default router