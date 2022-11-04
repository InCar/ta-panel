import { MessageAction } from "./actions";
import { ActionData, ActionDataSn } from "./message";
declare var onconnect: ((event:MessageEvent<any>)=>void)|undefined;


export class WorkerSink{
    private readonly isInSharedWorker = (typeof onconnect !== "undefined");
    private _listPorts: PortSink[] = [];

    public init = ()=>{
        if(this.isInSharedWorker){
            onconnect = this.onWorkerConnect;
        }
        else{
            onmessage = this.onWorkerMessage;
            onmessageerror = this.onWorkerMessageError;
            this.postMessage({ id: MessageAction.WorkerReady, sn: 0 })
        }
    }

    public OnMessage: ((event: MessageEvent<any>, port?: MessagePort)=>void)|null = null;

    public postMessage = (data:ActionDataSn, port?: MessagePort)=>{
        if(this.isInSharedWorker) port?.postMessage(data);
        else postMessage(data);
    };

    public broadcast = (data:ActionDataSn, portFrom?: MessagePort)=>{
        for(let portSink of this._listPorts){
            const portTo = portSink.getPort()
            if(portTo === portFrom){
                // with sn to self
                this.postMessage(data, portTo);
            }
            else{
                // without sn to others
                data.sn = 0;
                this.postMessage(data, portTo);
            }
        }
    };

    private onWorkerConnect = (event: MessageEvent<any>)=>{
        let total = this._listPorts.length;
        for(let port of event.ports){
            const portSink = new PortSink(port, this);
            total = this._listPorts.unshift(portSink);
            portSink.init(total);
        }
    }

    private onWorkerMessage = (event: MessageEvent<any>)=>{
        if(this.OnMessage) this.OnMessage(event);
    };

    private onWorkerMessageError = (e: MessageEvent<any>)=>{
        console.error(e);
    }
}

class PortSink{
    private _port: MessagePort;
    private _sink: WorkerSink;

    public constructor(port: MessagePort, sink: WorkerSink){
        this._port = port;
        this._sink = sink;
    }

    public init = (total: number)=>{
        this._port.onmessage = this.onWorkerMessage;
        this._port.onmessageerror = this.onWorkerMessageError;
        this._port.postMessage({ id: MessageAction.WorkerReady, sn: 0, args: { total } });
    }

    public getPort = ()=>{ return this._port; }

    private onWorkerMessage = (event: MessageEvent<any>)=>{
        if(this._sink.OnMessage) this._sink.OnMessage(event, this._port);
    }
    
    private onWorkerMessageError = (e: MessageEvent<any>)=>{
        console.error(e);
    }
}