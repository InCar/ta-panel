interface BackPointResult<T=any>{
    result: boolean;
    data?: T;
    message?: string;
}

export class BackPoint{
    // 用于开发目的
    private readonly _backPointKey = "back-point";
    private readonly _backPointDefault = "http://10.0.11.50:8060";
    private _backPoint: string|null = null;

    public constructor(){
        this._backPoint = this.loadBackPointConfig();
    }

    public get BackPoint():string{
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

    public get = async<T=any>(api:string, headers?:{}):Promise<T>=>{
        headers = this.addDevHeader(headers??{});
        const resp = await fetch(api, {
            method: "GET",
            headers
        });

        return await this.resolveResp<T>(resp);
    }

    public post = async<T=any>(api:string, body?:any, headers?:{}):Promise<T>=>{
        headers = this.addDevHeader(headers??{});
        const resp = await fetch(api, {
            method: "POST",
            body: body?JSON.stringify(body):undefined,
            headers
        });
        
        return await this.resolveResp<T>(resp);
    }

    public put = async<T=any>(api:string, body?:any, headers?:{}):Promise<T>=>{

        headers = this.addDevHeader(headers??{});
        const resp = await fetch(api, {
            method: "PUT",
            body: body?JSON.stringify(body):undefined,
            headers
        });
        
        return await this.resolveResp<T>(resp);
    }

    private loadBackPointConfig = ()=>{
        const backPoint = localStorage.getItem(this._backPointKey);
        return backPoint;
    };

    private addDevHeader(headers:{ "X-Back-Point"?:string }){
        // 调试用途
        if(this._backPoint != null){
            headers["X-Back-Point"] = this._backPoint;
        }
        return headers;
    }

    private resolveResp = async<T=any>(resp: Response):Promise<T>=>{
        if(resp.ok){
            const jsonResult: BackPointResult<T> = await resp.json();
            if(jsonResult.result == true)
                return jsonResult.data as T;
            else
                throw new Error("Failed", { cause: jsonResult.message });
        }
        else{
            const message = `${resp.status} (${resp.statusText})`;
            let cause = await resp.text();
            if(cause.length === 0){
                throw new Error(message);
            }
            else{
                try{ cause = JSON.parse(cause) } catch(e){ /* ignore */ }
                throw new Error(message, { cause } );
            }
        }
    };
}