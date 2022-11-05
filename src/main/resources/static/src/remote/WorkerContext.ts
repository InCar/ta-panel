export class WorkerContext{
    public readonly IsSharedWorkerSupported = !!window.SharedWorker;
    private readonly _worker: Worker|SharedWorker;

    public constructor(){
        if(this.IsSharedWorkerSupported){
            this._worker = new SharedWorker(
                new URL("./worker", import.meta.url),
                { name: "TensorAnalyzor", type: "module" });

            this._worker.onerror = this.onWorkerError;
            this._worker.port.onmessageerror = this.onWorkerMessageError;
            this._worker.port.onmessage = this.onWorkerMessage;
        }
        else{
            this._worker = new Worker(
                new URL("./worker", import.meta.url),
                { name: "TensorAnalyzor", type: "module" });
            
            this._worker.onerror = this.onWorkerError;
            this._worker.onmessageerror = this.onWorkerMessageError;
            this._worker.onmessage = this.onWorkerMessage;
        }
    }

    public OnMessage: ((event: MessageEvent)=>any)|null = null;

    public postMessage = (data: unknown)=>{
        if(this.IsSharedWorkerSupported){
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
}
