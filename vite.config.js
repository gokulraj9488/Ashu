// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ------------------------------------------------------------------
  //  ADD THIS LINE
  //  Set the base path to your repository name (including the leading and trailing slashes)
  base: '/Ashu/',
  // ------------------------------------------------------------------
})
