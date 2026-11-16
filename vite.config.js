import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: '/future/',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        seasonal: fileURLToPath(new URL('./bebidas-sazonais.html', import.meta.url)),
      },
    },
  },
});
