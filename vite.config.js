import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import RadixVueResolver from 'radix-vue/resolver';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [RadixVueResolver({ prefix: 'r' })],
    }),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
