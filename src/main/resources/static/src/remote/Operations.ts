import { Range, TAMode, TAModeBase, TAModeCount, TAModeSingleDistribution } from "./TAModes";
import { TaskOperation } from "./BackPointDef";

const opFn: Array<(mode:TAModeBase)=>TaskOperation|null> = [];

opFn[TAMode.Count] = (arg: TAModeBase) =>{
    const mode = arg as TAModeCount;

    // 参数检查
    const keys = Object.keys(mode.Fields);
    if(keys.length == 0){
        console.error("缺少字段");
        return null;
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

opFn[TAMode.SingleDistribution] = (arg: TAModeBase)=>{
    const mode = arg as TAModeSingleDistribution;

    // 参数检查
    const keys = Object.keys(mode.Fields);
    if(keys.length == 0){
        console.error("缺少字段");
        return null;
    }
    if(keys.length > 1) console.warn("数值分布只使用一个字段,其它字段将会被忽略");
    const key = keys[0];

    // 构造OP
    const op = {
        op: "group-aggregation",
        opArgs: {
            groupBy: [{
                field: key,
                from: (mode.Range[key] as Range).from,
                to: (mode.Range[key] as Range).to,
                step: (mode.Range[key] as Range).step
            }],
            aggregation: {
                fn: "count",
                fnArgs: {}
            }
        }
    }

    return op;
};

export class Operations{
    public static MakeOP = (mode: TAModeBase):TaskOperation|null=>{
        if(opFn[mode.Mode!] == null){
            console.warn(`不支持该操作: ${mode.TaskName}`);
            return null;
        }

        return opFn[mode.Mode!](mode);
    }
};