import { ref } from "vue";
import { defineStore } from "pinia";
import { Browser } from "@remote";

class AboutStore{
    public WorkerMode = ref(Browser.IsInSharedMode?"Shared":"NonShared")
    public Count = ref(0);

    public constructor(){
        Browser.register(AboutStore.name, this.onNotifyCount);
    }

    public increment = ()=>{
        this.Count.value++;
        Browser.broadcast(AboutStore.name, this.Count.value);
    }

    private onNotifyCount = (data: number)=>{
            this.Count.value = data;
    }
}

export const useAboutStore = defineStore(AboutStore.name, ()=>{ return new AboutStore() });