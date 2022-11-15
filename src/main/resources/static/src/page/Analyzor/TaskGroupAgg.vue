<style scoped lang="scss">
@use "../../theme.scss";

</style>

<template>
    <div v-if="hasResult">
        <CurveLineChart class="chart" :data="tensorData" />
        <TensorTableView :data="tensorData" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CurveLineChart, TensorTableView } from "@cmx";
import { Task } from "@ta";

const props = defineProps<{
    task: Task
}>();


const hasResult = computed(()=>{
    return !!props.task.resData;
});

const tensorData = computed(()=>{
    const emptyTensor = [[],[]];
    return props.task.makeTensor();
})
</script>