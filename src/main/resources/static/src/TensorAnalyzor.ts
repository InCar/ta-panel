import { TAModeBase } from "./TAModes";

export interface TJsonFields {
    [key: string]: { desc?: string, description?: string }
}

export class TensorAnalyzor {
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
            this._jsonFields = data.fields;
        }
        return this._jsonFields ?? {};
    };

    public submitTask = async(task: TAModeBase):Promise<{code:number, message:string}>=>{
        return { code: -1, message: "还没有实现！" }
    }
}
