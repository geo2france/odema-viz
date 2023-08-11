import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/public/odema/indicateur_dev',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
