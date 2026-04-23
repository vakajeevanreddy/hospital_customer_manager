import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/hospital_customer_manager/',
  plugins: [react()],
})

