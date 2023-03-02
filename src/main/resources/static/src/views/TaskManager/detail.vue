<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.content-chart{
  width: 100%;
  height: 60px;
  border: 1px solid theme.$color;
  display: flex;

  &.is-success{
      border: 1px solid theme.$color-bk-success;
  }
  &.is-running{
      border: 1px solid theme.$color-bk-warning;
  }
  &.is-end{
      border: 1px solid theme.$color-bk-disabled;
  }
  &.is-fail{
      border: 1px solid theme.$color-bk-error;
  }

  &:hover {
      background-color: theme.$color-bk-2nd;
  }

  .chart-title{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.8rem;
      width: 6em;
      padding: 0 8px;
      background-color: theme.$color;
      color: theme.$color-bk;
      
      &.is-success{
          background-color: theme.$color-bk-success;
      }
      &.is-running{
          background-color: theme.$color-bk-warning;
      }
      &.is-end{
          background-color: theme.$color-bk-disabled;
      }
      &.is-fail{
          background-color: theme.$color-bk-error;
      }
  }
  .chart-content{
      flex: 1 1 auto;
      display: flex;
      padding: 0 8px;
      .content-left{
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          flex: auto;
          justify-content: center;
          &-status{
              height: 22px;
              line-height: 22px;
              .status-text{
                  font-weight: 600;
                  color: theme.$color-em;
              }
          }
          &-progress{
              height: 22px;
              line-height: 22px;
              .straight-progress{
                  margin-top: 4px;
              }
          }
      }
      .conent-right{
          width: 148px;
          margin-left: 8px;
          font-size: 0.6rem;
          display: flex;
          flex-direction: column;
          flex: none;
          justify-content: center;
          // align-items: center;
          &-createTime{
              height: 22px;
              line-height: 22px;
          }
          &-startTime{
              height: 22px;
              line-height: 22px;
          }
      }
  }
}
.btn{
  margin-top: 1em;
  text-align: center;
}
.task{
  margin-top: 1em;
  &-info{
    font-size: 0.8rem;
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
}
</style>

<template>
    <div v-loading="task.loading">
      <div class="content-chart" :class="{ 'is-success': task.data.status === '3', 'is-end': (task.data.status === '6' || task.data.status === '5'), 'is-fail': task.data.status === '4', 'is-running': task.data.status === '2' }">
        <div class="chart-title" :class="{ 'is-success': task.data.status === '3', 'is-end': (task.data.status === '6' || task.data.status === '5'), 'is-fail': task.data.status === '4', 'is-running': task.data.status === '2'  }">{{ task.data.name }}</div>
        <div class="chart-content">
            <div class="content-left">
                <div class="content-left-status">状态：<span class="status-text">{{ task.data.status ? tastStatus[task.data.status] : '' }}</span></div>
                <div class="content-left-progress">
                    <StProgress :percent="Number.parseFloat(task.data.percent + '')" :status="task.data.status" :strokeWidth="14" />
                </div>
            </div>
            <div class="conent-right mobile-none">
                <div class="conent-right-createTime">
                    <span>创建时间:</span>
                    <span>{{ formatDate(task.data.createTime, 'MM月dd日 HH:mm') || '-' }}</span>
                </div>
                <div class="conent-right-startTime">
                    <span>开始时间:</span>
                    <span>{{ formatDate(task.data.startTime, 'MM月dd日 HH:mm') || '-' }}</span>
                </div>
            </div>
        </div>
    </div>
    <div class="btn" v-if="btnText">
      <Button type="primary">{{ btnText }}</Button>
    </div>
    <div class="task">
      <div class="task-info">
        <div class="task-info-item">
          <span class="item-tile">任务标识: </span>
          <span class="item-text">{{ task.data.id }}</span>
        </div>
        <div class="task-info-item">
          <span class="item-tile">执行开始</span>
          <span class="item-text">{{ formatDate(task.data.startTime, 'yyyy年MM月dd日 HH:mm') || '-' }}</span>
        </div>
        <div class="task-info-item">
          <span class="item-tile">执行完成</span>
          <span class="item-text">{{ formatDate(task.data.finishTime, 'yyyy年MM月dd日 HH:mm') || '-' }}</span>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, computed } from "vue" 
import { formatDate } from "@/utils/filter/index"
import { getTask } from './service'
import { tastStatus } from './Models'

// interface Task {
//   id: string,
//   name: string,
//   createTime: number | string,
//   startTime: number | string,
//   percent: string,
//   paramJson: string,
//   status: string,
//   resJson: string,
//   finishTime: number | string
// }
const route = useRoute()
const task = reactive({
  title: '详情',
  loading: false,
  data: {
    name: '',
    id: '',
    createTime: 1,
    startTime: 1,
    percent: '0',
    paramJson: '',
    status: '',
    resJson: '',
    finishTime: 1
  }
})
const getDetai = async () => {
  task.loading = true
  const { id: id } = route.params
  const res = await getTask({id: id})
  task.loading = false
  task.data = res.data[0]
}

getDetai()

const paramsData =  computed(() => {
  if(task.data.paramJson) {
    return JSON.parse(task.data.paramJson)
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

const btnText = computed(() => {
  if(task.data.status === '2') {
    return '取消'
  } else if(task.data.status === '3') {
    return '查看结果'
  } else {
    return ''
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
  if(task.data.finishTime && task.data.startTime) {
    const micSeconds = task.data.finishTime - task.data.startTime
    return formatMicSecondsTime(micSeconds)
  } else {
    return '0天0时0分0秒'
  }

})

</script>