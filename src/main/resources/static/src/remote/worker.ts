import { useActions, MessageAction } from "./actions";
import { ActionDataSn, ActionResponseSn, DataSn } from "./message";
import { WorkerSink } from "./WorkerSink";

class Worker{
    private _sink = new WorkerSink();
    private _dictActions = useActions();

    public run = ()=>{
        this._sink.OnMessage = this.onMessage;
        this._sink.init(this.createInitData);
    }

    public onMessage = async (event: MessageEvent<ActionDataSn>, portFrom?:MessagePort)=>{
        const data = event.data
        const action  = this._dictActions[data.action];
        console.info(action);
        if(action?.actionForWorker){
            const response = await action.actionForWorker(data);
            if(typeof response !== "undefined"){
                const responseSN = response as unknown as ActionResponseSn;
                responseSN.sn = data.sn;
                this._sink.postMessage(responseSN, portFrom);
                if(response.broadcast){
                    responseSN.sn = 0;
                    this._sink.broadcastToOthers(responseSN, portFrom);
                }
            }
            else{
                // 代表不需要回复
            }
        }
        else{
            console.warn(`There isn't any action for ${MessageAction[data.action]??""}(${data.action})`)
        }
    }

    private createInitData = ():ActionDataSn=>{
        const total = this._sink.ConnectionCount;
        return { action: MessageAction.WorkerReady, sn: 0, data: { total } };
    }
}

const worker = new Worker();
worker.run();

export {};