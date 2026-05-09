/* router/index.ts */

import {
  createRouter,
  createWebHistory
} from 'vue-router'

/* VIEWS */
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeUserView from '../views/HomeUserView.vue'
import CatalogoView from '../views/Catalogo.vue'
import ProductProfileView from '../views/ProductProfileView.vue'
import ResumendeCompraView from '../views/ResumendeCompraView.vue'
// import PerfilView from '../views/PerfilView.vue'

const router = createRouter({

  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes: [

    /* REDIRECT */
    {
      path: '/',
      redirect: '/home'
    },

    /* LOGIN */
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
    },

    {
      path: '/producto/:id',
      name: 'producto',
      component: ProductProfileView,

      props: true
    },

    {
      path: '/resumen-compra',
      name: 'resumen-compra',
      component: ResumendeCompraView
    },

    // /* PERFIL */
    // {
    //   path: '/perfil',
    //   name: 'perfil',
    //   component: PerfilView
    // },

    /* 404 */
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

export default router