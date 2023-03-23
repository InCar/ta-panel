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
        max-width: 20em;
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
    <BarChart v-if="dataCount > 0 && dataCount < 4" :data="listData" key="lower" />
    <LineChart v-else-if="fieldName === statisticsType.tm" :data="listDataXYTm" :disableAxis="true" key="tm" />
    <LineChart v-else-if="fieldName === statisticsType.speed" :data="listDataXYTm" :disableAxis="false" key="speed" />
    <LineChart v-else :data="listDataXY" :disableAxis="false" key="more" />
    <div class="args">
      <div class="table-grid">
        <div class="table-grid-item" v-for="(x, i) in listData" :key="i">
          <div class="arg">
            <div class="arg-title">数量</div>
            <div class="arg-value">{{ x.value }}</div>
          </div>
          <div class="arg" v-for="(y, j) in listArgs" :key="j">
            <div class="arg-title">{{y.label}}</div>
            <div class="arg-value">{{x.label}}</div>
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
import { DateTime } from "luxon"
import { getTask } from '@/service/index'
import { xor } from "lodash";

const route = useRoute()

const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
}

const taskResult = reactive({
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

const formatDateT = (value:number, format:string) => {
    if(value && format) {
      const newDate = DateTime.fromMillis(Number.parseFloat(value + '')).toFormat(format)
      return newDate
    } else {
      return value
    }
  }

// 字段类型
const fieldName = computed(() => {
  const resData = isJsonString(taskResult.data.paramJson) ? JSON.parse(taskResult.data.paramJson) : null
  const name = resData?.fields[0].name
  return name
})

const listData = computed( () => {
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
  if(listArgs[0]?.name === 'tm') {
    for(let x in resData) {
      const item = {
        label: formatDateT(Number.parseFloat(x.split('-')[0]), 'yyyyMMdd') + '-' + formatDateT(Number.parseFloat(x.split('-')[1]), 'yyyyMMdd'),
        value: resData[x]
      }
      transData.push(item)
    }
  } else {
    for(let x in resData) {
      const item = {
        label: x,
        value: resData[x]
      }
      transData.push(item)
    }
  }
  const sortData = transData.sort((a, b) => a.label - b.label) // 按照x轴数据排序
  return sortData

  return transData
})

const listArgs = computed(() => {
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
  return listArgs
})

const dataCount = computed(() => {
  const resData = isJsonString(taskResult.data.resJson) ? JSON.parse(taskResult.data.resJson) : {}
  const transData = []
  for(let x in resData) {
    const item = {
      label: x,
      value: resData[x]
    }
    transData.push(item)
  }
  return transData.length
})


const listDataXY = computed(() => {
  const resData = isJsonString(taskResult.data.resJson) ? JSON.parse(taskResult.data.resJson) : {}
  const transData = []
  for(let i in resData) {
    transData.push({
      x: i,
      y: Number.parseFloat(resData[i])
    })
  }
  const sortData = transData.sort((a, b) => a.x - b.x) // 按照x轴数据排序
  return sortData
})

const listDataXYTm = computed(() => {
  const resData = isJsonString(taskResult.data.resJson) ? JSON.parse(taskResult.data.resJson) : {}
  const transData = []
  for(let i in resData) {
    transData.push({
      x: i.split('-')[0]  ? Number.parseFloat(i.split('-')[0]) : Number.parseFloat(i),
      y: Number.parseFloat(resData[i])
    })
  }
  const sortData = transData.sort((a, b) => a.x - b.x) // 按照x轴数据排序
  return sortData
})

// 统计类型
enum statisticsType {
  'tm'='tm', // 
  'speed'='speed', // 速度
  'chargingStatus'='chargingStatus', // 充电状态
  'resistance'='resistance', // 绝缘电阻
  'gearShift'='gearShift', // 挡位
  'vehicleStatus'='vehicleStatus', // 车辆状态
  'pedalStatus'='pedalStatus', // 踏板状态
  'dcStatus'='dcStatus', // dc状态
  'totalCurrent'='totalCurrent', // 总电流
  'totalMileage'='totalMileage', // 累计里程
  'soc'='soc', // SOC
  'driveMode'='driveMode', // 运行模式
  'vehicleType'='vehicleType', // 车辆类型
}

</script>
