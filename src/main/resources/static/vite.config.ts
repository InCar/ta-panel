import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        manifest: true
    },
    server: {
        proxy: {
            // 代理后端api
            // 可以使用"npm run dev -- --config vite.config-dev50.ts"执行自己的配置
            // vite.config-*.ts已经配置在.gitignore里,不会被git管理
            "^/api/.+": "http://127.0.0.1:8050"
        }
    },
    plugins: [ vue() ]
})
