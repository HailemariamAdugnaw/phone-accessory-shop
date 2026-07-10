import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],

  server: {
    host: true, // Allows code-server / external network access
    proxy: {
      '/api': {
        // Change this from 0.0.0.0 to 127.0.0.1 or localhost
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        secure: false,
      }
    }
  }

})
