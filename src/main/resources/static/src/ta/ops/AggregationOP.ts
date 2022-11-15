import { TAModeBase, TAModeCount, TaskOperation, Task } from "@ta";
import { stringify } from "querystring";
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

    public MakeTensorData = (task:Task):TensorData=>{
        const fields = task.paramArgs.fields;
        const fnGetFieldName = (field:string)=>{
            const found =  fields.find(f=>f.name == field);
            return found ? (found.desc??field) : field;
        };

        const axisX = { label: "指标", vt: "string" };
        const axisY = { label: "统计函数", vt: "string" };
        const axisZ = { label: "数值", vt: "number" };

        const tensor = [];
        for(let key in task.resData){
            const matches = /([^,]+),([^,]+)/.exec(key);
            if(matches){
                const x = matches[1];
                const y = matches[2];
                const z = parseFloat(task.resData[key]);
                tensor.push([fnGetFieldName(x), y, z]);
            }
        }
        
        return { dims: [axisX, axisY, axisZ], tensor};
    }
}