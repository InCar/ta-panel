<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.container{
  display: grid;
  grid-template-columns: repeat(auto-fill, 12em);
  grid-gap: 8px;
  justify-content: center;
  .box{
    display: flex;
    flex-direction: column;
    width: 12em;
    border: 1px solid theme.$color-2nd;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    &:hover{
      background-color: theme.$color-bk-2nd;
    }
    img{
      width: 10em;
      height: 10em;
      text-align: center;
      vertical-align: center;
      flex: none;
    }
    &-bottom{
      padding: 8px;
      flex: none;
      h2{
        font-size: 1rem;
        text-align: center;
        margin: 0;
        .em{
          color: theme.$color-em;
        }
      }
      p{
        font-size: 1rem;
        margin: 4px 0 0 0;
      }
    }
    &.disabled{
      color: gray;
      background-color: theme.$color-bk;
      cursor: default;
      &:hover{
        background-color: transparent;
      }
      img{
        filter: grayscale(1.0);
      }
      .box-bottom{
        
        h2{
          color: grey !important;
          .em{
            color: theme.$color-em;
          }
        }
        p{
          font-size: 0.8rem;
          margin: 4px 0 0 0;
          color: gray;
        }
      }
    }
  }
}
</style>

<template>
    <div v-if="route.name === 'Analyzor'" class="container">
      <div class="box" :class="{ 'disabled': v.disabled}" v-for="(v, k) in listGroupTitle" :key="k" @click="() => onClickGroup(v.op)">
        <img class="hue-205" src="@/assets/img/ta.png">
        <div class="box-bottom">
          <h2>{{ v.title }}(<span class="em">{{ getMumber(v.op) }}</span>)</h2>
          <p>{{ v.description }}</p>
        </div>
      </div>
    </div>
    <template v-else>
      <router-view />
    </template>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue" 
import { useRoute, useRouter } from "vue-router";
import dataHooks from "./dataHooks";

const listGroupTitle:any = reactive([
    { title: "计数&极值", op:"aggregation", description: "统计数据源中的基本情况,包括数据量、极大极小值", disabled: false},
    { title: "数值分布", op:"group-aggregation", description: "统计某个指标数值的分布区间,哪些区间数据多,哪些区间数据少", disabled: false},
    { title: "充电站分析", description: "根据充电和位置数据分析一个城市中有几个充电站", disabled: true },
    { title: "道路情况评估", description: "根据道路的行车数据分析道路情况", disabled: true },
    { title: "交通信号灯", description: "根据行车数据分析路口的交通信号灯各方向时长间隔", disabled: true },
    { title: "电池健康", description: "长时间的电池充放电数据,测算电池健康度", disabled: true },
    { title: "车型速度/加速度分布", description: "不同车型的特征性能分布差异，掌握用户针对特定车型的使用习惯", disabled: true }
])

const route = useRoute()
const router = useRouter()
const onClickGroup = (op) => {
  if(op === 'aggregation') { // 计数与极值
    router.push({
      name: 'Aggregation'
    })
    // localStorage.setItem('op', op)
  } else if(op === 'group-aggregation') { // 数值分布
    router.push({
      name: 'Group-aggregation'
    })
  }
}

const { taskList } = dataHooks()

// 获取分析类别的数量
const getMumber = (op) => {
  if(!op) {
    return 0
  } else {
    const res = taskList.filter(item => item.op === op)
    return res?.length ?? 0
  }
}

</script>
