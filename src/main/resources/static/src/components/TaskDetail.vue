<style lang="scss" scoped>
.task-info{
    font-size: 1rem;
    &-item{
      display: flex;
      height: 24px;
      line-height: 24px;
      .item-title{
        display: inline-block;
      }
      .item-text{
        margin-left: 8px;
        font-weight: 600;
        display: inline-block;
        flex: 1;
        .text-span{
          &:not(:first-child) {
            margin-left: 8px;
          }
        }
        .table-span {
          display: grid;
          flex-direction: row;
          flex-wrap: wrap;
          // justify-content: center;
          grid-template-columns: repeat(auto-fill, 200px);
          flex-wrap: wrap;

          &-grid{
            // text-align: center;
            .grid-title{
              flex: none;
            }
            .grid-text{
              flex: none;
              margin-left: 4px;
            }
            &:not(last-child) {

            }
          }
        }
      }
    }
  }
</style>

<template>
    <div class="task-info">
      <div class="task-info-item">
        <span class="item-tile">任务标识: </span>
        <span class="item-text">{{ data.id }}</span>
      </div>
      <div class="task-info-item">
        <span class="item-tile">执行开始</span>
        <span class="item-text">{{ formatDate(data.startTime, 'yyyy年MM月dd日 HH:mm') || '-' }}</span>
      </div>
      <div class="task-info-item">
        <span class="item-tile">执行完成</span>
        <span class="item-text">{{ formatDate(data.finishTime, 'yyyy年MM月dd日 HH:mm') || '-' }}</span>
      </div>
      <div class="task-info-item">
        <span class="item-tile">执行时长</span>
        <span class="item-text">{{ taskRunningTime }}</span>
      </div>
      <div class="task-info-item">
        <span class="item-tile">运算模式</span>
        <span class="item-text">{{ paramsData.operator?.op }}</span>
      </div>
      <div class="task-info-item">
        <span class="item-tile">聚合函数</span>
        <!-- <span class="item-text">count, min, max</span> -->
        <span v-if="paramsData.operator.opArgs.aggregation?.fn && typeof paramsData.operator.opArgs.aggregation?.fn === 'string' " class="item-text">{{ paramsData.operator.opArgs.aggregation?.fn }}</span>
        <span v-if="paramsData.operator.opArgs.aggregation?.fns" class="item-text">
          <span class="text-span" v-for="(v, k) in paramsData.operator.opArgs.aggregation?.fns" :key="k">{{ v }}</span>
        </span>
        <span v-if="paramsData.operator.opArgs.aggregation?.fn && paramsData.operator.opArgs.aggregation?.fn.length && typeof paramsData.operator.opArgs.aggregation?.fn !== 'string'" class="item-text">
          <span class="text-span" v-for="(v, k) in paramsData.operator.opArgs.aggregation?.fn" :key="k">{{ v }}</span>
        </span>
      </div>
      <div class="task-info-item">
        <span class="item-tile">统计字段</span>
        <!-- <span class="item-text">
          <span>speed 速度</span>
          <span>totalMileage 累计里程</span>
          <span>totalVoltage 总电压</span>
          <span>soc SOC</span>
          <span>dcStatus DC状态</span>
        </span> -->
        <!-- <span v-if="paramsData.operator.opArgs.groupBy" class="item-text" v-for="(v, k) in paramsData.operator.opArgs.groupBy" :key="k">
          <span>{{ v.field }}</span>
        </span> -->
        <span class="item-text">
          <span class="table-span" v-if="paramsData.fields && paramsData.fields.length">
            <span class="table-span-grid" v-for="(v, k) in paramsData.fields" :key="k">
              <span class="grid-title">{{ v.name }}</span>
              <span class="grid-text">{{ v.desc }}</span>
            </span>
          </span>
        </span>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { formatDate } from "@/utils/filter/index"

const props = defineProps({
  data: Object
})

const paramsData =  computed(() => {
  if(props.data.paramJson) {
    return JSON.parse(props.data.paramJson)
  } else {
    return {
      operator: {
        op: '',
        opArgs: {
          aggregation: {
            fn: '',
            fns: []
          }
        }
      },
      fields: []
    }
  }
})

// 计算执行时长
const taskRunningTime = computed(() => {
  // 将毫秒转化为天、时、分
  const formatMicSecondsTime = (msTime) => {
    let time = msTime /1000;
    let day = Math.floor(time /60 /60 /24);
    let hour = Math.floor(time /60 /60) %24;
    let minute = Math.floor(time /60) %60;
    let second = Math.floor(time) %60;
    return `${day}天${hour}时${minute}分${second}秒`
  }
  if(props.data.finishTime && props.data.startTime) {
    const micSeconds = props.data.finishTime - props.data.startTime
    return formatMicSecondsTime(micSeconds)
  } else {
    return '0天0时0分0秒'
  }

})

</script>
