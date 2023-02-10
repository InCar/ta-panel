<style scoped lang="scss">
@use "../../theme.scss";

</style>

<template>
    <BarChart v-if="dataCount>0 && dataCount<4" :data="listData" />
    <CurveLineChart v-else class="chart" :data="listDataXY" :disableAxis="true" />
    <TensorTableView :data="tensorDataTm" :cellWidth="300"/>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { BarChart, CurveLineChart, TensorTableView } from "@components";
import { Task, TensorData } from "@ta";
import { DateTime } from "luxon";

const props = defineProps<{
    task: Task
}>();

const tensorData = computed(()=>{
    return props.task.makeTensor();
});

const tensorDataTm = computed(()=>{
    const tensor = tensorData.value.tensor.map(data=>{
        const tmAtoB = data[0] as string;
        const m = tmAtoB.match(/(\d+)\-(\d+)/);
        if(m?.length === 3){
            const tmA = DateTime.fromMillis(Number(m[1]));
            const tmB = DateTime.fromMillis(Number(m[2]));
            data[0] = `${tmA.toFormat("yyyyMMdd")} - ${tmB.toFormat("yyyyMMdd")}`;
        }
    });

    return tensorData.value;
});

const dataCount = computed(()=>{
    return tensorData.value.tensor.length;
});

const listDataXY = computed(()=>{
    return tensor2XY(tensorData.value);
});

const listData = computed(()=>{
    const fnValue = (v:unknown[], i:number)=>{
        const axis = tensorData.value.dims[i];
        return axis.asNumber ? axis.asNumber(v[i]) : (v[i] as number);
    }

    return tensorData.value.tensor.map(v=>({ label: `${v[0]}`, value: fnValue(v, 1)}));
    
});

const tensor2XY = (data: TensorData)=>{
    const fnValue = (v:unknown[], i:number)=>{
        const axis = data.dims[i];
        return axis.asNumber ? axis.asNumber(v[i]) : (v[i] as number);
    }

    return data.tensor.map(v=>({ x: fnValue(v, 0), y: fnValue(v, 1)}));
    
};
</script>