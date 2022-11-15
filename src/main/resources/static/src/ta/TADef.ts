import { DateTime } from "luxon";
import { TaskStatus, TaskBody, TaskBean } from "./remote";
import { createOP, EnumOP } from "./ops";

export class Task{
    public readonly id: string;
    public readonly name: string;
    public readonly paramArgs: TaskBody;    
    public readonly createTime: DateTime;
    public readonly startTime?: DateTime;
    public readonly finishTime?: DateTime;
    public readonly resData?: any;
    
    public status: TaskStatus;
    public percent = 0.0; // 0.0~100.0

    public constructor(src: TaskBean){
        this.id = src.id;
        this.name = src.name;
        this.status = parseInt(src.status);
        this.paramArgs = JSON.parse(src.paramJson);
        this.createTime = DateTime.fromMillis(src.createTime);

        if(!!src.startTime) this.startTime = DateTime.fromMillis(src.startTime);
        if(!!src.finishTime) this.finishTime = DateTime.fromMillis(src.finishTime);
        if(!!src.percent) this.percent = parseFloat(src.percent);
        if(!!src.resJson) this.resData = JSON.parse(src.resJson);
    }

    public get OP():EnumOP{
        const strOP = this.paramArgs.operator.op;
        return EnumOP[strOP as keyof typeof EnumOP] ?? EnumOP.NA;
    }

    public makeTensor = ()=>{
        const op = createOP(this.paramArgs.operator.op);
        return op.MakeTensorData(this);
    }
}