import './styles.scss';

import { createApp, App as AppT } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { routes } from './routes';
import { TensorAnalyzor } from '@remote';
import App from './App.vue';

class Main{
    private readonly app : AppT

    public constructor(){        
        this.app = createApp(App);
    }

    public run = async (tag: string)=>{
        console.info(`TensorAnalyzor(vue-${this.app.version})`);
        
        const pinia = createPinia();
        this.app.use(pinia);
        
        const router = createRouter({
            history: createWebHistory(),
            routes
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