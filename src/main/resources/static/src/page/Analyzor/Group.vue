<style lang="scss">
@use "../../theme.scss";

.analyzor-group{
    padding: 1em;
    display: flex;
    flex-flow: row wrap;
    gap: 1em;
    justify-content: center;

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
import { useAnalyzorStore } from "@store";
import { AnalyzorBrief } from "@cmx";
import { TaskBean } from "@remote";

const router = useRouter();
const store = useAnalyzorStore();

const listTasks = computed(()=>{
    const op = router.currentRoute.value.params["group"] as string;
    return store.dictAnalyzorGroups[op];
});

const onClickTask = (task: TaskBean)=>{
    const op = task.paramArgs.operator.op;
    router.push(`/Analyzor/${op}/${task.id}`);
}

</script>