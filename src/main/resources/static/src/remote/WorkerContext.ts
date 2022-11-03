import { ActionData, ActionOk, ActionDataSn, ActionProc } from "./message";
import { useActions, MessageAction } from "./actions";

export class WorkerContext{
    public readonly IsSharedWorkerSupported = !!window.SharedWorker;
    private readonly _worker: Worker|SharedWorker;
    private _sn = 0;
    private _dictActions = useActions();

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

    public postMessage = async(data: ActionData):Promise<ActionData>=>{
        const dataSN = data as ActionDataSn;
        dataSN.sn = this.fetchSN();

        if(this.IsSharedWorkerSupported){
            const worker = this._worker as SharedWorker;
            worker.port.postMessage(dataSN);
        }
        else{
            const worker = this._worker as Worker;
            worker.postMessage(dataSN);
        }

        // TODO: waiting back
        return ActionOk<any>(data.id);
    }

    private onWorkerMessage = (event: MessageEvent<ActionDataSn>)=>{
        const data = event.data
        if(data.sn == 0){
            const action  = this._dictActions[data.id];
            if(action?.actionForPage){
                action.actionForPage(data, this);
            }
            else{
                console.warn(`There isn't any action for ${MessageAction[data.id]??""}(${data.id})`);
            }
        }
        else{
            // TODO: .....
            console.info(event.data);
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
