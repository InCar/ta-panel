import './styles.scss';
// import * as bootstrap from 'bootstrap';

import { createApp, App, version } from 'vue';
import vueApp from './App.vue';

class MainApp{
    private app : App<Element>;

    public constructor(){
        this.app = createApp(vueApp);
    }

    public run(tag: string){
        console.info(`TensorAnalyzor(vue-${version})`);
        this.app.mount(tag);
    }
}

var appMain = new MainApp();
appMain.run('#app');