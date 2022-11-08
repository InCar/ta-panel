import { BackPointResult } from "./BackPointDef";

export class BackPoint{
    // 用于开发目的
    private readonly _backPointKey = "back-point";
    private readonly _backPointDefault = "http://10.0.11.50:8060";
    private _backPoint: string|null = null;

    public constructor(){
        this._backPoint = this.loadBackPointConfig();
    }

    public get BackPoint(){
        return this._backPoint??this._backPointDefault;
    }

    public set BackPoint(value: string|null){
        if(value === this._backPointDefault || value == null){
            localStorage.removeItem(this._backPointKey);
            this._backPoint = null;
        }
        else{
            localStorage.setItem(this._backPointKey, value);
            this._backPoint = value;
        }
    }

    public get = async(api:string, headers?:any):Promise<BackPointResult>=>{
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
    }

    public post = async(api:string, body?:any, headers?:any):Promise<BackPointResult>=>{
        try{
            if(headers === undefined || headers === null) headers = {};
            headers = this.addDevHeader(headers);
            const resp = await fetch(api, {
                method: "POST",
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
    }

    public put = async(api:string, body?:any, headers?:any):Promise<BackPointResult>=>{
        try{
            if(headers === undefined || headers === null) headers = {};
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
    }

    private loadBackPointConfig = ()=>{
        const backPoint = localStorage.getItem(this._backPointKey);
        return backPoint;
    };

    private addDevHeader(headers:any){
        // 调试用途
        if(this._backPoint != null){
            headers["X-Back-Point"] = this._backPoint;
        }
        return headers;
    }
}