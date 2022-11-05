declare var onconnect: ((event:MessageEvent<any>)=>void)|undefined;

type InitDataFn = (isInSharedWorker:boolean)=>unknown;

export class WorkerSink{
    private readonly isInSharedWorker = (typeof onconnect !== "undefined");
    private _initDataFn: InitDataFn|null = null;
    private _listPorts: PortSink[] = [];

    public get TotalPorts(){ return this._listPorts.length; }

    public init = (initDataFn:InitDataFn)=>{
        if(this.isInSharedWorker){
            // 保存起来,待connecting使用
            this._initDataFn = initDataFn;
            onconnect = this.onWorkerConnect;
        }
        else{
            onmessage = this.onWorkerMessage;
            onmessageerror = this.onWorkerMessageError;
            this.postMessage(initDataFn(this.isInSharedWorker));
        }
    }

    public get ConnectionCount(){
        return this.isInSharedWorker ? this._listPorts.length : 1;
    }

    public OnMessage: ((event: MessageEvent, portFrom?: MessagePort)=>void)|null = null;

    public postMessage = (data:unknown, port?: MessagePort)=>{
        if(this.isInSharedWorker) port?.postMessage(data);
        else postMessage(data);
    };

    /**不会发送到portFrom*/
    public broadcastToOthers = (data:unknown, portFrom?: MessagePort)=>{
        for(let portSink of this._listPorts){
            const portTo = portSink.Port;
            if(portTo !== portFrom) portTo.postMessage(data);
        }
    };

    private onWorkerConnect = (event: MessageEvent)=>{
        for(let port of event.ports){
            const portSink = new PortSink(port, this);
            this._listPorts.unshift(portSink);
            portSink.init(this._initDataFn!(this.isInSharedWorker));
        }
    }

    private onWorkerMessage = (event: MessageEvent)=>{
        if(this.OnMessage) this.OnMessage(event);
    };

    private onWorkerMessageError = (e: MessageEvent)=>{
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

    public init = (initData: unknown)=>{
        this._port.onmessage = this.onWorkerMessage;
        this._port.onmessageerror = this.onWorkerMessageError;
        this._port.postMessage(initData);
    }

    public get Port(){ return this._port; }

    private onWorkerMessage = (event: MessageEvent)=>{
        if(this._sink.OnMessage) this._sink.OnMessage(event, this._port);
    }
    
    private onWorkerMessageError = (e: MessageEvent)=>{
        console.error(e);
    }
}