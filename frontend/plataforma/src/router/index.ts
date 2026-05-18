import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import EmployeeDashboardView   from '../views/EmployeeDashboardView.vue'
import EmployeeOrdersView      from '../views/EmployeeOrdersView.vue'
import EmployeeProductsView    from '../views/EmployeeProductsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login',    name: 'login',    component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/empleado',           name: 'employee-dashboard', component: EmployeeDashboardView },
    { path: '/empleado/ordenes',   name: 'employee-orders',    component: EmployeeOrdersView },
    { path: '/empleado/productos', name: 'employee-products',  component: EmployeeProductsView },
  ]
})

export default router