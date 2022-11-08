
export interface BackPointResult{
    result: boolean;
    data?: any;
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
    // 1等待中|2执行中|3执行成功|4执行失败|5已取消|6已中断
    status: TaskStatus;
    message?: string;
    // 0.0~100.0
    percent?: number;
    createTime: Date;
    startTime: Date;
    finishTime?: Date;
    resJson?: string;
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