import { TensorAnalyzor } from "@ta";
import { BaseDM } from "./BaseDM";
import { AboutDM } from "./AboutDM";
import { TaskDM } from "./TaskDM";
import { TaskGroupDM } from "./TaskGroupDM";
import { DataSourceDM } from "./DataSourceDM";

let sdm:SDM|null = null;

export const useSDM = ()=>(sdm!);
export const activeSDM = (taObj: TensorAnalyzor)=>{
    if(!sdm) sdm = new SDM(taObj);
    return sdm;
}

class SDM{    
    private _taObj;
    private _dictDM:{ [name:string]:BaseDM } = {};

    public constructor(taObj: TensorAnalyzor){
        this._taObj = taObj;
    }

    public get AboutDM(){
        return this.retrieveDM<AboutDM>(AboutDM);
    }

    public get TaskDM(){
        return this.retrieveDM<TaskDM>(TaskDM);
    }

    public get TaskGroupDM(){
        return this.retrieveDM<TaskGroupDM>(TaskGroupDM);
    }

    public get DataSourceDM(){
        return this.retrieveDM<DataSourceDM>(DataSourceDM);
    }

    private retrieveDM = <T extends BaseDM>(t:{new(taObj: TensorAnalyzor):T}):T=>{
        let dm = this._dictDM[t.name];
        if(!dm){
            dm = new t(this._taObj);
            this._dictDM[t.name] = dm;
        }
        return dm as T;
    }
}