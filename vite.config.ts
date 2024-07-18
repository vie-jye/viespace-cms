import { loadEnv, defineConfig } from 'vite';
import dotenvExpand from 'dotenv-expand';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode }) => {
  if (mode === 'development') {
    const env = loadEnv(mode, process.cwd(), '');
    dotenvExpand.expand({ parsed: env });
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
    ],
  };
});