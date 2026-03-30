import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://maxilodentalstudio.com/',
  output: 'server',
  adapter: vercel({
    imageService: true
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});