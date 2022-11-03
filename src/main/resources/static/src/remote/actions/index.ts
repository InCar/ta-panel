import { ActionProc } from "../message";
import { WorkerReadyAction } from "./WorkerReadyAction";
import { DispatchSharedAction } from "./DispatchSharedAction";

export enum MessageAction{
    WorkerReady,
    WorkerError,
    DispatchShared,
    FetchTaskForAll
}

const createActions = ():ActionProc[]=>{
    return [
        new WorkerReadyAction(),
        new DispatchSharedAction()
    ];
}

export const useActions = ()=>{
    const actions = createActions();
    const dictActions : { [index: number]: ActionProc|undefined} = {};
    for(let action of actions){
        dictActions[action.action] = action;
    }
    return dictActions;
}