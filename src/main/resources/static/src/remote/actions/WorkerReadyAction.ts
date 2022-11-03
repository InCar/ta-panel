import { MessageAction } from ".";
import { ActionData, ActionProc } from "../message";
import { WorkerContext } from "../WorkerContext";

export class WorkerReadyAction implements ActionProc{
    public readonly action: MessageAction = MessageAction.WorkerReady;
    
    public actionForPage = async (data: ActionData<{total:number}>, ctx: WorkerContext)=>{
        const message = "the worker is ready";
        if(data.args){
            const total = data.args.total;
            console.info(`${message}, total ${total} connection${total>1?"s":""}`);
        }
        else{
            console.info(message);
        }
    }
}