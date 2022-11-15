<style scoped lang="scss">
@use "../../theme.scss";
.error{
    @include theme.mx-error;
    padding: 1em;
}
h2{
    text-align: center;
}
.task-item{
    flex: 1 1 auto;
    cursor: pointer;
}
.task-extra{
    margin: 1em 0;
}
.task-action{
    margin: 1em;
    flex-flow: row nowrap;
    justify-content: center;

    button{
        padding: 0.5em 2em;
    }
}

</style>

<template>
    <div class="error" v-if="errorMessage?.length > 0">
        <span>{{errorMessage}}</span>
    </div>
    <div v-if="!!task">
        <h2>{{task.name}}</h2>
        <TaskView :task="task!" class="task-item" />
        <div class="task-action" v-if="isCancellable">
            <button v-if="isCancellable" @click="onCancel">取消</button>
        </div>
        <TaskExtra :task="task"/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { TaskStatus } from "@ta";
import { TaskExtra, TaskView } from "@cmx";
import { useSDM } from '@sdm';

const route = useRoute();
const taskDM = useSDM().TaskDM;
const isWaiting = ref(true);
const errorMessage = ref("");

const taskId = route.params.taskId as string;

onMounted(async ()=>{
    try{
        await taskDM.fetch(taskId);
    }
    catch(e){
        errorMessage.value = `${e}`;
    }
    finally{
        isWaiting.value = false;
    }
})

const task = computed(()=>{
    const taskFound = taskDM.getTask(taskId);    
    return taskFound;
});

const taskDuration = computed(()=>{
    if((!!task.value.startTime) && (!!task.value.finishTime)){
        return task.value.finishTime.diff(task.value.startTime).toFormat("d天h小时m分");
    }

    return null;
});

const isCancellable = computed(()=>{
    if(task.value?.status == TaskStatus.Pending || task.value?.status == TaskStatus.Running)
        return true;
    else
        return false;
});

const hasResult = computed(()=>{
    return task.value?.status == TaskStatus.Succeeded;
});

const onCancel = async (e:Event)=>{
    try{
        // e.stopPropagation();
        errorMessage.value = "";
        isWaiting.value = true;
        await taskDM.cancelTask(taskId);
    }
    catch(e){
        errorMessage.value = `${e}`;
    }
    finally{
        isWaiting.value = false;
    }
};

</script>