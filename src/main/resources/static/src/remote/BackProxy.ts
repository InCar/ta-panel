import { MessageAction, ActionData } from "./message";


class BackProxy{
    public readonly IsWorkerSupported = !!window.Worker;
    public readonly IsSharedWorkerSupported = !!window.SharedWorker;

    public constructor(){
    }

    public doAboutDispatch = async(data:any)=>{
         
    }
}

const backProxy = new BackProxy();

export const useBackProxy = ()=>backProxy;