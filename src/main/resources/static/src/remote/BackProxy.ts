import { MessageAction } from "./actions";
import { WorkerContext } from "./WorkerContext";

class BackProxy{
    private readonly _workerCtx;
    public readonly IsSharedWorkerSupported;

    public constructor(){
        this._workerCtx = new WorkerContext();
        this.IsSharedWorkerSupported = this._workerCtx.IsSharedWorkerSupported;
        this._workerCtx.OnMessage = this.onMsg;
    }

    public dispatchShared = async(data:any):Promise<void>=>{
        await this._workerCtx.postMessage({ id: MessageAction.DispatchShared, args: data });
    }

    private onMsg = (event: MessageEvent)=>{
        // only for broadcasting of sharedWorker 
        console.warn(event.data);
    }
}

const backProxy = new BackProxy();

export const useBackProxy = ()=>backProxy;