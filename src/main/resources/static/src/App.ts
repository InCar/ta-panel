import './styles.scss';
// import * as bootstrap from 'bootstrap';

import { createApp, App, version } from 'vue';
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';
import vueApp from './App.vue';
import { TensorAnalyzor } from './TensorAnalyzor';

const Home = () => import(/* webpackChunkName: "home" */'./Home.vue');
const NewAnalyzor = () => import(/* webpackChunkName: "new-analyzor" */'./NewAnalyzor.vue');
const About = () => import(/* webpackChunkName: "about" */'./About.vue');
const ToDo = () => import(/* webpackChunkName: "todo" */'./todo.vue');

class MainApp{
    private app : App<Element>;

    private routes: Array<RouteRecordRaw> = [
        { path: '/', name: "分析结果", component: Home },
        { path: '/TaskManager', name: "任务管理", component: ToDo },
        { path: '/NewAnalyzor', name: "创建新任务", component: NewAnalyzor },
        { path: '/About', name: "About", component: About }
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