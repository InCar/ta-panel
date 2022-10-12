import './styles.scss';

import { createApp, App, version } from 'vue';
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import vueApp from './App.vue';
import { TensorAnalyzor } from './TensorAnalyzor';

const Home = () => import(/* webpackChunkName: "home" */'./Home.vue');
const NewAnalyzor = () => import(/* webpackChunkName: "new-analyzor" */'./NewAnalyzor.vue');
const NewAnalyzor_Mode = () => import(/* webpackChunkName: "new-analyzor-mode" */'./analyzor/mode.vue');
const NewAnalyzor_Step1 = () => import(/* webpackChunkName: "new-analyzor-step1" */'./analyzor/selector.vue');
const About = () => import(/* webpackChunkName: "about" */'./About.vue');
const ToDo = () => import(/* webpackChunkName: "todo" */'./todo.vue');

class MainApp{
    private app : App<Element>;

    // NOTE: 如果增加了一级路径,需要同步修改Java后端RouteController里的redirect表达式
    private routes: Array<RouteRecordRaw> = [
        { path: '/', component: Home, meta: { topLevel: true, title: "分析结果", icon: "tenancy" } },
        { path: '/TaskManager', component: ToDo, meta: { topLevel: true, title: "任务管理", icon: "task" }  },
        { path: '/NewAnalyzor', component: NewAnalyzor, meta: { topLevel: true, title: "创建新任务", icon: "add_box" },
            children: [
                { path: '', name: "create", component: NewAnalyzor_Mode },
                { path: 'step1', component: NewAnalyzor_Step1 }
            ]
        },
        { path: '/About', component: About, meta: { topLevel: true, title: "About", icon: "info" }  }
    ];

    public constructor(){
        this.app = createApp(vueApp);
    }

    public run = (tag: string)=>{
        console.info(`TensorAnalyzor(vue-${version})`);
        
        const routes = this.routes;
        const router = createRouter({
            history: createWebHistory(),
            routes
        });
        const taObj = new TensorAnalyzor(import.meta.env);
        taObj.init().then(() => {
            this.app.provide('taObj', taObj);
            this.app.use(router);
            this.app.mount(tag);
        });
    }
}

var appMain = new MainApp();
appMain.run('#app');