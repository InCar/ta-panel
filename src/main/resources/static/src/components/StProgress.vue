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
    '2': '',
}

interface Props {
  textInside?: Boolean
  percent?: Number
  strokeWidth?: Number
  status?: String
}

// const props = defineProps({
//   textInside: Boolean,
//   percent: Number,
//   strokeWidth: Number,
//   status: String
// })
const props = withDefaults(defineProps<Props>(), {
  textInside: () => true,
  percent: () => 0,
  strokeWidth: () => 14,
  status: () => ''
}) 
const progress = ref(null)
const div = ref(null)

onMounted(
  () => {}
)
</script>
