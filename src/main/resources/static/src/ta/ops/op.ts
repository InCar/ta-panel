import { TAModeBase } from "../../ta/mode/TAModes";
import { TaskOperation } from "../remote/BackPointDef";

// 这些OP的名称用来跟后台交换信息,不能随意改动
export enum EnumOP{
    NA,
    aggregation,
    "group-aggregation"
}

export abstract class Operation{
    public abstract readonly op: EnumOP;

    public get opName():string{
        return EnumOP[this.op];
    }

    public abstract Make: <T extends TAModeBase>(mode: T)=>TaskOperation;
}