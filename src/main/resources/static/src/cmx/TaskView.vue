<style scoped lang="scss">
@use "../theme.scss";

.container{
    color: theme.$dark;
    border: 1px solid theme.$dark;
    .c2{
        gap: 1em;
    }

    &:hover{
        background-color: theme.$light;
    }

    .em{
        color: theme.$danger;
        font-weight: bold;
    }
}
</style>

<template>
    <div class="container">
        <div class="c2">
            <span>Task#{{index}} {{task.name}}</span>
            <span>STAT:</span><span class="em">{{task.status}}</span>
        </div>
        <div class="c2">
            <span class="em">{{Number(task.percent).toFixed(2)}}%</span>
            <span>创建时间:{{createTime}}</span>
            <span>开始时间:{{startTime}}</span>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import moment from "moment";
import { computed } from '@vue/reactivity';

const props = defineProps(["index", "task"])

const startTime = computed(()=>{
    return moment(props.task.startTime)
        .format("MM月DD日HH:mm");
});

const createTime = computed(()=>{
    return moment(props.task.createTime)
        .format("MM月DD日HH:mm");
});

onMounted(()=>{
    if(props.index == 0){
        console.info(props.task);

        const x = JSON.parse(props.task.paramJson);
        console.info(x);
    }
});
</script>