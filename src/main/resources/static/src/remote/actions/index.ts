import { ActionProc } from "../message";

const listActionTypes:ReadonlyArray<any> = (()=>{
    /** vite专有特性,和下面的写法作用相当
     *  import { WorkerReadyAction } from "./WorkerReadyAction";
        import { DispatchSharedAction } from "./DispatchSharedAction";
        // import ...
        const listActionTypes = [ WorkerReadyAction, DispatchSharedAction ]
     */
    const listTypes = Array<any>();
    const listActionMods = import.meta.glob(["./*.ts", "!./index.ts"], { eager: true });
    for(let name in listActionMods){
        const mod:any = listActionMods[name];
        for(let t in mod){
            listTypes.push(mod[t]);
        }
    }
    return listTypes;
})();

export enum MessageAction{
    WorkerReady,
    WorkerError,
    DispatchShared,
    FetchTaskForAll
}

export interface DictActionProc{
    [index: number]: ActionProc|undefined|null;
}

export const useActions = (isInWorker:boolean)=>{
    const actions:ActionProc[] = listActionTypes
        .map(t=>{
            try{
                return new t(isInWorker);
            }
            catch(e){
                console.error(e);
                return {};
            }
        })
        .filter(x=>(typeof x.action === "number"));

    const dictActions : DictActionProc = {};
    for(let action of actions){
        dictActions[action.action] = action;
    }
    return dictActions;
}