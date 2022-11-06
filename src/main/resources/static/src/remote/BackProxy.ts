import { MessageAction, useActions } from "./actions";
import { ActionData, ActionDataSn, ActionResonse, ActionResponseData, ActionResponseSn } from "./message";
import { WorkerContext } from "./WorkerContext";

interface PromiseFnArgs{
    sn: number,
    resolve: (value:ActionResonse)=>void;
    reject:  (reason?: any)=>void;
    timeout: any;
}

export class BackProxy{
    private readonly _workerCtx;
    public readonly IsSharedWorkerSupported;
    private readonly _defaultTimeout = 5000; // milliseconds
    private readonly _dictActions;
    private _dictWaiting : { [sn:number]: PromiseFnArgs }= {};
    private _sn = 0;

    public constructor(){
        this.IsSharedWorkerSupported = !!window?.SharedWorker;
        this._dictActions = useActions();
        this._workerCtx = new WorkerContext(this.IsSharedWorkerSupported);
        this._workerCtx.OnMessage = this.onMessage;
    }

    public dispatchShared = async(data:any):Promise<ActionResonse>=>{
        const dataRet = await this.postMessage({ action: MessageAction.DispatchShared, data });
        return dataRet;
    }

    private fetchSN = ()=>{ return ++this._sn; }

    private postMessage = async(data: ActionData, maxWait?:number):Promise<ActionResonse>=>{
        const dataSN = data as ActionDataSn;
        dataSN.sn = this.fetchSN();

        const actionReturn = new Promise<ActionResonse>((resolve, reject)=>{
            // waiting for the reply
            const sn = dataSN.sn;
            const timeout = setTimeout(this.onTimeout, maxWait??this._defaultTimeout, sn);
            this._dictWaiting[sn] = {sn, resolve, reject, timeout};
        });

        await this._workerCtx.postMessage(data);
        return actionReturn;
    }

    private onMessage = async(event: MessageEvent<ActionResponseSn>)=>{
        const response = event.data;
        const sn = response.sn;
        if(sn !== 0){
            // reply
            const waiting = this._dictWaiting[sn];
            if(waiting){
                clearTimeout(waiting.timeout);
                delete this._dictWaiting[sn];
                waiting.resolve(response);
            }
            else{
                console.warn(`The waiting object(${response.sn}) missing.`);
            }
        }
        else{
            // notify
            const data = response as ActionResponseData;
            const action = this._dictActions[data.action];
            if(action?.actionForNotify){
                action.actionForNotify(data, this);
            }
            else{
                console.warn(`There isn't any action for ${MessageAction[data.action]??""}(${data.action})`);
            }
        }

    }

    private onTimeout = (sn: number)=>{
        const waiting = this._dictWaiting[sn];
        if(waiting){
            delete this._dictWaiting[sn];
            waiting.resolve({
                ok: false,
                cause: "timeout",
                errorData: { sn }
            });
        }
        else{
            console.warn(`The waiting object(${sn}) missing.`);
        }
    }
}

let backProxy:BackProxy|null = null;

export const useBackProxy = ()=>{
    if(typeof window === "undefined") return null;

    if(backProxy === null) backProxy = new BackProxy();
    return backProxy;
}