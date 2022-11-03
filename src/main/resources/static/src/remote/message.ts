export enum MessageAction{
    WorkerReady,
    WorkerError,
    AboutDispatch,
    FetchTaskForAll
}

export interface ActionData<T=never>{
    id: MessageAction;
    ok?: boolean;
    data: T | ActionError;
}

export interface ActionError{
    message: string;
    data?: unknown;
    error?: ActionError;
}