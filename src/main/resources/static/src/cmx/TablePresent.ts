export interface TP_Dimension{
    dim: string; // 维度名称
    isNumber: boolean; // 数据是数值型,还是其它类型
}

export interface TP_Data{
    // 数据维度描述
    listDims: ReadonlyArray<TP_Dimension>;
    // 数据,外层代表数据的集合,内层表示数据每个维度的值
    data: ReadonlyArray<any[]>;
}