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

    .task-extra{
        margin: 1em;
        align-self: center;
    }
}
</style>

<template>
    <div class="task-one">
        <h2>{{ task?.name }}</h2>
        <component :is="active" :task="task"/>
        <TaskExtra :task="task" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSDM } from "@sdm";
import { EnumOP } from "@ta";
import TaskGroup from "./TaskGroup.vue";
import TaskGroupAgg from "./TaskGroupAgg.vue";
import { TaskExtra } from "@cmx";

const taskDM = useSDM().TaskDM;
const router = useRouter();

const task = computed(()=>{
    const taskId = router.currentRoute.value.params["taskId"] as string;
    return taskDM.getTask(taskId);
});

const active = computed(()=>{
    if(task.value?.OP == EnumOP["group-aggregation"]){
        return TaskGroupAgg;
    }
    else if(task.value?.OP == EnumOP.aggregation){
        return TaskGroup;
    }
    else{
        return null;
    }
});
</script>