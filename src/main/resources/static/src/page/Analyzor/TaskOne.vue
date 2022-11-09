<style scoped lang="scss">
@use "../../theme.scss";
.task-one{
    width: 100%;
    margin: 0 auto;

    @media(min-width: 1500px){
        width: 70%;
    }

    h2{
        align-self: center;
    }

    .data-table{
        align-self: center;
        display: flex;
        flex-flow: row wrap;
        row-gap: 0.5em;
        margin: 1em;
        
        span{
            text-align: center;
            border: 1px dotted theme.$color;
            padding: 0.25em;
        }
    }
}
</style>

<template>
    <div class="task-one">
        <h2>{{ task?.name }}</h2>
        <div v-if="hasResult">
            <CurveLineChart class="chart" :data="diagramData" />
            <div class="data-table">
                <div><span>Y</span><span>X</span></div>
                <div class="data-xy" v-for="v in diagramData">
                    <span>{{v.y}}</span>
                    <span>{{v.x}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { CurveLineChart } from "@cmx";
import { useTaskStore } from "@store";

const store = useTaskStore();
const router = useRouter();

const task = computed(()=>{
    const taskId = router.currentRoute.value.params["taskId"] as string;
    return store.getTask(taskId);
});

const hasResult = computed(()=>{
    return !!task.value?.resData;
});

const diagramData = computed(
    ()=>Object.keys(task.value?.resData??[])
        .map(k=>({x: Number(k), y: Number(task.value?.resData[k])}))
        .sort((a, b)=>a.x-b.x)
    );

</script>