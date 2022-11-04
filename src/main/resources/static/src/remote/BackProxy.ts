import { MessageAction } from "./actions";
import { ActionError } from "./message";
import { WorkerContext } from "./WorkerContext";

class BackProxy{
    private readonly _workerCtx;
    public readonly IsSharedWorkerSupported;

    public constructor(){
        this._workerCtx = new WorkerContext();
        this.IsSharedWorkerSupported = this._workerCtx.IsSharedWorkerSupported;
    }

    public dispatchShared = async(data:any):Promise<any>=>{
        try{
            const dataRet = await this._workerCtx.postMessage({ id: MessageAction.DispatchShared, args: data });
            return dataRet;
        }catch(e){
            console.info(e);
        }
    }
}

const backProxy = new BackProxy();

export const useBackProxy = ()=>backProxy;