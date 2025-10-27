// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ------------------------------------------------------------------
  // CHANGE THIS LINE to a relative path
  base: './', 
  // ------------------------------------------------------------------
})
