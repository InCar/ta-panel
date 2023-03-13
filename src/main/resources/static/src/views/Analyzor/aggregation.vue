/*
  page: 计数&极值
*/

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.agg-content{
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  grid-gap: 8px;
  justify-content: center;
  &-box{
    width: 240px;
    border: 1px solid theme.$color;
    font-size: 1rem;
    background-color: theme.$color-bk-2nd;
    &:hover{
      background-color: theme.$color;
      color: theme.$color-bk;
      cursor: pointer;
    }
    // padding: 8px;
    h2{
      font-size: 1.2rem;
      text-align: center;
      margin: 6px 0;
    }
    p{
      margin: 4px 0;
      text-align: center;
      .name{
        font-weight: 600;
      }
      .value{
        font-weight: 600;
        color: theme.$color-em;
        margin-left: 8px;
      }
      .unit{

      }
    }
    p.center-algin{
      display: flex;
      .name{
        width: 50%;
        text-align: right;
      }
      .value{
      }
    }
  }
}
</style>

<template>
    <div v-if="route.name === 'Aggregation'" class="agg-content">
      <div class="agg-content-box" v-for="(x, i) in list" :key="x.id" @click="onClickAnalyzor(x)">
        <h2 class="title">{{ x.name }}</h2>
        <p class="center-algin"><span class="name">结果数据</span><span class="value">{{ dataAmount(x) }}</span><span class="unit">条</span></p>
        <p class="center-algin"><span class="name">指标</span><span class="value">{{fieldCount(x)}}</span><span class="unit">条</span></p>
        <p>完成时间 <span>{{ formatDate(x.finishTime, 'yyyy-MM-dd HH:mm:ss') }}</span></p>
      </div>
    </div>
    <template v-else>
      <router-view />
    </template>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from 'vue'
import { formatDate } from "@/utils/filter/index"
import dataHooks from "./dataHooks";

const router = useRouter()
const route = useRoute()

const  { taskList } = dataHooks()

const list = computed(() => {
  return taskList.filter(item => item.op === 'aggregation')
})

const dataAmount = (task) => {
  return Object.keys(task.resData).length
}
const fieldCount = (task) => {
  return task.paramArgs.fields.length
}

const onClickAnalyzor = (x) => {
  router.push({
    name: 'AnalyzorDetail',
    params: {
      id: x.id
    }
  })
}


</script>
