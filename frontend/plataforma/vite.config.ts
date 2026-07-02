import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Rollup/Rolldown options for code splitting
    rollupOptions: {
      output: {
        // Manual chunks as function for rolldown compatibility
        manualChunks(id: string) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('node_modules/vue-router')) {
            return 'vendor-vue'
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-axios'
          }
          if (id.includes('node_modules/lucide-vue-next')) {
            return 'vendor-icons'
          }
          // Split admin views individually (they're already lazy loaded)
          if (id.includes('src/views/AdminDashboardView')) {
            return 'admin-dashboard'
          }
          if (id.includes('src/views/AdminProductsView')) {
            return 'admin-products'
          }
          if (id.includes('src/views/AdminUsersView')) {
            return 'admin-users'
          }
          if (id.includes('src/views/AdminReclamacionesView')) {
            return 'admin-reclamaciones'
          }
          // Split employee views individually
          if (id.includes('src/views/EmployeeDashboardView')) {
            return 'employee-dashboard'
          }
          if (id.includes('src/views/EmployeeOrdersView')) {
            return 'employee-orders'
          }
          if (id.includes('src/views/EmployeeProductsView')) {
            return 'employee-products'
          }
        },
      },
    },
    // Minify aggressively (uses default oxc in Vite 8)
    target: 'es2020',
    // Reduce CSS bloat
    cssMinify: 'lightningcss',
    // Enable source maps only for debugging
    sourcemap: false,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimize deps
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios'],
  },
})