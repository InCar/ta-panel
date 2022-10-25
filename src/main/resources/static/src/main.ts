import './styles.scss';

import { createApp, App } from 'vue';
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import vueApp from './App.vue';
import { TensorAnalyzor } from './TensorAnalyzor';

const Home = ()=>import('./page/Home.vue');
const TaskManager = ()=>import('./page/TaskManager.vue');
// const NewAnalyzor = ()=>import('./NewAnalyzor.vue');
const About = ()=>import('./page/About.vue');
const ToDo = ()=>import('./todo.vue');

class MainApp{
    private app : App<Element>;

    // NOTE: 如果增加了一级路径,需要同步修改Java后端RouteController里的redirect表达式
    private routes: Array<RouteRecordRaw> = [
        { path: '/', component: Home, meta: { topLevel: true, title: "分析结果", icon: "tenancy" } },
        { path: '/TaskManager', component: TaskManager, meta: { topLevel: true, title: "任务管理", icon: "task" } },
        { path: '/NewAnalyzor', component: ToDo, meta: { topLevel: true, title: "创建新任务", icon: "add_box" } },
        { path: '/About', component: About, meta: { topLevel: true, title: "About", icon: "info" },
            children: [
                { path: '', name: 'About', component: ()=> import('./page/About_0.vue') },
                { path: 'dev', component: ()=> import('./page/About_dev.vue') },
             ]
        }
    ];

    public constructor(){
        this.app = createApp(vueApp);
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

var appMain = new MainApp();
appMain.run('#app');