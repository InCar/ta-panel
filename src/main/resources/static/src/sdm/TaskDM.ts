import { reactive, computed } from "vue";
import { BaseDM } from "./BaseDM";
import { TensorAnalyzor, Browser, TaskBean, Task, TaskStatus, TAModeBase } from "@ta";

export class TaskDM extends BaseDM{
    private _dictTasks = reactive<{ [id:string]:Task }>({});

    public constructor(taObj: TensorAnalyzor){
        super(taObj);
        Browser.register<any[]>(TaskDM.name, this.onNotify);
    }

    public listTasks = computed(()=>{
        return Object.entries(this._dictTasks).map(x=>x[1])
            .sort((left, right)=>(right.createTime.toSeconds() - left.createTime.toSeconds()));
    });

    public getTask = (id:string)=>{
        return this._dictTasks[id];
    }

    public fetch = async(id?:string):Promise<void>=>{
        let listTaskBeans: TaskBean[];
        if(!!id) listTaskBeans = await super.taObj.fetchTaskSingle(id);
        else listTaskBeans = await super.taObj.fetchTaskList();

        this.updateDictionary(listTaskBeans.map(x=>new Task(x)));
        Browser.broadcast(TaskDM.name, listTaskBeans);
    }

    public submitTask = async(mode:TAModeBase)=>{
        return super.taObj.submitTask(mode);
    }

    public cancelTask = async(id:string)=>{
        await super.taObj.stopTask(id);
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