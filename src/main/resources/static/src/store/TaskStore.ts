import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import { useTA, Browser, TaskBean, Task, TaskStatus } from "@ta";

class TaskStore{
    private _taObj = useTA();
    private _dictTasks = reactive<{ [id:string]:Task|null }>({});

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

    public fetch = async(id?:string):Promise<void>=>{
        let listTaskBeans: TaskBean[];
        if(!!id) listTaskBeans = await this._taObj.fetchTaskSingle(id);
        else listTaskBeans = await this._taObj.fetchTaskList();

        this.updateDictionary(listTaskBeans.map(x=>new Task(x)));
        Browser.broadcast(TaskStore.name, listTaskBeans);
    }

    public cancelTask = async(id:string)=>{
        await this._taObj.stopTask(id);
        const task = this._dictTasks[id];
        if(task) task.status = TaskStatus.Canceled;
    }

    private onNotify = (listTaskBeans: TaskBean[])=>{
        this.updateDictionary(listTaskBeans.map(x=>new Task(x)));
    }

    private updateDictionary = (data: Task[])=>{
        for(let task of data){
            // TODO: 可以使用更优化的更新内部属性的办法,以避免整体更新
            this._dictTasks[task.id] = task;
        }
    };
}

export const useTaskStore = defineStore(TaskStore.name, ()=>{ return new TaskStore() });