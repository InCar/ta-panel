import { MessageAction } from "./actions";
import { BackProxy } from "./BackProxy";

export interface ActionData<T=any>{
    action: MessageAction;
    data?: T;
}

export interface ActionResponseData<T=any> extends ActionData<T>{
    ok: boolean;
}

export interface ActionError{
    cause: string;
    errorData?: any;
    innerError?: ActionError;
}

export interface ActionResponseError{
    ok: boolean;
    cause: string;
    errorData?: any;
    innerError?: ActionError
}

export type ActionResonse<T=any> = ActionResponseData<T> | ActionResponseError;

export interface Broadcast{ broadcast: boolean }
export interface DataSn{ sn: number }

export type ActionDataSn<T=any> = ActionData<T> & DataSn;
export type ActionResponseSn<T=any> =  ActionResonse<T> & DataSn;
export type ActionResponseBoardcast<T=any> = ActionResonse<T> & Broadcast;

export interface ActionProc<T=any, R=any>{
    action: MessageAction;
    actionForWorker?: (data: ActionData<T>)=>Promise<ActionResponseBoardcast<R>|void>;
    actionForNotify?: (data: ActionData<R>, ctx:BackProxy)=>Promise<void>;
}