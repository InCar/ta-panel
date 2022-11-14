import { TDataFields, TensorAnalyzor } from "@ta";
import { shallowReactive } from "vue";
import { BaseDM } from "./BaseDM";

export class DataSourceDM extends BaseDM{
    public readonly DataFields = shallowReactive<TDataFields>({})

    public constructor(taObj: TensorAnalyzor){
        super(taObj);
    }

    public fetch = async()=>{
        const fields = await super.taObj.fetchJsonFields();
        Object.assign(this.DataFields, fields);
    }
}