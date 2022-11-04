import { ref } from "vue";
import { defineStore } from "pinia";
import { useBackProxy } from "@remote";

class LocalShareStore{
    private _backProxy = useBackProxy();

    public IsSharedWorkerSupported = this._backProxy.IsSharedWorkerSupported;
    public Count = ref(0);

    public increment = async()=>{
        const count = this.Count.value + 1;
        const dataRet = await this._backProxy.dispatchShared(count);
        console.info(dataRet);
    }
}

export const useLocalShareStore = defineStore(LocalShareStore.name, ()=>{ return new LocalShareStore() });