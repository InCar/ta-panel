import { Task, TAModeBase, TaskOperation } from "@ta";

// 这些OP的名称用来跟后台交换信息,不能随意改动
export enum EnumOP{
    NA,
    aggregation,
    "group-aggregation",
    geo
}

export interface TableDataEntry{
    x: number;
    y: number;
    strX: string;
}

export interface TableDataLabel{
    x: string;
    y: string;
}

export interface TableData{
    label: TableDataLabel;
    listData: TableDataEntry[];
}

export abstract class Operation{
    protected abstract readonly _op:EnumOP;

    public get OpName(){
        return EnumOP[this._op];
    }

    public abstract MakeSubmitArgs: (mode: TAModeBase)=>TaskOperation;
    public abstract MakeTableData: (task: Task)=>TableData;
}