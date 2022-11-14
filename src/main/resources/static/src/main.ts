import './styles.scss';

import { createApp, App as AppT } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { activeSDM } from "./sdm";
import { routes } from './routes';
import { TensorAnalyzor } from '@ta';
import App from './App.vue';

class Main{
    private readonly app : AppT

    public constructor(){        
        this.app = createApp(App);
    }

    public run = async (tag: string)=>{
        console.info(`TensorAnalyzor(vue-${this.app.version})`);

        const taObj = new TensorAnalyzor();
        let nRet = await taObj.init();
        activeSDM(taObj);
        
        const router = createRouter({
            history: createWebHistory(),
            routes
        });
        this.app.use(router);

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