import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import { TaskBean, BackPointResult, useTA, Browser, TaskStatus } from "@remote";
import { DateTime } from "luxon";

class TaskStore{
    private _taObj = useTA();
    private _dictTasks = reactive<{ [id:string]:TaskBean|null }>({});

    public constructor(){
        Browser.register<any[]>(TaskStore.name, this.onNotify);
    }

    public listTasks = computed(()=>{
        return Object.entries(this._dictTasks).map(x=>x[1]);
    });

    public getTask = (id:string)=>{
        return this._dictTasks[id];
    }

    public fetch = async(id?:string):Promise<BackPointResult>=>{
        let backPD;
        if(id === undefined) backPD = await this._taObj.fetchTaskList();
        else   backPD = await this._taObj.fetchTaskSingle(id);

        if(backPD.result){
            this.updateDictionary(backPD.data);
            Browser.broadcast(TaskStore.name, backPD.data);
            return { result: true };
        }
        else{
            return backPD;
        }
    }

    public cancelTask = async(id:string)=>{
        const resp = await this._taObj.stopTask(id);
        if(resp.result){
            const task = this._dictTasks[id];
            if(task) task.status = TaskStatus.Canceled;
        }
        return resp;
    }

    private onNotify = (data: any[])=>{
        this.updateDictionary(data);
    }

    private updateDictionary = (data: any[])=>{
        for(let task of data){
            task.status = parseInt(task.status);
            task.createTime = DateTime.fromMillis(task.createTime);
            task.startTime = DateTime.fromMillis(task.startTime);
            if(task.finishTime){
                task.finishTime = DateTime.fromMillis(task.finishTime);
            }
            // TODO: 可以使用更优化的更新内部属性的办法,以避免整体更新
            this._dictTasks[task.id] = task;
        }
    };
}

export const useTaskStore = defineStore(TaskStore.name, ()=>{ return new TaskStore() });