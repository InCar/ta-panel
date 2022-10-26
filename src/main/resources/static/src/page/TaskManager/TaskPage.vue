<style scoped lang="scss">
@use "../../theme.scss";
.error{
    @include theme.mx-error;
    padding: 1em;
}
.task-extra{
    margin: 1em 0;
}
</style>

<template>
    <div v-if="isFetchDone">
        <TaskView :task="task!" />
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
    <div class="error" v-if="isFetchDone === false">
        <span>{{errorMessage}}</span>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, Ref } from 'vue';
import { useRoute } from 'vue-router';
import moment from "moment";
import { TaskBean, TensorAnalyzor } from 'logic';
import TaskView from "../../cmx/TaskView.vue";
import { computed } from '@vue/reactivity';

const route = useRoute();
const taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
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
        console.info(JSON.parse(task.value?.resJson));
        return JSON.parse(task.value?.resJson);
    }
    else{
        return null;
    }
});

const init = async()=>{
    const taskId = route.params.taskId as string;
    const result = await taObj.fetchTaskSingle(taskId);
    if(!result.result){
        errorMessage.value = `远程调用失败: ${result.data}`;
    }
    else if(result?.data?.length > 0){
        task.value = result.data[0];
        isFetchDone.value = result.result;
    }
    else{
        errorMessage.value = "没有结果";        
    }
};

onMounted(init);
</script>