import { TAModeBase } from "./mode/TAModes";
import { TDataSF, TDataFields, TaskBody, TDataSources, TaskBean } from "./remote/BackPointDef";
import { BackPoint } from "./remote/BackPoint";
import { createOP } from "./ops";

export class TensorAnalyzor {
    // 可用数据源
    private _dataSources: TDataSources|null = null;
    // 可用字段
    private _jsonFields: TDataFields|null = null;
    // 用于开发目的
    private _backPoint = new BackPoint();

    // 初始化
    public init = async (): Promise<number> => {
        return 0;
    };

    public fetchJsonFields = async ()=> {
        await this.fetchDSF();
        return this._jsonFields;
    };

    public fetchDataSources = async ()=>{
        await this.fetchDSF();
        return this._dataSources;
    };

    private fetchDSF = async()=>{
        if (this._jsonFields == null || this._dataSources == null) {
            const api = "/api/fields";
            const resp = await fetch(api);
            if(resp.ok){
                const data : TDataSF = await resp.json();
                console.info(`${api} => ${Object.keys(data.fields).length}`);
                this._dataSources = data.dataSources;
                this._jsonFields = data.fields;
            }
            else{
                throw new Error(`${resp.statusText}(${resp.status})`);
            }
        }
    };

    public fetchMongoDB = async()=>{
        const api = "/api/mongodb";
        const resp = await fetch(api);
        return await resp.text();
    }

    public submitTask = async(mode: TAModeBase):Promise<string>=>{
        const task = this.assembleTaskBody(mode);

        const api = "/api/task/start";
        let  headers:any = { "Content-Type": "application/json" };
        const taskId = await this._backPoint.post<string>(api, task, headers);
        return taskId;
    }

    public fetchTaskList = async()=>{
        const api = "/api/task/list";
        return await this._backPoint.get<TaskBean[]>(api);
    };

    public fetchTaskSingle = async(id:string)=>{
        const api = `/api/task/list?id=${id}`;
        return await this._backPoint.get<TaskBean[]>(api);
    };

    public stopTask = async(id:string)=>{
        const api = `/api/task/stop?ids=${id}`;
        return await this._backPoint.post<void>(api);
    };

    private assembleTaskBody = (mode: TAModeBase):TaskBody=>{
        const op = createOP(mode.Mode)
        const opArgs = op.MakeSubmitArgs(mode);
        const task:TaskBody = {
            name: mode.TaskName,
            dataSources: this.objectsToArray(this._dataSources!, "name", "ds") as any,
            fields: this.objectsToArray(mode.Fields) as any,
            operator: opArgs,
            limit: mode.LimitMax
        };
        return task;
    }

    // Java后端不擅于处理动态属性名称,因此转换为数组形式
    private objectsToArray = (src: {[key:string]:unknown}, propKey?:string, propValue?:string)=>{
        const arrayTarget:Array<object> = [];

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
    }

    public get BackPoint():string{
        return this._backPoint.BackPoint;
    }

    public set BackPoint(value: string|null){
        this._backPoint.BackPoint = value;
    }
}