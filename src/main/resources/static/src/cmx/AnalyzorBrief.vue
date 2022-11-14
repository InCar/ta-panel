<style scoped lang="scss">
@use "../theme.scss";
.brief{
    background-color: theme.$color-bk-2nd;
    padding: 0.75em;
    border: 1px solid theme.$color;
    align-items: center;

    h2{
        margin: 0;
    }

    .items{
        margin: 0.5em;
        display: grid;
        grid-template-columns: auto 1fr 2em;
        span:nth-of-type(3n+1){
            text-align: right;
            margin-right: 0.5em;
            font-weight: bold;
        }
        span:nth-of-type(3n+2){
            margin-left: 1em;
            text-align: right;
        }
        span:nth-of-type(3n){
            margin-left: 0.25em;
        }
    }

    .em{
        color: theme.$color-em;
        font-weight: bold;
    }
    .tm{
        font-size: 0.9em;
    }
}
</style>

<template>
    <div class="brief">
        <h2>{{props.task.name}}</h2>
        <div class="items">
            <span>结果数据</span><span class="em">{{dataAmount}}</span><span>条</span>
            <span>指标</span><span class="em">{{fieldCount}}</span><span>条</span>
        </div>
        <span class="tm">完成时间 {{props.task.finishTime?.toFormat("yyyy-MM-dd HH:mm:ss")}}</span>
    </div>
    
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Task } from '@ta';

const props = defineProps<{
    task: Task
}>();

const dataAmount = computed(()=>Object.keys(props.task.resData).length);
const fieldCount = computed(()=>props.task.paramArgs.fields.length);

</script>