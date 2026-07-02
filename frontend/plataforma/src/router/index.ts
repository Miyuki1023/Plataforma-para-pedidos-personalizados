/* router/index.ts */

import {
  createRouter,
  createWebHistory
} from 'vue-router'

/* LAZY LOADED VIEWS — Code splitting by domain */
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const HomeUserView = () => import('../views/HomeUserView.vue')
const CatalogoView = () => import('../views/Catalogo.vue')
const ProductProfileView = () => import('../views/ProductProfileView.vue')
const ResumendeCompraView = () => import('../views/ResumendeCompraView.vue')
const PerfilUserView = () => import('../views/PerfilUserView.vue')
const SobreNosotrosView = () => import('../views/SobreNosotrosView.vue')
const VerificationView = () => import('../components/molecules/VerifyAccountForm.vue')
const ForgotPasswordView = () => import('../components/molecules/ForgotPasswordForm.vue')
const EmployeeDashboardView = () => import('../views/EmployeeDashboardView.vue')
const EmployeeOrdersView = () => import('../views/EmployeeOrdersView.vue')
const EmployeeProductsView = () => import('../views/EmployeeProductsView.vue')
const AdminDashboardView = () => import('../views/AdminDashboardView.vue')
const AdminProductsView = () => import('../views/AdminProductsView.vue')
const AdminUsersView = () => import('../views/AdminUsersView.vue')
const AdminReclamacionesView = () => import('../views/AdminReclamacionesView.vue')

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
    { path: '/empleado', name: 'employee-dashboard', component: EmployeeDashboardView },
    { path: '/empleado/ordenes', name: 'employee-orders', component: EmployeeOrdersView },
    { path: '/empleado/productos', name: 'employee-products', component: EmployeeProductsView },
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