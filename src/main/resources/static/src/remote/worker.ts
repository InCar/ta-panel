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

    public onMessage = (event: MessageEvent<ActionDataSn>, port?:MessagePort)=>{
        const data = event.data
        const action  = this._dictActions[data.id];
        if(action?.actionForWorker){
            action.actionForWorker.call(action, data);
        }
        else{
            console.warn(`There isn't any action for ${MessageAction[data.id]??""}(${data.id})`)
        }
    }
}

const worker = new Worker();
worker.run();

export {};