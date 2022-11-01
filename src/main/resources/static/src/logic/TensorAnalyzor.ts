import { TAModeBase } from "./TAModes";
import { Operations, TaskOperation } from "./Operations";

export interface TJsonFields {
    [key: string]: { desc?: string, description?: string }
}

interface TaskBody{
    name: string;
    dataSources: Array<any>,
    fields: Array<any>,
    operator: TaskOperation,
    limit?: number
}

export class TensorAnalyzor {
    // 用于开发目的
    private readonly _backPointKey = "back-point";
    private readonly _backPointDef = "http://10.0.11.50:8060";
    private _backPoint: string|null = null;
    // 可用数据源
    private _dataSources: any = null;
    // 可用字段
    private _jsonFields: TJsonFields | null = null;

    // 初始化
    public init = async (): Promise<number> => {
        this.loadBackPointConfig();
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

    public fetchTaskList = async()=>{
        const api = "/api/task/list";
        return await this.fetchBackPoint(api);
    };

    public fetchTaskSingle = async(id:string)=>{
        const api = `/api/task/list?id=${id}`;
        return await this.fetchBackPoint(api);
    };

    public cancelTask = async(id:string)=>{
        const api = `/api/task/cancel`;
        return await this.putBackPoint(api, { id });
    };

    public submitTask = async(mode: TAModeBase):Promise<{code:number, message:string, taskId?:string}>=>{
        const task = this.assembleTaskBody(mode);
        if(task == null) return { code: -3, message: `尚不支持该操作: ${mode.TaskName}` };

        const api = "/api/submit-task";
        let  headers:any = { "Content-Type": "application/json" };
        // 调试用途
        if(this._backPoint != null){
            headers["X-Back-Point"] = this._backPoint;
        }

        const resp = await fetch(api, {
            method: "POST",
            body: JSON.stringify(task),
            headers
        });

        const data = await resp.json();
        // 出错了
        if(data.code < 0) return data;
        // 解出内层BackPoint的结果
        const resultBP:{ result:boolean, data:string} = JSON.parse(data.message);
        if(!resultBP.result)
            return { code: -2, message: resultBP.data };
        else
            return { code: 0, message: "创建任务成功", taskId: resultBP.data };
    }

    private assembleTaskBody = (mode: TAModeBase):TaskBody|null=>{
        const op = Operations.MakeOP(mode);
        if(op == null) return null;

        const task = {
            name: mode.TaskName,
            dataSources: this.objectsToArray(this._dataSources, "name", "ds"),
            fields: this.objectsToArray(mode.Fields),
            operator: op,
            limit: mode.LimitMax
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

    public getBackPoint = ()=>{
        return this._backPoint??this._backPointDef;
    }

    public updateBackPoint = (backPoint:string|null)=>{
        if(backPoint === this._backPointDef || backPoint == null){
            localStorage.removeItem(this._backPointKey);
            this._backPoint = null;
        }
        else{
            localStorage.setItem(this._backPointKey, backPoint);
            this._backPoint = backPoint;
        }
    }

    private loadBackPointConfig = ()=>{
        const backPoint = localStorage.getItem(this._backPointKey);
        if(backPoint != null){
            this._backPoint = backPoint;
        }
    };

    private addDevHeader(headers:any){
        // 调试用途
        if(this._backPoint != null){
            headers["X-Back-Point"] = this._backPoint;
        }
        return headers;
    }

    private fetchBackPoint = async(api:string, headers?:any):Promise<{result:boolean, data?:any}>=>{
        try{
            if(headers == undefined || headers == null) headers = {};
            headers = this.addDevHeader(headers);
            const resp = await fetch(api, {
                method: "GET",
                headers
            });

            if(resp.ok) return await resp.json();
            else{
                const err = await resp.text();
                return { result: false, data: `${resp.statusText} -> ${err}` };
            }
        }
        catch(e){
            console.error(`FetchBackPoint ${api} error => ${e}`);
            return { result: false, data: e }
        }
    };

    private putBackPoint = async(api:string, body?:any, headers?:any):Promise<{result:boolean, data?:any}>=>{
        try{
            if(headers == undefined || headers == null) headers = {};
            headers = this.addDevHeader(headers);
            const resp = await fetch(api, {
                method: "PUT",
                body: body?JSON.stringify(body):undefined,
                headers
            });

            if(resp.ok) return await resp.json();
            else{
                const err = await resp.text();
                return { result: false, data: `${resp.statusText} -> ${err}` };
            }
        }
        catch(e){
            console.error(`FetchBackPoint ${api} error => ${e}`);
            return { result: false, data: e }
        }
    };
}
