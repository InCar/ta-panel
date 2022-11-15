import { TAModeBase, TAModeCount, TaskOperation, Task } from "@ta";
import { EnumOP, Operation, TensorData } from "./BaseOP";

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

    public MakeTableData = (task:Task):TensorData=>{
        const listData = [];
        const label = { x: "X", y: "Y"};

        const listFields = task.paramArgs.fields;
        for(let key in task.resData){
            const matches = /([^,]+),([^,]+)/.exec(key);
            console.info(matches[1], matches[2])
        }
        throw new Error("TODO")
    }
}