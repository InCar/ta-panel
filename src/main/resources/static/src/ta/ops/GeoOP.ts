import { TAModeBase, TaskOperation, Task } from "@ta";
import { EnumOP, Operation, TableData } from "./BaseOP";

export class GeoOP extends Operation{
    protected readonly _op = EnumOP.geo;

    public MakeSubmitArgs = (mode: TAModeBase):TaskOperation=>{
        throw new Error("TODO");
    }

    public MakeTableData = (data:Task):TableData=>{
        throw new Error("TODO");
    }
}