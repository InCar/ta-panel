<style scoped lang="scss">
.container{
    align-self: stretch;
    padding: 1em;

    display: flex;
    flex-direction: column;
    gap: 1em;
}
</style>

<template>
    <div class="container">
        <template class="container" v-for="(task, i) in listTasks">
            <TaskView :task="task" :index="i" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, inject, shallowReactive, ShallowReactive } from 'vue';
import { TensorAnalyzor } from './TensorAnalyzor';
import TaskView from "./cmx/TaskView.vue";

const taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
const listTasks:ShallowReactive<any[]> = shallowReactive([]);

onMounted(()=>{
    taObj.fetchTaskList().then((response)=>{
        for(let x of response.data){
            listTasks.push(x);
        }
    });
});
</script>