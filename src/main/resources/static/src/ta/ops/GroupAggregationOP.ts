import { TAModeBase, Range, TAModeSingleDistribution, TaskOperation, Task } from "@ta";
import { EnumOP, Operation, TableData } from "./BaseOP";

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

    public MakeTableData = (task:Task):TableData=>{
        const data = task.resData as { [key:string]:string };
        const field = task.paramArgs.fields[0];

        const label = {x: field.desc??field.name, y:"数量"};
        const listData = Object.keys(data)
                    .map(k=>({x: parseFloat(k), y: Number(data[k]), strX:k}))
                    .sort((a, b)=>a.x-b.x);

        return { label, listData };
    }
}
