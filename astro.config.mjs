import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';

export default defineConfig({
  // 1. 換成你的 GitHub 帳號
  site: 'https://你的GitHub帳號.github.io', 
  // 2. 換成你在 GitHub 上建立的 Repo 名稱 (注意前面要有一個斜線)
  base: '/你的儲存庫名稱', 
  
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [vue()]
});