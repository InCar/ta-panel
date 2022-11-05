import { MessageAction } from ".";
import { BackProxy } from "../BackProxy";
import { ActionData, ActionProc, ActionResponseBoardcast } from "../message";
import { WorkerContext } from "../WorkerContext";

export class DispatchSharedAction implements ActionProc<number, number>{
    public readonly action = MessageAction.DispatchShared;
    
    public actionForWorker = async(data : ActionData<number>)=>{
        const response: ActionResponseBoardcast<number> = {
            action: data.action,
            ok: true,
            data: data.data,
            broadcast: true
        };
        return response;
    }

    public actionForNotify = async(data: ActionData<number>, ctx: BackProxy)=>{
        // TODO: how to update store???
        console.info(data);
    }

}