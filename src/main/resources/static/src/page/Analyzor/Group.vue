<style lang="scss">
@use "../../theme.scss";

.analyzor-group{
    padding: 1em;
    display: grid;
    // flex-flow: row wrap;
    grid-gap: 1em;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, 18em);

    .task-item{
        cursor: pointer;

        &:hover{
            color: theme.$color-bk;
            background-color: theme.$color;
        }
    }
}
</style>

<template>
    <div class="analyzor-group">
        <AnalyzorBrief class="task-item" v-for="task in listTasks" :task="task" @click="onClickTask(task)" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSDM } from "@sdm";
import { AnalyzorBrief } from "@components";
import { Task } from "@ta";

const router = useRouter();
const taskGroupDM = useSDM().TaskGroupDM;

const listTasks = computed(()=>{
    const op = router.currentRoute.value.params["group"] as string;
    return taskGroupDM.AnalyzorGroups.value[op];
});

const onClickTask = (task: Task)=>{
    const op = task.paramArgs.operator.op;
    router.push(`/Analyzor/${op}/${task.id}`);
}

</script>