import { ref, reactive, computed, inject } from "vue";
import { defineStore } from "pinia";

import { TaskBean, TensorAnalyzor, BackPointResult } from "@remote";

class TaskStore{
    private _taObj = inject("taObj") as TensorAnalyzor;

    private _dictTasks = reactive<{ [id:string]:TaskBean }>({});

    public listTasks = computed(()=>{
        return Object.entries(this._dictTasks).map(x=>x[1]);
    });

    public fetch = async():Promise<BackPointResult>=>{
        const backPD = await this._taObj.fetchTaskList();
        if(backPD?.result){
            for(let task of backPD.data as any[]){
                task.status = parseInt(task.status);
                // TODO: 可以使用更优化的更新内部属性的办法,以避免整体更新
                this._dictTasks[task.id] = task;
            }
            return { result: true };
        }
        else{
            return backPD;
        }
    }
}

export const useTaskStore = defineStore(TaskStore.name, ()=>{ return new TaskStore() });