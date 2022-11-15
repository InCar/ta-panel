import { TAModeBase, TAModeCount, TaskOperation, Task } from "@ta";
import { EnumOP, Operation, TableData } from "./BaseOP";

export class AggregationOP extends Operation
{
    protected readonly _op = EnumOP.aggregation;

    public constructor(){
        super();
    }

    public MakeSubmitArgs = (mode: TAModeBase):TaskOperation=>{
        const modeCount = mode as TAModeCount;

        // 参数检查
        const keys = Object.keys(modeCount.Fields);
        if(keys.length == 0){
            throw new Error("缺少字段");
        }

        // 构造OP
        const op = {
            op: "aggregation",
            opArgs: {
                aggregation: {
                    fns: ["count", "min", "max"],
                    fnArgs: {}
                }
            }
        }

        return op;
    };

    public MakeTableData = (task:Task):TableData=>{
        throw new Error("TODO");
    }
}