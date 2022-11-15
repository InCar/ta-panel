import { TAModeBase, Range, TAModeSingleDistribution, TaskOperation, Task } from "@ta";
import { parse } from "path";
import { TensorData, EnumOP, Operation } from "./BaseOP";

export class GroupAggregationOP extends Operation{
    protected readonly _op = EnumOP["group-aggregation"];

    public constructor(){
        super();
    }

    public MakeSubmitArgs = (mode: TAModeBase):TaskOperation=>{
        const modeSD = mode as TAModeSingleDistribution;
    
        // 参数检查
        const keys = Object.keys(modeSD.Fields);
        if(keys.length == 0){
            throw new Error("缺少字段");
        }
        if(keys.length > 1){
            throw new Error("数值分布只允许使用一个字段");
        }
        const key = keys[0];
    
        // 构造OP
        const op = {
            op: "group-aggregation",
            opArgs: {
                groupBy: [{
                    field: key,
                    from: (modeSD.Range[key] as Range).from,
                    to: (modeSD.Range[key] as Range).to,
                    step: (modeSD.Range[key] as Range).step
                }],
                aggregation: {
                    fn: "count",
                    fnArgs: {}
                }
            }
        }
    
        return op;
        
    }

    public MakeTensorData = (task:Task):TensorData=>{
        const field = task.paramArgs.fields[0];
        const axisX = {
            label: field.desc??field.name, vt: "string",
            asNumber: (v:any):number=>{
                const matches = /(\d+)-(\d+)/.exec(`${v}`);
                if(matches){
                    return (parseInt(matches[1]) + parseInt(matches[2]))/2;
                }
                else{
                    return parseInt(v);
                }
            }
        };
        const axisY = { label: "数量", vt: "number" };

        const data = task.resData as { [key:string]:string };
        const tensor = Object.keys(data)
                    .map(k=>([k, Number(data[k])]))
                    .sort((left, right)=>{
                        const leftN = axisX.asNumber(left);
                        const rightN = axisX.asNumber(right);
                        return leftN - rightN;
                    });
        
        return { dims: [axisX, axisY], tensor };
    }
}
