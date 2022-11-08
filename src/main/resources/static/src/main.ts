import './styles.scss';

import { createApp, App as AppT } from 'vue';
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { TensorAnalyzor } from '@remote';
import App from './App.vue';
import Home from './page/Home.vue';
import TaskManager from './page/TaskManager.vue';
    import TaskPage from "./page/TaskManager/TaskPage.vue";
import NewAnalyzor from './page/NewAnalyzor.vue';
import About from "./page/About.vue";
    import About0 from "./page/About/About_0.vue";
    import AboutDev from "./page/About/About_dev.vue";

const ToDo = ()=>import('./page/todo.vue');

class Main{
    private readonly app : AppT

    // NOTE: 如果增加了一级路径,需要同步修改Java后端RouteController里的redirect表达式
    private readonly routes: ReadonlyArray<RouteRecordRaw> = [
        { path: '/', component: Home, meta: { topLevel: true, title: "分析结果", icon: "tenancy" } },
        { path: '/TaskManager', component: TaskManager, meta: { topLevel: true, title: "任务管理", icon: "task"},
            children: [ { path: ':taskId', component: TaskPage } ]
        },
        { path: '/NewAnalyzor', component: NewAnalyzor, meta: { topLevel: true, title: "创建新任务", icon: "add_box" } },
        { path: '/About', component: About, meta: { topLevel: true, title: "About", icon: "info" },
            children: [
                { path: '', name: 'About', component: About0 },
                { path: 'dev', component: AboutDev },
            ]
        },
        { path: '/ToDo', component: ToDo }
    ];

    public constructor(){        
        this.app = createApp(App);
    }

    public run = async (tag: string)=>{
        console.info(`TensorAnalyzor(vue-${this.app.version})`);
        
        const pinia = createPinia();
        this.app.use(pinia);
        
        const router = createRouter({
            history: createWebHistory(),
            routes: this.routes
        });
        this.app.use(router);

        const taObj = new TensorAnalyzor();
        const nRet = await taObj.init();
        this.app.provide('taObj', taObj);

        this.app.mount(tag);
        return nRet;
    }
}

const appInst = new Main();
appInst.run('#app').then((v)=>{
    if(v != 0){
        console.error("startup failed!");
    }
});