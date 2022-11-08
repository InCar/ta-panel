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
        min-height: 1.5em;
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
    .progress{
        flex: 1 0 auto;
        position: relative;
        border: 1px dotted theme.$color;
        .progress-bar{
            position: absolute;
            width: 100%;
            height: 100%;
            font-weight: bold;
            transform-origin: top left;
        }
        .text{
            position: absolute;
            text-align: right;
            
            color: white;
            mix-blend-mode:exclusion;
            // background-blend-mode: screen;
        }
    }

    .em2{
        color: theme.$color-em;
        font-weight: bold;
        padding: 2px;
    }

    .btn{
        padding: 0.125em 1em;
        
    }
        

    .success{
        @include theme.mx-success;
    }
    .warning{
        @include theme.mx-warning;
    }
    .error{
        @include theme.mx-error;
    }
    .disabled{
        @include theme.mx-disabled;
    }
    
}
</style>

<template>
    <div class="container-task">
        <span class="title" :class="statusColor">{{task.name}}</span>
        <div class="c2-row">
            <div class="c3-line">
                <div class="c4-stat">
                    <span>状态:</span>
                    <span class="em2">{{statusText}} </span>
                </div>
                <span class="mobile-none">创建时间:{{createTime}}</span>
            </div>
            <div class="c3-line">
                <div class="progress">
                    <div ref="progressBar" class="progress-bar" :class="statusColor"></div>
                    <span ref="progressText" class="text">{{Number(task.percent).toFixed(2)}}%</span>
                </div>
                <span class="mobile-none">开始时间:{{startTime}}</span>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import moment from "moment";
import { onMounted, ref } from "vue";
import { computed } from '@vue/reactivity';
import { TaskBean, TaskStatus } from "@remote";

const props = defineProps<{
    index?: Number,
    task: TaskBean
}>();

const statusText = computed(()=>{
    let text;
    switch(props.task.status){
        case TaskStatus.Pending:    text="等待"; break;
        case TaskStatus.Running:    text="运行"; break;
        case TaskStatus.Succeeded:  text="完成"; break;
        case TaskStatus.Failed:     text="失败"; break;
        case TaskStatus.Canceled:   text="取消"; break;
        case TaskStatus.Terminated: text="中止"; break;
        default:
            text = "无效";
    }
    return text;
});

const statusColor = computed(()=>{
    let text;
    switch(props.task.status){
        case TaskStatus.Pending:    text="pending"; break;
        case TaskStatus.Running:    text="warning"; break;
        case TaskStatus.Succeeded:  text="success"; break;
        case TaskStatus.Failed:     text="error"; break;
        case TaskStatus.Canceled:   text="disabled"; break;
        case TaskStatus.Terminated: text="disabled"; break;
        default:
            text = "";
    }
    return text;
});

const startTime = computed(()=>{
    return moment(props.task.startTime)
        .format("MM月DD日HH:mm");
});

const createTime = computed(()=>{
    return moment(props.task.createTime)
        .format("MM月DD日HH:mm");
});

const progressBar = ref<HTMLDivElement|null>(null);
const progressText = ref<HTMLSpanElement|null>(null);

let i = 10;
onMounted(()=>{
    const ratio = Number(props.task.percent)??100.0;
    if(ratio > 0){
        progressBar.value?.style.setProperty("width", `${ratio}%`);
        progressText.value?.style.setProperty("width", `${0.95*ratio}%`);
    }
});
</script>