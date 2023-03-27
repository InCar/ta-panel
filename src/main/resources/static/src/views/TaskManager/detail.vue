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
      font-size: 1rem;
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
    <div class="btn" v-if="btnText === '取消'">
      <Button type="primary" @click="onClickCancel">{{ btnText }}</Button>
    </div>
    <div class="btn" v-else-if="btnText === '查看结果'">
      <Button type="primary" @click="onClickCheck">{{ btnText }}</Button>
    </div>
    <div class="task">
      <TaskDetail :data="task.data" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, computed } from "vue" 
import { formatDate } from "@/utils/filter/index"
import { getTask, stopTask } from './service'
import { tastStatus } from './Models'
import { ElMessage } from 'element-plus'

const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
}

const route = useRoute()
const router = useRouter()
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
  try{
    task.loading = true
    const { id: id } = route.params
    const res:any = await getTask({id: id})
    task.loading = false
    task.data = res.data[0]
  }catch(err) {
    console.log(err)
    task.loading = false
  }
}

getDetai()

const btnText = computed(() => {
  if(task.data.status === '2') {
    return '取消'
  } else if(task.data.status === '3') {
    return '查看结果'
  } else {
    return ''
  }
})

const onClickCancel = async () => {
  const { id: id } = route.params
  try {
    const res:any = await stopTask({
      ids: id
    })
    if(res.result) {
      ElMessage({
        message: '取消任务成功',
        type: 'success',
      })
      getDetai()
    }
  } catch(err) {
    console.log(err)
  }
}

const onClickCheck = () => {
  router.push({
    path: `/Analyzor/${op.value}/${task.data.id}`
  })
}

const op = computed(() => {
  const params = isJsonString(task.data.paramJson) ? JSON.parse(task.data.paramJson) : {}
  return params.operator.op
})

</script>