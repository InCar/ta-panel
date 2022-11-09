<template>
    <div>
        <span>{{props.task.name}}</span>
    </div>
    
</template>

<script setup lang="ts">
import { TaskBean } from '@remote';

const props = defineProps<{
    task: TaskBean
}>();

</script>