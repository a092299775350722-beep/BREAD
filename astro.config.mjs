import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

export default defineConfig({
  // ⚠️ 因為改用 Vercel 部署，所以把下面這兩行刪除！
  // site: 'https://你的GitHub帳號.github.io', 
  // base: '/你的儲存庫名稱', 
  
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [vue()]
});