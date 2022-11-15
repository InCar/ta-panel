<style scoped lang="scss">
@use "../../theme.scss";

</style>

<template>
    <CurveLineChart class="chart" :data="listDataXY" />
    <TensorTableView :data="tensorData" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CurveLineChart, TensorTableView } from "@cmx";
import { Task, TensorData } from "@ta";

const props = defineProps<{
    task: Task
}>();

const tensorData = computed(()=>{
    return props.task.makeTensor();
})

const listDataXY = computed(()=>{
    return tensor2XY(tensorData.value);
});

const tensor2XY = (data: TensorData)=>{
    const fnValue = (v:unknown[], i:number)=>{
        const axis = data.dims[i];
        const tensor = data.tensor;
        return axis.asNumber ? axis.asNumber(v[i]) : (v[i] as number);
    }

    return data.tensor.map(v=>({ x: fnValue(v, 0), y: fnValue(v, 1)}));
};
</script>