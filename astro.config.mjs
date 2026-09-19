// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://skygraph.web.id',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});