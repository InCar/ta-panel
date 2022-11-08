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
    <div v-if="isFetchDone">
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
            <span v-if="task?.finishTime">{{moment(task!.finishTime).format("MM月DD日HH:mm")}}</span>
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
    <div class="error" v-if="errorMessage?.length > 0">
        <span>{{errorMessage}}</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';
import moment from "moment";
import { TaskBean, TaskStatus, useTA } from "@remote";
import TaskView from "../../cmx/TaskView.vue";
import CurveLineChart from "../../cmx/CurveLineChart.vue";

const route = useRoute();
const taObj = useTA();
const isFetchDone:Ref<Boolean|null> = ref(null);
const task: Ref<TaskBean|null> = ref(null);
const errorMessage = ref("");

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

const init = async()=>{
    const taskId = route.params.taskId as string;
    const result = await taObj.fetchTaskSingle(taskId);
    if(!result.result){
        errorMessage.value = `远程调用失败: ${result.data}`;
    }
    else if(result?.data?.length > 0){
        task.value = result.data[0];
        task.value!.status = parseInt(result.data[0].status);
        isFetchDone.value = result.result;
    }
    else{
        errorMessage.value = "没有结果";        
    }
};


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
    const response = await taObj.cancelTask(task.value?.id as string);
    if(!response.result){
        errorMessage.value = JSON.stringify(response.data);
    }
};

onMounted(init);
</script>