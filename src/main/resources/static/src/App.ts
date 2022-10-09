import './styles.scss';
// import * as bootstrap from 'bootstrap';

import { createApp, App, version } from 'vue';
import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router';
import vueApp from './App.vue';
import { TensorAnalyzor } from './TensorAnalyzor';

const Home = () => import(/* webpackChunkName: "home" */'./Home.vue');
const NewAnalyzor = () => import(/* webpackChunkName: "new-analyzor" */'./NewAnalyzor.vue');
const About = ()=>import(/* webpackChunkName: "about" */'./About.vue');

class MainApp{
    private app : App<Element>;

    private routes: Array<RouteRecordRaw> = [
        { path: '/', component: Home },
        { path: '/NewAnalyzor', component: NewAnalyzor },
        { path: '/About', component: About }
    ];

    public constructor(){
        this.app = createApp(vueApp);
    }

    public run = (tag: string)=>{
        console.info(`TensorAnalyzor(vue-${version})`);
        
        const routes = this.routes;
        const router = createRouter({
            history: createWebHashHistory(),
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