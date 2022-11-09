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
        return Object.entries(this._dictTasks).map(x=>x[1])
            .sort((left, right)=>(right!.createTime.toSeconds() - left!.createTime.toSeconds()));
    });

    public getTask = (id:string)=>{
        return this._dictTasks[id];
    }

    public fetch = async(id?:string):Promise<BackPointResult>=>{
        let backPD;
        if(id === undefined) backPD = await this._taObj.fetchTaskList();
        else   backPD = await this._taObj.fetchTaskSingle(id);

        if(backPD.result){
            const listTasks = this.fixString(backPD.data);
            this.updateDictionary(listTasks);
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
        const listTasks = this.fixString(data);
        this.updateDictionary(listTasks);
    }

    private updateDictionary = (data: TaskBean[])=>{
        for(let task of data){
            // TODO: 可以使用更优化的更新内部属性的办法,以避免整体更新
            this._dictTasks[task.id] = task;
        }
    };

    private fixString = (data: any[])=>{
        const listTasks = Array<TaskBean>();
        for(let task of data){
            const taskCopy = {...task};
            taskCopy.status = parseInt(taskCopy.status);
            taskCopy.createTime = DateTime.fromMillis(taskCopy.createTime);
            taskCopy.startTime = DateTime.fromMillis(taskCopy.startTime);
            if(taskCopy.finishTime){
                taskCopy.finishTime = DateTime.fromMillis(taskCopy.finishTime);
            }
            taskCopy.paramArgs = JSON.parse(taskCopy.paramJson);
            if(taskCopy.resJson){
                taskCopy.resData = JSON.parse(taskCopy.resJson);
            }
            listTasks.push(taskCopy);
        }
        return listTasks;
    }
}

export const useTaskStore = defineStore(TaskStore.name, ()=>{ return new TaskStore() });