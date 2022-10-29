<style scoped lang="scss">
@use "../theme.scss";

.task-mgr{
    padding: 1em;
    display: flex;
    flex-flow: row wrap;
    gap: 1em;
}
.task-mgr-1{
    padding: 1em;
    display: flex;
    flex-flow: column;
    gap: 1em;
}
.task-item{
    flex: 1 1 auto;
    cursor: pointer;
}
.error{
    padding: 0 1em;
    @include theme.mx-error;
}
</style>

<template>
    <div class="waiting-bar" :class="{paused: !isWaiting}" v-if="isWaiting">请稍候</div>
    <div class="task-mgr" v-if="!isChildActive">
        <template class="container" v-for="(task, i) in listTasks">
            <TaskView :task="task" :index="i"  class="task-item" @click="onClickTask(task)"/>
        </template>
        <div class="error" v-if="isError">
            <p>{{errorMessage}}</p>
        </div>
    </div>
    <div class="task-mgr-1" v-else>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, shallowReactive, ShallowReactive } from 'vue';
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

const isWaiting = ref(true);
const isError = ref(false);
const errorMessage = ref("");

onMounted(()=>{
    taObj.fetchTaskList().then((response)=>{
        isWaiting.value = false;
        if(response.result){
            for(let x of response.data){
                x.status = parseInt(x.status);
                listTasks.push(x);
            }
        }
        else{
            errorMessage.value = response.data;
            isError.value = true;
        }
    });
});
</script>