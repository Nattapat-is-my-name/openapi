import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth/Register': {  // Note the capital R to match backend
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/auth/login': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})