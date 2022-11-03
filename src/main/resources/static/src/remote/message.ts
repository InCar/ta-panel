import { MessageAction } from "./actions";
import { WorkerContext } from "./WorkerContext";

export interface ActionData<T=any>{
    id: MessageAction;
    ok?: boolean;
    args?: T;
    error?: ActionError;
}

export interface ActionError{
    message: string;
    data?: any;
    error?: ActionError;
}

export type ActionDataSn<T=any> = ActionData<T> & { sn: number };

export const ActionOk = <T>(id:MessageAction, data?:T)=>({ id, ok: true, data});
export const ActionFailed = (id:MessageAction, message:string, data?:any, error?:ActionError)=>({ id, ok: false, message, data, error});

export interface ActionProc{
    action: MessageAction;
    actionForWorker?: (data: ActionData<any>)=>Promise<ActionData<any>>;
    actionForPage?:   (data: ActionData<any>, ctx:WorkerContext)=>Promise<void>;
}