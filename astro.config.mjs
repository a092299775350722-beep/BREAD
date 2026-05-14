import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel'; // 部署時要用這個

export default defineConfig({
  output: 'server',
  adapter: vercel(), // 加上這一行
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [vue()]
});
