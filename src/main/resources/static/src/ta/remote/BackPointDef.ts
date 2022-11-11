// 所有本文件内的定义都需要和后端保持一致,不可随意修改
export interface TDataSF{
    dataSources: TDataSources;
    fields: TDataFields;
}

type TDataSource = string | object;

export interface TDataSources{ [ds: string]: TDataSource }

interface TDataField{
    data:string;
    desc?: string;
    description?: string
}

export interface TDataFields { [key: string]: TDataField }

export interface TaskBean{
    id: string;
    name: string;
    paramJson: string;
    // 1等待中|2执行中|3执行成功|4执行失败|5已取消|6已中断
    status: string;
    message?: string;
    // 0.0~100.0
    percent?: string;
    createTime: number;
    startTime?: number;
    finishTime?: number;
    resJson?: string;
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

export interface TaskBody{
    name: string;
    dataSources: Array<{name: string, ds: TDataSource}>,
    fields: Array<TDataField & {name:string}>,
    operator: TaskOperation,
    limit?: number
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

export interface FieldOption{
    field: string;
    from?: number;
    to?:   number;
    step?: number;
}