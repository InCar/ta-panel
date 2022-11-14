import { computed, ref } from "vue";
import { BaseDM } from "./BaseDM";
import { TensorAnalyzor, Browser } from "@ta";

export class AboutDM extends BaseDM{

    public WorkerMode = ref(Browser.IsInSharedMode?"Shared":"NonShared")
    public Count = ref(0);

    public constructor(taObj: TensorAnalyzor){
        super(taObj);
        
        Browser.register(AboutDM.name, this.onNotifyCount);
        Browser.broadcast(AboutDM.name);
    }

    public increment = ()=>{
        this.Count.value++;
        Browser.broadcast(AboutDM.name, this.Count.value);
    }

    private onNotifyCount = (data?: number)=>{
        if(data !== undefined){
            this.Count.value = data;
        }
        else{
            Browser.broadcast(AboutDM.name, this.Count.value);
        }
    }
    
    public get BackPoint():string{
        return super.taObj.BackPoint;
    }
    public set BackPoint(value:string|null){
        super.taObj.BackPoint = value;
    }
}