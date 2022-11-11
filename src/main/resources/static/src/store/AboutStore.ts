import { ref } from "vue";
import { defineStore } from "pinia";
import { Browser } from "@ta";

class AboutStore{
    public WorkerMode = ref(Browser.IsInSharedMode?"Shared":"NonShared")
    public Count = ref(0);

    public constructor(){
        Browser.register(AboutStore.name, this.onNotifyCount);
        Browser.broadcast(AboutStore.name);
    }

    public increment = ()=>{
        this.Count.value++;
        Browser.broadcast(AboutStore.name, this.Count.value);
    }

    private onNotifyCount = (data?: number)=>{
        if(data !== undefined){
            this.Count.value = data;
        }
        else{
            Browser.broadcast(AboutStore.name, this.Count.value);
        }
    }
}

export const useAboutStore = defineStore(AboutStore.name, ()=>{ return new AboutStore() });