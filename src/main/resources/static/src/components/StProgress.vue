/**
  定义完成(success)-success 、 运行(running)-default 、中止(disabled)-warning 、失败(fail)-exception 四种状态
*/
<style lang="scss" scoped>
.straight-progress{
}
</style>

<template>
  <div class="straight-progress">
    <el-progress
      :text-inside="textInside"
      :stroke-width="strokeWidth"
      :percentage="percent"
      :status="status ? tastStatus[status] : ''"
    />

  </div>
</template>

<script lang="ts" setup>
import { SourceNode } from "source-map-js/lib/source-node";
import { ref, defineProps, watch, onMounted } from "vue";
const tastStatus = {
    '3': 'success',
    '6': 'warning',
    '5': 'warning',
    '4': 'exception',
    '2': 'default',
}

const props = defineProps({
  textInside: {
    type: Boolean,
    default: true
  },
  percent: {
    type: Number,
    default: 0
  },
  strokeWidth: {
    type: Number,
    default: 14
  },
  status: {
    type: String,
    default: ''
  }
})
const progress = ref(null)
const div = ref(null)

onMounted(
  () => {}
)
</script>
