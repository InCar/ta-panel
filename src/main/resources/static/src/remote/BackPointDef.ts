import { DateTime } from "luxon";

export interface BackPointResult<T=any>{
    result: boolean;
    data?: T;
}

export enum TaskStatus{
    NA,
    Pending,
    Running,
    Succeeded,
    Failed,
    Canceled,
    Terminated
}

export interface TaskBean{
    id: string;
    name: string;
    paramJson: string;
    paramArgs: TaskBody;
    // 1等待中|2执行中|3执行成功|4执行失败|5已取消|6已中断
    status: TaskStatus;
    message?: string;
    // 0.0~100.0
    percent?: number;
    createTime: DateTime;
    startTime: DateTime;
    finishTime?: DateTime;
    resJson?: string;
    resData?: any;
}

export interface TaskOperation{
    op: string;
    opArgs: {
        groupBy?: FieldOption[],
        aggregation: {
            fn?: string;
            fns?: string[];
            fnArgs: any
        }
    }
}

export interface TaskBody{
    name: string;
    dataSources: Array<any>,
    fields: Array<any>,
    operator: TaskOperation,
    limit?: number
}

export interface FieldOption{
    field: string;
    from?: number;
    to?:   number;
    step?: number;
}