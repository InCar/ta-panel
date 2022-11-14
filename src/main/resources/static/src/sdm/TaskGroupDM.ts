import { computed } from "vue";
import { BaseDM } from "./BaseDM";
import { useSDM } from "@sdm";
import { TensorAnalyzor, Task, TaskStatus } from "@ta";

export class TaskGroupDM extends BaseDM{

    private _taskDM = useSDM().TaskDM;

    public constructor(taObj: TensorAnalyzor){
        super(taObj);
    }

    public AnalyzorGroups = computed(()=>{
        const taskGroups:Array<{op:string, listTasks: Task[]}> = this._taskDM.listTasks.value
                .map(task=>task.paramArgs.operator.op)
                .filter((op, i, self)=>self.indexOf(op) === i)
                .map(op=>({ op, listTasks:[]}));
        
        for(let task of this._taskDM.listTasks.value){
            const group = taskGroups.find(group=>group.op === task.paramArgs.operator.op);
            group?.listTasks.push(task);
        }

        const dictGroups: {[op:string]: Task[]} = {};
        taskGroups.forEach(group=>{
            const listTasks = group.listTasks.filter(task=>task.status === TaskStatus.Succeeded)
                .sort((left, right)=>right.createTime.toSeconds() - left.createTime.toSeconds());

            if(listTasks.length > 0) dictGroups[group.op] = listTasks;
        });
        
        return dictGroups;
    });

    public fetch = async()=>{
        return await this._taskDM.fetch();
    }
}