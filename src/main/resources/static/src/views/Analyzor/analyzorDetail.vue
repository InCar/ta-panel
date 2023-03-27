<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.task-detail{
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  @media(min-width: 1160px){ // 定义输出设备中的页面最小可见区域宽度
      width: 1000px;
  }
  .detail-title{
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }
  .args{
    padding: 10px;
    .table-grid{
      display: flex;
      flex-wrap: wrap;
      .table-grid-item{
        flex: 1 1 auto;
        .title{
          text-align: center;
          border: 1px solid theme.$color;
          margin: -1px 0 0 -1px;
          padding: 0.5em;
          font-weight: 600;
        }
        .arg{
          display: flex;
          justify-content: center;
          .arg-title{
            width: 90px;
            border: 1px solid theme.$color;
            margin: -1px 0 0 -1px;
            text-align: center;
            font-weight: 600;
            padding: 0.5em;
          }
          .arg-value{
            flex: 1 1 auto;
            border: 1px solid theme.$color;
            margin: -1px 0 0 -1px;
            text-align: right;
            padding: 0.5em;
          }
        }
      }
    }
  }
  .task{
    margin-top: 20px;
  }
}

</style>

<template>
  <div class="task-detail" v-loading="taskResult.loading">
    <div class="detail-title">{{ taskResult.data.name }}</div>
    <BarChart :data="listData" />
    <div class="args">
      <div class="table-grid">
        <div class="table-grid-item" v-for="(x, i) in listData">
          <div class="title">{{ x.label }}</div>
          <div class="arg">
            <div class="arg-title">count</div>
            <div class="arg-value">{{ x.value }}</div>
          </div>
          <div class="arg">
            <div class="arg-title">max</div>
            <div class="arg-value">{{x.max }}</div>
          </div>
          <div class="arg">
            <div class="arg-title">min</div>
            <div class="arg-value">{{ x.min }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="task">
      <TaskDetail :data="taskResult.data" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue" 
import { useRoute } from "vue-router";
import { getTask } from '@/service/index'

const route = useRoute()

let taskResult = reactive({
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

const getTaskById = async () => {
  try {
    taskResult.loading = true
    const res:any = await getTask({id: route.params.id}) 
    taskResult.data = res.data[0]
    taskResult.loading = false
  } catch(err) {
    taskResult.loading = false
    console.log(err)
  }
}

getTaskById()

const listData = computed( () => {
  function isJsonString(str) {
    try {
      if (typeof JSON.parse(str) == "object") {
        return true;
      }
    } catch (e) {}
    return false;
  }
  const resData = isJsonString(taskResult.data.resJson) ? JSON.parse(taskResult.data.resJson) : {}
  
  let listArgs = []
  const isJson = isJsonString(taskResult.data.paramJson)
  if(isJson) {
    listArgs = JSON.parse(taskResult.data.paramJson)?.fields.map(item => {
      return {
        label: item.desc,
        name: item.name
      }
    })
  } else {
    listArgs = []
  }
 
  const transData = []
  for(let x in resData) {
    const item = {
      name: '',
      value: '0',
      min: '0',
      max: '0'
    }
    if (x.indexOf('count') > 0) {
      item.name = x.split(',')[0]
      item.value = resData[x]
      const minkey = `${item.name},min`
      const maxkey = `${item.name},max`
      item.min = resData[minkey]
      item.max = resData[maxkey]
    }
    transData.push(item)
  }


  const data =  []
  transData.filter(e => e.name).forEach(item => {
    for(let i=0;i < listArgs.length;i++) {
      if(item.name === listArgs[i].name) {
        data.push({
          label: listArgs[i].label,
          value: item.value,
          min: item.min,
          max: item.max
        }) 
      }
    }
  })
  return data
})

const listArgs = computed(() => {
  return JSON.parse(taskResult.data.paramJson).fields
})

</script>
