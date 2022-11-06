import { ref } from "vue";
import { defineStore } from "pinia";
import { useBackProxy } from "@remote";
import { ActionError } from "src/remote/message";

class LocalShareStore{
    private _backProxy = useBackProxy()!;

    public IsSharedWorkerSupported = this._backProxy.IsSharedWorkerSupported;
    public Count = ref(0);

    public increment = async()=>{
        const count = this.Count.value + 1;
        const dataRet = await this._backProxy.dispatchShared(count);
        if(dataRet.ok){
            this.Count.value = count;
        }
        else{
            console.warn((dataRet as ActionError).cause);
        }
    }
    
    public setCount = async(value:number)=>{
        this.Count.value = value;
    }
}

export const useLocalShareStore = defineStore(LocalShareStore.name, ()=>{ return new LocalShareStore() });