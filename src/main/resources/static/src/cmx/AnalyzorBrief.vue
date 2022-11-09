<style scoped lang="scss">
@use "../theme.scss";
.brief{
    padding: 1em;
    border: 1px solid theme.$color;
    align-items: center;

    .tm{
        font-size: small;
    }
}
</style>

<template>
    <div class="brief">
        <span>{{props.task.name}}</span>
        <span class="tm">{{props.task.finishTime?.toFormat("yyyy-MM-dd HH:mm:ss")}}</span>
    </div>
    
</template>

<script setup lang="ts">
import { TaskBean } from '@remote';

const props = defineProps<{
    task: TaskBean
}>();


// console.info(props.task)

</script>