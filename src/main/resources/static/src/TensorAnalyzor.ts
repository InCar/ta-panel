import { TAModeBase, TAModeSingleDistribution } from "./TAModes";

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
            dataSources: this._dataSources,
            fields: mode.Fields,
            operator: {
                group: {
                    by: [{
                            field: `${key}`,
                            from: 0,
                            to: 100,
                            step: 10
                        }],
                    aggregation: {
                        count: {}
                    }
                }
            }
        };
        return task;
    }
}
