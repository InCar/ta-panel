<style scoped lang="scss">
@use "../../theme.scss";
.task-one{
    width: 100%;
    margin: 0 auto;

    @media(min-width: 1160px){
        width: 1000px;
    }

    h2{
        align-self: center;
    }
}
</style>

<template>
    <div class="task-one">
        <h2>{{ task?.name }}</h2>
        <div v-if="hasResult">
            <CurveLineChart class="chart" :data="tensorData" />
            <TensorTableView :data="tensorData" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { CurveLineChart, TensorTableView } from "@cmx";
import { useSDM } from "@sdm";

const taskDM = useSDM().TaskDM;
const router = useRouter();

const task = computed(()=>{
    const taskId = router.currentRoute.value.params["taskId"] as string;
    return taskDM.getTask(taskId);
});

const hasResult = computed(()=>{
    return !!task.value?.resData;
});

const tensorData = computed(()=>{
    const emptyTensor = [[],[]];
    return task.value?.makeTensor();
})
</script>