import { ActionData, ActionError, ActionDataSn } from "./message";
import { useActions, MessageAction } from "./actions";

interface PromiseFnArgs{
    sn: number,
    resolve: (ActionData:any)=>void;
    reject:  (reason?:ActionError)=>void;
    timeout: any;
}

export class WorkerContext{
    public readonly IsSharedWorkerSupported = !!window.SharedWorker;
    private _defaultTimeout = 5000; // milliseconds
    private _dictActions = useActions();
    private readonly _worker: Worker|SharedWorker;
    private _dictWaiting : { [sn:number]: PromiseFnArgs }= {};
    private _sn = 0;

    public constructor(){
        if(this.IsSharedWorkerSupported){
            this._worker = new SharedWorker(
                new URL("./worker", import.meta.url),
                { name: "TensorAnalyzor", type: "module" });

            this._worker.onerror = this.onWorkerError;
            this._worker.port.onmessageerror = this.onWorkerMessageError;
            this._worker.port.onmessage = this.onWorkerMessage;
        }
        else{
            this._worker = new Worker(
                new URL("./worker", import.meta.url),
                { name: "TensorAnalyzor", type: "module" });
            
            this._worker.onerror = this.onWorkerError;
            this._worker.onmessageerror = this.onWorkerMessageError;
            this._worker.onmessage = this.onWorkerMessage;
        }
    }

    public OnMessage: ((event: MessageEvent<any>)=>void)|null = null;

    public postMessage = async(data: ActionData, maxWait?:number):Promise<ActionData>=>{
        const dataSN = data as ActionDataSn;
        dataSN.sn = this.fetchSN();

        const actionReturn = new Promise<ActionData>((resolve, reject)=>{
            // waiting for the reply
            const sn = dataSN.sn;
            const timeout = setTimeout(()=>{
                const waiting = this._dictWaiting[sn];
                if(waiting){
                    delete this._dictWaiting[sn];
                    waiting.reject({message: "timeout"});
                }
                else{
                    console.warn(`The waiting object(${sn}) missing.`);
                }
            }, maxWait??this._defaultTimeout);
            this._dictWaiting[dataSN.sn] = {sn, resolve, reject, timeout};
        });

        if(this.IsSharedWorkerSupported){
            const worker = this._worker as SharedWorker;
            worker.port.postMessage(dataSN);
        }
        else{
            const worker = this._worker as Worker;
            worker.postMessage(dataSN);
        }

        return actionReturn;
    }

    private onWorkerMessage = async (event: MessageEvent<ActionDataSn>)=>{
        const data = event.data
        if(data.sn == 0){
            const action  = this._dictActions[data.id];
            if(action?.actionForPage){
                await action.actionForPage(data, this);
            }
            else{
                console.warn(`There isn't any action for ${MessageAction[data.id]??""}(${data.id})`);
            }
        }
        else{
            const waiting = this._dictWaiting[data.sn];
            if(waiting !== null){
                clearTimeout(waiting.timeout);
                delete this._dictWaiting[data.sn];
                waiting.resolve(data);
            }
            else{
                console.warn(`The waiting object(${data.sn}) missing.`);
            }
        }
    }

    private onWorkerError = (e: ErrorEvent)=>{
        console.error(e);
    }

    private onWorkerMessageError = (e: MessageEvent)=>{
        console.error(e);
    }

    private fetchSN = ()=>{ return ++this._sn; }
}
