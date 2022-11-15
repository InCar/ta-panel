import { Task, TAModeBase, TaskOperation } from "@ta";

// 这些OP的名称用来跟后台交换信息,不能随意改动
export enum EnumOP{
    NA,
    aggregation,
    "group-aggregation",
    geo
}

export interface Axis{
    label: string;
    vt: string;
    asNumber?: (v:any)=>number;
}

export interface TensorData{
    dims: Axis[];
    tensor: Array<any[]>;
}

export abstract class Operation{
    protected abstract readonly _op:EnumOP;

    public get OpName(){
        return EnumOP[this._op];
    }

    public MakeSubmitArgs = (mode: TAModeBase):TaskOperation => {
        throw new Error("Not Implementation!");
    };
    public MakeTensorData = (task: Task):TensorData=>{
        throw new Error("Not Implementation!");
    }
}