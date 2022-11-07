export interface WorkerMessage<T=any>{
    tag: number|string;
    data?: T;
}

export class Browser{
    private static s_browser: Browser|null = null;
    public static readonly IsInSharedMode = !!window.SharedWorker;

    public static broadcast = <T=any>(tag:number|string, data?: T):void=>{
        // do nothing if not in shared mode
        if(!this.IsInSharedMode) return;

        if(this.s_browser === null){
            this.s_browser = new Browser();
        }
        
        this.s_browser.post({ tag, data });
    }

    public static register = <T=any>(tag: number|string, fnOn: (data:T)=>void)=>{
        // do nothing if not in shared mode
        if(!this.IsInSharedMode) return;

        if(this.s_browser === null){
            this.s_browser = new Browser();
        }

        this.s_browser.register(tag, fnOn);
    }

    public static unregister = (tag: number|string)=>{
        this.s_browser?.unregister(tag);
    }

    private _worker;
    private _register:{ [tag: number|string]: ((data:any)=>void)} = {};

    public constructor(){
        this._worker = new SharedWorker(new URL("./worker", import.meta.url), { name: "TensorAnalyzor", type: "module"});
        
        this._worker.port.onmessage = this.onMessage;

        this._worker.onerror = this.onError;
        this._worker.port.onmessageerror = this.onMessageError;
    }

    public post = (msg: WorkerMessage)=>{
        this._worker.port.postMessage(msg);
    }

    public register = (tag: number|string, fnOn: (data:any)=>void)=>{
        this._register[tag] = fnOn;
    }

    public unregister = (tag: number|string)=>{
        delete this._register[tag];
    }

    private onMessage = (event: MessageEvent<WorkerMessage>)=>{
        const fnRegistered = this._register[event.data.tag];

        if(!!fnRegistered){
            try{
                fnRegistered(event.data.data);
            }
            catch(e){
                console.error(e);
            }
        }
        else{
            console.warn(`There isn't any register for ${event.data.tag}`)
        }
    }

    private onError = (ev: ErrorEvent)=>{
        console.error(ev);
    }

    private onMessageError = (ev: MessageEvent)=>{
        console.error(ev);
    }
}