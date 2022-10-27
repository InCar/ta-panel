import './styles.scss';

import { createApp, App as AppT } from 'vue';
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import { TensorAnalyzor } from 'logic';
import App from './App.vue';
import TaskPage from "./page/TaskManager/TaskPage.vue";
import About0 from "./page/About/About_0.vue";
import AboutDev from "./page/About/About_dev.vue";

const Home = ()=>import('./page/Home.vue');
const TaskManager = ()=>import('./page/TaskManager.vue');
const NewAnalyzor = ()=>import('./page/NewAnalyzor.vue');
const About = ()=>import('./page/About.vue');
const ToDo = ()=>import('./page/todo.vue');

class Main{
    private app : AppT

    // NOTE: 如果增加了一级路径,需要同步修改Java后端RouteController里的redirect表达式
    private routes: Array<RouteRecordRaw> = [
        { path: '/', component: Home, meta: { topLevel: true, title: "分析结果", icon: "tenancy" } },
        { path: '/TaskManager', component: TaskManager, meta: { topLevel: true, title: "任务管理", icon: "task"},
            children: [ { path: ':taskId', component: TaskPage } ]
        },
        //{ path: '/TaskManager/:taskId', component: ToDo },
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

    public run = (tag: string)=>{
        console.info(`TensorAnalyzor(vue-${this.app.version})`);
        
        const routes = this.routes;
        const router = createRouter({
            history: createWebHistory(),
            routes
        });
        const taObj = new TensorAnalyzor();
        taObj.init().then(() => {
            this.app.provide('taObj', taObj);
            this.app.use(router);
            this.app.mount(tag);
        });
    }
}

const appInst = new Main();
appInst.run('#app');