<template>
    {{ task?.name }}
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { TaskBean } from '@remote';
import { useTaskStore } from "@store";

const store = useTaskStore();
const router = useRouter();

const task = computed(()=>{
    const taskId = router.currentRoute.value.params["taskId"] as string;
    return store.getTask(taskId);
});

</script>