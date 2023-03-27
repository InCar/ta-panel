<!--
* @description  计数与极值-摘要
* @fileName  summary
* @author 张忠迪
* @date 2023-03-17 10:16:37
!-->

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.box-field {
  &:hover {
    background-color: theme.$color-bk-2nd;
  }
}
.field-desc{
  flex: 0 0 none;
}
.field-description {
  flex: 1 1 auto;
}
.footer {
  text-align: center;
}
</style>

<template>
  <div class="field-header">
    <span class="caption">{{ data.caption }}</span>
    <span class="title">{{ data.title }}</span>
  </div>
  <div class="field-list">
    <div class="box-field" v-for="(v, k) in data.picked" :key="k">
      <span class="field-desc">{{ v.desc }}</span>
      <span class="field-desc mobile-none">{{
        v.name
      }}</span>
      <span class="field-description mobile-none"
        >{{ v.description }}</span
      >
    </div>
  </div>
  <div class="footer">
    <template v-if="!btn.confirmStatus">
      <Button type="primary" @click="prev">上一步</Button>
      <Button type="primary" :loading="btn.loading" @click="confirm"
        >{{ btn.msg }}</Button
      >
    </template>
    <Button v-else type="primary" @click="check"
      >{{ btn.msg }}</Button
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from "vue" 
import { useRoute, useRouter } from "vue-router";
import { useParamsStore } from '@/store/params.store'
import { getFields, startTask } from '../service'
import { ElMessage } from 'element-plus'
import { DateTime } from "luxon";

const route = useRoute()
const tm = DateTime.local().toFormat("MMddHHmm");

const store:any = useParamsStore()
const data = reactive({
  caption: '摘要',
  title: `计数与极值#${tm}`,
  picked: [],
  id: ''
})
if(store.picked && store.picked.length) {
  data.picked = store.picked
  localStorage.setItem('picked', JSON.stringify(store.picked))
} else {
  data.picked = JSON.parse(localStorage.getItem('picked'))
}

const confirm = async () => {
  try {
    btn.loading = true
    const res:any = await getFields()
    const params = {
      dataSources: Object.keys(res.dataSources).map(x => {
        return {
          name:x,
          ds: res.dataSources[x]
        }
      }),
      name: `计数与极值#${tm}`,
      operator: {op:"aggregation",opArgs: {aggregation:{fns:["count","min","max"],fnArgs:{}}}},
      fields: JSON.parse(JSON.stringify(data.picked))
    }
    const result:any = await startTask(params)

    if(result.result) {
      btn.loading = false
      btn.msg = '查看'
      ElMessage({
        message: '创建任务成功',
        type: 'success',
      })
      btn.confirmStatus = true
      data.id = result.data
    } else {
      btn.loading = false
      ElMessage({
        message: result.message || '创建任务失败',
        type: 'error',
      })
      btn.confirmStatus = false
    }
  } catch (err) {
    console.log(err)
    btn.loading = false
  }
  
}

const btn = reactive({
  loading: false,
  msg: '确认',
  confirmStatus: false
})

const router = useRouter()
const check = () => {
  router.push({
    name: 'TaskDetail',
    params: {
      id: data.id
    }
  })
}

const prev = () => {
  router.go(-1);
};

</script>
