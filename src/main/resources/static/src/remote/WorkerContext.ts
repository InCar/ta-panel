import { rejects } from "assert";

export class WorkerContext{
    private readonly isInSharedMode;
    private _worker: Worker|SharedWorker|null = null;
    private _bInitialized = false;

    public constructor(sharedMode:boolean){
        this.isInSharedMode = sharedMode;
        this.init();
    }

    public OnMessage: ((event: MessageEvent)=>any)|null = null;

    public postMessage = async(data: unknown)=>{
        if(!this._bInitialized){
            await this.waitForInit();
        }

        if(this.isInSharedMode){
            const worker = this._worker as SharedWorker;
            worker.port.postMessage(data);
        }
        else{
            const worker = this._worker as Worker;
            worker.postMessage(data);
        }
    }

    private onWorkerMessage = async (event: MessageEvent)=>{
        if(this.OnMessage) this.OnMessage(event);
    }

    private onWorkerError = (e: ErrorEvent)=>{
        console.error(e);
    }

    private onWorkerMessageError = (e: MessageEvent)=>{
        console.error(e);
    }

    private init = async()=>{
        let scriptForWorker = "src/remote/worker.ts";
        if(!import.meta.env.DEV){
            const response = await fetch("/manifest.json");
            if(response.ok){
                const manifest = await response.json();
                scriptForWorker = manifest[scriptForWorker].file;
            }
            else{
                return Promise.reject(response.statusText);
            }
        }

        if(this.isInSharedMode){
            this._worker = new SharedWorker(scriptForWorker, { name: "TensorAnalyzor", type: "module" });

            this._worker.onerror = this.onWorkerError;
            this._worker.port.onmessageerror = this.onWorkerMessageError;
            this._worker.port.onmessage = this.onWorkerMessage;
        }
        else{
            this._worker = new Worker(scriptForWorker, { name: "TensorAnalyzor", type: "module" });
            
            this._worker.onerror = this.onWorkerError;
            this._worker.onmessageerror = this.onWorkerMessageError;
            this._worker.onmessage = this.onWorkerMessage;
        }
        
        this._bInitialized = true;
    }

    private waitForInit = async()=>{
        if(this._bInitialized) return Promise.resolve(0);

        return new Promise((resolve, reject)=>{
            let wait = 0;
            const period = 500;
            const timer = setInterval(()=>{
                if(this._bInitialized){
                    clearInterval(timer);
                    resolve(0);
                }
                else{
                    wait += period;
                    if(wait > 10*1000){
                        clearInterval(timer);
                        reject("Timeout, waiting for WorkerContext initializing failed.")
                    }
                }
            }, period);
        });
    }
}
