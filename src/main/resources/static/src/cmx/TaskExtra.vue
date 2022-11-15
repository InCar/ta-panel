<template>
    <div class="task-extra" v-if="!!task">
            <span>任务标识: {{task.id}}</span>
            <span v-if="!!task.startTime">执行开始: {{task.startTime.toFormat("yyyy年MM月dd日 HH:mm")}}</span>
            <span v-if="!!task.finishTime">执行完成: {{task.finishTime.toFormat("yyyy年MM月dd日 HH:mm")}}</span>
            <span v-if="!!taskDuration">执行时长: {{taskDuration}}</span><br />
            <span>运算模式: {{task.paramArgs.operator.op}}</span>
            <div v-if="!!task.paramArgs.operator.opArgs.aggregation.fns">
                <span>聚合函数: {{task.paramArgs.operator.opArgs.aggregation.fns.join(", ")}}</span>
            </div>
            <div v-if="!!task.paramArgs.operator.opArgs.aggregation.fn">
                <span>聚合函数: {{task.paramArgs.operator.opArgs.aggregation.fn}}</span>
                <template v-for="field in task.paramArgs.operator.opArgs.groupBy">
                    <span style="margin-left:2em;">{{field.field}} : {{field.from}}~{{field.to}} / {{field.step}}</span>
                </template>
            </div>
            <div v-else>
                <span>统计字段</span>
                <span v-for="field in task.paramArgs.fields" style="margin-left:2em">{{field.name}} {{field.desc}}</span>
            </div>
        </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Task } from '@ta';

const props = defineProps<{
    task: Task
}>();

const task = ref(props.task);

const taskDuration = computed(()=>{
    if((!!task.value.startTime) && (!!task.value.finishTime)){
        return task.value.finishTime.diff(task.value.startTime).toFormat("d天h小时m分");
    }

    return null;
});

</script>