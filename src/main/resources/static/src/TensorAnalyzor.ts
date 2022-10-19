import { TAModeBase, TAModeSingleDistribution, Range } from "./TAModes";

export interface TJsonFields {
    [key: string]: { desc?: string, description?: string }
}

export class TensorAnalyzor {
    // 可用数据源
    private _dataSources: any = null;
    // 可用字段
    private _jsonFields: TJsonFields | null = null;

    // 初始化
    public init = async (): Promise<number> => {
        return 0;
    };

    public fetchJsonFields = async () : Promise<TJsonFields> => {
        if (this._jsonFields == null) {
            const api = "/api/fields";
            const resp = await fetch(api);
            const data = await resp.json();
            console.info(`${api} => ${Object.keys(data.fields).length}`);
            this._dataSources = data.dataSources;
            this._jsonFields = data.fields;
        }
        return this._jsonFields ?? {};
    };

    public submitTask = async(mode: TAModeBase):Promise<{code:number, message:string}>=>{
        const task = this.makeTaskForSD(mode as TAModeSingleDistribution);
        const api = "/api/submit-task";
        const resp = await fetch(api, {
            method: "POST",
            body: JSON.stringify(task),
            headers: { "Content-Type": "application/json" }
        });
        const data = await resp.json();
        console.info(data);
        return { code: -1, message: "还没有实现！" };
    }

    private makeTaskForSD = (mode: TAModeSingleDistribution)=>{
        const keys = Object.keys(mode.Fields);
        if(keys.length == 0){
            console.error("缺少字段");
            return null;
        }
        if(keys.length > 1) console.warn("数值分布只使用一个字段,其它字段将会被忽略");
        const key = keys[0];

        const task = {
            name: mode.TaskName,
            dataSources: this.objectsToArray(this._dataSources, "name", "ds"),
            fields: this.objectsToArray(mode.Fields),
            operator: {
                op: "group-aggregation",
                opArgs: {
                    groupBy: [{
                        field: `${key}`,
                        from: (mode.Range[`${key}`] as Range).from,
                        to: (mode.Range[`${key}`] as Range).to,
                        step: (mode.Range[`${key}`] as Range).step
                    }],
                    aggregation: {
                        fn: "count",
                        fnArgs: {}
                    }
                }
            }
        };
        return task;
    }

    // Java后端不擅于处理动态属性名称,因此转换为数组形式
    private objectsToArray = (src: any, propKey?:string, propValue?:string)=>{
        const arrayTarget:Array<Object> = [];

        for(let key of Object.keys(src)){
            if(src.hasOwnProperty(key)){
                const attached:any = {};
                attached[propKey??"name"] = key;

                const x = src[key]
                if(typeof x === "object" && !Array.isArray(x) && x !== null){
                    arrayTarget.push(Object.assign(x, attached));
                }
                else{
                    attached[propValue??"data"] = x;
                    arrayTarget.push(attached);
                }
            }
        }
        
        return arrayTarget;
    };
}
