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
import PerfilUserView from '../views/PerfilUserView.vue'
import SobreNosotrosView from '../views/SobreNosotrosView.vue'
import VerificationView from '../components/molecules/VerifyAccountForm.vue'
import ForgotPasswordView from '../components/molecules/ForgotPasswordForm.vue'
import EmployeeDashboardView   from '../views/EmployeeDashboardView.vue'
import EmployeeOrdersView      from '../views/EmployeeOrdersView.vue'
import EmployeeProductsView    from '../views/EmployeeProductsView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminProductsView from '../views/AdminProductsView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import AdminReclamacionesView from '../views/AdminReclamacionesView.vue' 
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
      path: '/carrito',
      name: 'carrito',
      component: ResumendeCompraView
    },

    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilUserView
    },
     {
      path: '/resumen-compra',
      name: 'resumen-compra',
      component: ResumendeCompraView
    },
    {
      path: '/sobre-nosotros',
      name: 'sobre-nosotros',
      component: SobreNosotrosView
    },
    {
      path: '/verify',
      name: 'verify',
      component: VerificationView
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    },
    { path: '/empleado',           name: 'employee-dashboard', component: EmployeeDashboardView },
    { path: '/empleado/ordenes',   name: 'employee-orders',    component: EmployeeOrdersView },
    { path: '/empleado/productos', name: 'employee-products',  component: EmployeeProductsView },
    { path: '/admin', name: 'admin-dashboard', component: AdminDashboardView },
    { path: '/admin/productos', name: 'admin-products', component: AdminProductsView },
    { path: '/admin/usuarios', name: 'admin-users', component: AdminUsersView },
    { path: '/admin/reclamaciones', name: 'admin-reclamaciones', component: AdminReclamacionesView },


    /* 404 */
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ]
})

export default router