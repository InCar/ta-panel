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
      // 代理后端api
      // vite.config-*.ts已经配置在.gitignore里,不会被git管理
      "^/api/.+": "http://10.0.11.50:8050",
    },
  },
  // 引入全局css文件
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: '@import "../src/assets/scss/style.scss";'
  //     },
  //   },
  // }
});
