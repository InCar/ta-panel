<style scoped lang="scss">
@use "../theme.scss";

.container-task{
    color: theme.$color;
    border: 1px solid theme.$color;
    flex-flow: row nowrap;

    .c2-row{
        flex-flow: column wrap;
        flex: 1 0 auto;
        padding: 4px;
    }
    
    .c3-line{
        flex-flow: row wrap;
        gap: 1em;
        justify-content: space-between;
    }
    .c4-stat{
        flex-flow: row nowrap;
        align-items: center;
    }
    &:hover{
        background-color: theme.$color-bk-2nd;
    }
    .title{
        color: theme.$color-bk;
        background-color: theme.$color;
        padding: 0 1em;
        max-width: 5em;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .em{
        @include theme.mx-warning;
        font-weight: bold;
        flex: 1 0 auto;
        padding: 0 0.5em;
        text-align: center;
    }

    .em2{
        color: theme.$color-em;
        font-weight: bold;
        padding: 2px;
    }
}
</style>

<template>
    <div class="container-task">
        <span class="title">{{task.name}}</span>
        <div class="c2-row">
            <div class="c3-line">
                <div class="c4-stat">
                    <span>STAT:</span>
                    <span class="em2">{{task.status}} </span>
                </div>
                <span class="mobile-none">创建时间:{{createTime}}</span>
            </div>
            <div class="c3-line">
                <span class="em">{{Number(task.percent).toFixed(2)}}%</span>
                <span class="mobile-none">开始时间:{{startTime}}</span>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import moment from "moment";
import { computed } from '@vue/reactivity';
import type { TaskBean } from 'logic';

const props = defineProps<{
    index?: Number,
    task: TaskBean
}>();

const startTime = computed(()=>{
    return moment(props.task.startTime)
        .format("MM月DD日HH:mm");
});

const createTime = computed(()=>{
    return moment(props.task.createTime)
        .format("MM月DD日HH:mm");
});
</script>