import { MessageAction } from ".";
import { ActionData, ActionProc } from "../message";
import { WorkerContext } from "../WorkerContext";

export class DispatchSharedAction implements ActionProc{
    public readonly action = MessageAction.DispatchShared;

    public actionForWorker = async(data:ActionData<number>)=>{
       return { id: data.id, broadcast: true, args: data.args };
    }

    public actionForPage = async(data: ActionData, ctx: WorkerContext)=>{
        // TODO: update store????
        console.info(data);
    }
}