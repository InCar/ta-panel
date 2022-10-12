
export interface TJsonFields {
    [key: string]: { desc?: string, description?: string }
}

export class TensorAnalyzor {
    // VITE_FETCH_PREFIX
    private VITE_FETCH_PREFIX = "";

    // 可用字段
    private _jsonFields: TJsonFields | null = null;

    public constructor(env:any){
        if(env.DEV){
            this.VITE_FETCH_PREFIX = env.VITE_FETCH_PREFIX;
            console.info(`fetch api in ${env.MODE} mode -> ${this.VITE_FETCH_PREFIX}`);
        }
    }

    // 初始化
    public init = async (): Promise<number> => {
        return 0;
    };

    private doFetch = async (url: string): Promise<Response> =>{
        return await fetch(`${this.VITE_FETCH_PREFIX}${url}`);
    };

    public fetchHello = async()=>{
        return await this.doFetch("/api/hello");
    }

    public fetchJsonFields = async () : Promise<TJsonFields> => {
        if (this._jsonFields == null) {
            const api = "/api/fields";
            const resp = await this.doFetch(api);
            const data = await resp.json();
            console.info(`${api} => ${Object.keys(data.fields).length}`);
            this._jsonFields = data.fields;
        }
        return this._jsonFields ?? {};
    };
}