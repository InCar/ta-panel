<style scoped lang="scss">
.task-mgr{
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;

    .task-item{
        cursor: pointer;
    }
}
</style>

<template>
    <div class="task-mgr" v-if="!isChildActive">
        <template class="container" v-for="(task, i) in listTasks">
            <TaskView :task="task" :index="i"  class="task-item" @click="onClickTask(task)"/>
        </template>
    </div>
    <div class="task-mgr" v-else>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { onMounted, inject, shallowReactive, ShallowReactive } from 'vue';
import { useRouter } from 'vue-router';
import { TaskBean, TensorAnalyzor } from 'logic';
import TaskView from "../cmx/TaskView.vue";
import { computed } from '@vue/reactivity';

const router = useRouter();
const taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
const listTasks:ShallowReactive<TaskBean[]> = shallowReactive([]);

const isChildActive = computed(()=>{
    return router.currentRoute.value.matched.length > 1;
});

const onClickTask = (task: TaskBean)=>{
    router.push(`/TaskManager/${task.id}`);
}

onMounted(()=>{
    taObj.fetchTaskList().then((response)=>{
        for(let x of response.data){
            listTasks.push(x);
        }
    });
});
</script>