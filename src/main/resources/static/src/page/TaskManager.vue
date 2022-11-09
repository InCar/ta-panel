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
        <template class="container" v-for="(task, i) in taskStore.listTasks">
            <TaskView :task="task!" :index="i"  class="task-item" @click="onClickTask(task!)"/>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { TaskBean } from "@remote";
import { TaskView } from "@cmx";
import { computed } from '@vue/reactivity';
import { useTaskStore } from '@store';

const router = useRouter();
const taskStore = useTaskStore();

const isChildActive = computed(()=>{
    return router.currentRoute.value.matched.length > 1;
});

const onClickTask = (task: TaskBean)=>{
    router.push(`/TaskManager/${task.id}`);
}

const isWaiting = ref(false);
const isError = ref(false);
const errorMessage = ref("");

onMounted(async()=>{
    isWaiting.value = true;
    const backPD = await taskStore.fetch();
    isWaiting.value = false;

    if(backPD.result == false){
        errorMessage.value = backPD.data;
        isError.value = true;
    }
});
</script>