import { MessageAction } from "./actions";
import { WorkerContext } from "./WorkerContext";

class BackProxy{
    private readonly _workerCtx;
    public readonly IsSharedWorkerSupported;

    public constructor(){
        this._workerCtx = new WorkerContext();
        this.IsSharedWorkerSupported = this._workerCtx.IsSharedWorkerSupported;
    }

    public dispatchShared = async(data:any):Promise<void>=>{
        const dataRet = await this._workerCtx.postMessage({ id: MessageAction.DispatchShared, args: data });
        // TODO:
        console.info(dataRet);
    }
}

const backProxy = new BackProxy();

export const useBackProxy = ()=>backProxy;