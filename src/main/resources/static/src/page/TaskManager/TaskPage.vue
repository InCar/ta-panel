<style scoped lang="scss">
@use "../../theme.scss";
.error{
    @include theme.mx-error;
    padding: 1em;
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
    <div class="error" v-if="(!isWaiting) && errorMessage?.length > 0">
        <span>{{errorMessage}}</span>
    </div>
    <div v-if="task != null">
        <TaskView :task="task!" class="task-item" />
        <div class="task-action" v-if="isCancellable">
            <button v-if="isCancellable" @click="onCancel">取消</button>
        </div>
        <template v-if="hasResult">
            <CurveLineChart :data="diagramData" />
        </template>
        <div class="task-extra">
            <span>{{task!.id}}</span>
            <span v-if="task?.message">{{task!.message}}</span>
            <span v-if="task?.finishTime">{{task!.finishTime.toFormat("yyyy年MM月dd日 HH:mm")}}</span>
            <div v-if="resJson" style="margin-left:2em">
                <span v-for="(v,i) in resJson">{{i}} => {{v}}</span>
            </div>
            <div v-if="paramJson">
                <span>{{paramJson.operator.op}} : {{paramJson.operator.opArgs.aggregation.fn}}</span>
                <template v-for="field in paramJson.operator.opArgs.groupBy">
                    <span style="margin-left:2em;">{{field.field}} : {{field.from}}~{{field.to}} / {{field.step}}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import { TaskStatus } from "@remote";
import TaskView from "../../cmx/TaskView.vue";
import CurveLineChart from "../../cmx/CurveLineChart.vue";
import { useTaskStore } from '@store';

const route = useRoute();
const store = useTaskStore();
const isWaiting = ref(true);
const errorMessage = ref("");

const taskId = route.params.taskId as string;

onMounted(async ()=>{
    const resp = await store.fetch(taskId);
    isWaiting.value = false;
    if(!resp.result){
            errorMessage.value = JSON.stringify(resp);
    }
})

const task = computed(()=>{
    const taskFound = store.getTask(taskId);    
    return taskFound;
});

const paramJson = computed(()=>{
    if(task.value?.paramJson){
        return JSON.parse(task.value?.paramJson);
    }
    else{
        return null;
    }
});

const resJson = computed(()=>{
    if(task.value?.resJson){
        // console.info(JSON.parse(task.value?.resJson));
        return JSON.parse(task.value?.resJson);
    }
    else{
        return null;
    }
});

const diagramData = computed(
    ()=>Object.keys(resJson.value??[])
        .map(k=>({x: Number(k), y: Number(resJson.value[k])}))
        .sort((a, b)=>a.x-b.x)
    );

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
    // e.stopPropagation();
    const resp = await store.cancelTask(taskId);
    if(!resp.result){
        errorMessage.value = JSON.stringify(resp)
    }
};

</script>