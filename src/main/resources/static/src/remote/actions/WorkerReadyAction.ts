import { MessageAction } from ".";
import { BackProxy } from "../BackProxy";
import { ActionData, ActionProc, ActionResponseBoardcast } from "../message";

export class WorkerReadyAction implements ActionProc{
    public readonly action = MessageAction.WorkerReady;
    public actionForNotify = async(data: ActionData<{ total: number}>, ctx: BackProxy)=>{
        const message = "the worker is ready";
        const total = data.data?.total ?? -1;
        console.info(`${message}, total ${total} connection${total>1?"s":""}`);
    }
}