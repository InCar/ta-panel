import { ref } from "vue";
import { defineStore } from "pinia";

class TaskStore{
    public count = ref(0);

    public inc = ()=>{
        this.count.value++;
    }
}

export const useTaskStore = defineStore(TaskStore.name, ()=>{ return new TaskStore() });