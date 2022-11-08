import * as Path from "path";
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { compilerOptions } from "./tsconfig.json";
import { resolve } from "path";

// tsconfig.compilerOptions.paths => viteconfig.resolve.alias
const alias = Object.entries(compilerOptions.paths)
                    .map(x=>({ find: x[0], replacement: Path.resolve(x[1][0]) }));

export const userConfig = {
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
    plugins: [ vue() ],
    resolve: { alias }
};

// https://vitejs.dev/config/
export default defineConfig(userConfig);
