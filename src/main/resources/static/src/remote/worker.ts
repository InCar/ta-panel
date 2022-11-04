import { useActions, MessageAction } from "./actions";
import { ActionDataSn } from "./message";
import { WorkerSink } from "./WorkerSink";

class Worker{
    private _sink = new WorkerSink();
    private _dictActions = useActions();

    public run = ()=>{
        this._sink.OnMessage = this.onMessage;
        this._sink.init();
    }

    public onMessage = async (event: MessageEvent<ActionDataSn>, port?:MessagePort)=>{
        const data = event.data
        const action  = this._dictActions[data.id];
        if(action?.actionForWorker){
            const dataRet = await action.actionForWorker(data);
            if(typeof dataRet !== "undefined"){
                const dataRetSn = dataRet as ActionDataSn;
                dataRetSn.sn = data.sn;
                if(dataRet.broadcast){
                    this._sink.broadcast(dataRetSn, port);
                }
                else{
                    this._sink.postMessage(dataRetSn, port);
                }
            }
        }
        else{
            console.warn(`There isn't any action for ${MessageAction[data.id]??""}(${data.id})`)
        }
    }
}

const worker = new Worker();
worker.run();

export {};