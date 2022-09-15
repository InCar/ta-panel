import './styles.scss';
// import * as bootstrap from 'bootstrap';

import { createApp, App } from 'vue';
import vueApp from './App.vue';

class MainApp{
    private app : App<Element>;

    public constructor(){
        this.app = createApp(vueApp);
    }

    public run(tag: string){
        console.info("TensorAnalyzor is starting...");
        this.app.mount(tag);
        console.info("TensorAnalyzor has been started.");
    }
}

var appMain = new MainApp();
appMain.run('#app');