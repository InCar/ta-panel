import { TJsonFields } from "./TensorAnalyzor";

export enum TAMode{
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
    public Mode: TAMode | null = null;
    public Title: string = "NA";
    public Description: string = "NA";
    public TaskName = "新任务";
    public Fields: TJsonFields = {};
    public Range: { [key:string]: Range|Object } = {};
    public LimitMax?: number = 10000;
    public Active = true;
}

export class TAModeCount extends TAModeBase{
    public constructor(){
        super();
        super.Mode = TAMode.Count;
        super.Title = "计数和极值";
        super.Description = "统计指标的数据量和最大值最小值,通常数据量越大,进行同样的分析,所需时间就会越久";
        delete this.LimitMax;
    }
}

export class TAModeSingleDistribution extends TAModeBase{
    public constructor(){
        super();
        super.Mode = TAMode.SingleDistribution;
        super.Title = "数值分布";
        super.Description = "分析一个指标的数值分布情况,对指标值进行区间计数统计,看看哪些区间的数据比较多,哪些比较少";
    }
}

export class TAModeSingleGeo extends TAModeBase{
    public constructor(){
        super();
        super.Mode = TAMode.SingleGeo;
        super.Title = "单值地理分布";
        super.Description = "分析一个指标在地理维度上的分布情况";
        super.Active = false;
    }
}

export class TAModeMultipleGeo extends TAModeBase{
    public constructor(){
        super();
        super.Mode = TAMode.MultipleGeo;
        super.Title = "多数值地理分布";
        super.Description = "将多个指标进行混合运算后";
        super.Active = false;
    }
}