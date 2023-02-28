<script setup lang="ts">
import { ref } from "vue";

defineProps({
  msg: String,
});
const st = ref("123");

const count = ref<number>(0);
let interval: any = null;
const start = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  } else {
    interval = setInterval(() => {
      count.value++;
    }, 1000);
  }
};
</script>

<template>
  <div>{{ count }}</div>
  <el-button type="primary" @click="start">Primary</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
