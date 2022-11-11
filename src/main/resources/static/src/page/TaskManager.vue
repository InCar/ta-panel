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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { TaskBean, TaskStatus } from "@ta";
import { TaskView } from "@cmx";
import { useTaskStore } from '@store';
import { DateTime, Duration } from 'luxon';

const router = useRouter();
const taskStore = useTaskStore();

const isChildActive = computed(()=>{
    return router.currentRoute.value.matched.length > 1;
});

const listTasks = computed(()=>{
    const tmNow = DateTime.local().toSeconds();
    
    return taskStore.listTasks.filter(task=>{
        if(task?.status != TaskStatus.Succeeded) return true;
        if(!task?.finishTime) return true;

        const dura = tmNow - task?.finishTime?.toSeconds();
        const days = dura/86400;
        return (days < 7.0);
    });
})

const onClickTask = (task: TaskBean)=>{
    router.push(`/TaskManager/${task.id}`);
}

const isWaiting = ref(false);
const isError = ref(false);
const errorMessage = ref("");

onMounted(async()=>{
    try{
        isWaiting.value = true;
        await taskStore.fetch();
    }
    catch(e){
        isError.value = true;
        errorMessage.value = `${e}`;
    }
    finally{
        isWaiting.value = false;
    }
});
</script>