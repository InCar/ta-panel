import { TensorAnalyzor } from "@ta";

export abstract class BaseDM{
    private _taObj;

    public constructor(taObj: TensorAnalyzor){
        this._taObj = taObj;
    }

    protected get taObj(){ return this._taObj; }
}