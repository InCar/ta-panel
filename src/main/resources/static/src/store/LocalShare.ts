import { ref } from "vue";
import { defineStore } from "pinia";
import { useBackProxy } from "@remote";

class LocalShareStore{
    private _backProxy = useBackProxy();

    public Count = ref(0);

    public increment = async()=>{
        this.Count.value++;
    }
}

export const useLocalShareStore = defineStore(LocalShareStore.name, ()=>{ return new LocalShareStore() });