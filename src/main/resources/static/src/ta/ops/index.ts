import { TAMode } from "../mode";
import { Operation, EnumOP } from "./BaseOP";
import { AggregationOP } from "./AggregationOP";
import { GroupAggregationOP } from "./GroupAggregationOP";
import { GeoOP } from "./GeoOP";

export * from "./BaseOP";

// 有可能出现多个TAMode对应同一个OP的情况
const lookupOpByMode : { [mode: number]: {new():Operation} } = {};
lookupOpByMode[TAMode.Count] = AggregationOP;
lookupOpByMode[TAMode.SingleDistribution] = GroupAggregationOP;

type OPER = { new():Operation };

// 一一对应
const lookupOpByName : { [op: string]: OPER } = {};
lookupOpByName[EnumOP[EnumOP.aggregation]] = AggregationOP;
lookupOpByName[EnumOP[EnumOP["group-aggregation"]]] = GroupAggregationOP;
lookupOpByName[EnumOP[EnumOP.geo]] = GeoOP;

export const createOP = (lookup: string|TAMode):Operation=>{
    let t : OPER;
    if(typeof lookup === "string"){
        // lookup by op
        t = lookupOpByName[lookup];
            if(!t){
            throw new Error(`Unsupported OP ${lookup}`);
        }
    }
    else{
        t = lookupOpByMode[lookup];
        if(!t){
            throw new Error(`Unsupported OP ${TAMode[lookup]}(${lookup})`);
        }
    }

    return new t();
}