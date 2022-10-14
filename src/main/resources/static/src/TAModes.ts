
export enum TAMode{
    SingleDistribution,
    SingleGeo,
    MultipleGeo
}

export abstract class TAModeBase{
    public Mode: TAMode | null = null;
    public Title: string = "NA";
    public Description: string = "NA";
    public Active = true;
}

export class TAModeSingleDistribution extends TAModeBase{
    public field = "";
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