import { TDataFields } from "../remote";

export enum TAMode{
    Detection,
    Count,
    SingleDistribution,
    SingleGeo,
    MultipleGeo
}

export interface Range{
    from: number;
    step: number;
    to: number;
}

export abstract class TAModeBase{
    public abstract readonly Mode: TAMode;
    public abstract readonly Title: string;
    public abstract readonly Description: string;
    public Active = true;
    public TaskName = "新任务";

    public Fields: TDataFields = {};
    public Range: { [key:string]: Range| {} } = {};
    public LimitMax?: number = 10000;
}

export class TAModeDetection extends TAModeBase{
    public readonly Mode = TAMode.Detection;
    public readonly Title = "数据侦测";
    public readonly Description = "探测数据中的基本特征,哪些是时间字段,哪些是地理坐标,哪些是整型/浮点型/枚举型数据";
}

export class TAModeCount extends TAModeBase{
    public readonly Mode = TAMode.Count;
    public readonly Title = "计数和极值";
    public readonly Description = "统计指标的数据量和最大值最小值,通常数据量越大,进行同样的分析,所需时间就会越久";
    public constructor(){
        super();
        delete this.LimitMax;
    }
}

export class TAModeSingleDistribution extends TAModeBase{
    public readonly Mode = TAMode.SingleDistribution;
    public readonly Title = "数值分布";
    public readonly Description = "分析一个指标的数值分布情况,对指标值进行区间计数统计,看看哪些区间的数据比较多,哪些比较少";
}

export class TAModeSingleGeo extends TAModeBase{
    public readonly Mode = TAMode.SingleGeo;
    public readonly Title = "单值地理分布";
    public readonly Description = "分析一个指标在地理维度上的分布情况";
    public constructor(){
        super();
        super.Active = false;
    }
}

export class TAModeMultipleGeo extends TAModeBase{
    public readonly Mode = TAMode.MultipleGeo;
    public readonly Title = "多数值地理分布";
    public readonly Description = "将多个指标进行混合运算后";
    public constructor(){
        super();
        super.Active = false;
    }
}