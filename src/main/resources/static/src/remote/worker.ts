import { WorkerMessage } from "./browser";
declare var onconnect: (event:MessageEvent<WorkerMessage>)=>void;


class BroadcastSharedWorker{
    private listPorts = Array<WorkerPort>();

    public run = ()=>{
        onconnect = this.onConnect;
    }

    private onConnect = (event:MessageEvent)=>{
        for(let port of event.ports){
            this.listPorts.push(new WorkerPort(port, this));
        }
    }
    
    public onMessage = (msg: WorkerMessage, from: WorkerPort)=>{
        for(let workerPort of this.listPorts){
            if(workerPort !== from) workerPort.post(msg);
        }
    }
}

class WorkerPort{
    private readonly _worker;
    private readonly _port;

    public constructor(port: MessagePort, worker: BroadcastSharedWorker){
        this._worker = worker;
        this._port = port;
        this._port.onmessage = this.onMessage;
        this._port.onmessageerror = this.onMessageError;
    }

    public post = (msg: WorkerMessage)=>{
        this._port.postMessage(msg);
    }

    private onMessage = (event:MessageEvent<WorkerMessage>)=>{
        this._worker.onMessage(event.data, this);
    }

    private onMessageError = (ev: MessageEvent)=>{
        console.error(ev);
    }
}

const worker = new BroadcastSharedWorker();
worker.run();