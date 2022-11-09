import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useTaskStore } from "./TaskStore";
import { TaskBean, TaskStatus } from "@remote";

class AnalyzorStore {
    private _taskStore = useTaskStore();

    public dictAnalyzorGroups = computed(()=>{
        const taskGroups:Array<{op:string, listTasks: TaskBean[]}> =  this._taskStore.listTasks
            .map(task=>task!.paramArgs.operator.op)
            .filter((op, i, self)=>self.indexOf(op) === i)
            .map(op=>({ op, listTasks:[]}));
        
        for(let task of this._taskStore.listTasks){
            const group = taskGroups.find(group=>group.op === task?.paramArgs.operator.op);
            group?.listTasks.push(task!);
        }

        const dictGroups: {[op:string]: TaskBean[]} = {};
        taskGroups.forEach(group=>{
            const listTasks = group.listTasks.filter(task=>task.status === TaskStatus.Succeeded)
                .sort((left, right)=>right.createTime.toSeconds() - left.createTime.toSeconds());

            if(listTasks.length > 0) dictGroups[group.op] = listTasks;
        });
        
        return dictGroups;
    });

    public fetch = async()=>{
        return await this._taskStore.fetch();
    }
}

export const useAnalyzorStore = defineStore(AnalyzorStore.name, ()=>{ return new AnalyzorStore() });