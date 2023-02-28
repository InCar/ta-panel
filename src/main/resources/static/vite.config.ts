import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // 该文件会放到git里，大家都会看到
      "^/api/.+": "http://127.0.0.1:8050",
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    manifest: true,
    minify: false,
    chunkSizeWarningLimit: 4096 // kb
  }
  // 引入全局css文件
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: '@import "../src/assets/scss/style.scss";'
  //     },
  //   },
  // }
});
