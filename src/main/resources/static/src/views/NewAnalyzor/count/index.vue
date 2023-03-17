<!--
* @description  计数和极值
* @fileName  index
* @author 张忠迪
* @date 2023-03-16 15:09:05
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
  <template v-if="route.name === 'Count'">
    <div class="field-header">
      <span class="caption">{{ data.caption }}</span>
      <span class="title">{{ data.title }}</span>
    </div>
    <div class="field-list">
      <div class="box-field" v-for="(v, k) in data.fields" :key="k" @click="select(k)">
        <input type="checkbox" name="field" :value="k" v-model="picked.keys"/>
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
      <Button type="primary" @click="prev">上一步</Button>
      <Button type="primary" :active="!data.active" @click="next"
        >下一步</Button
      >
    </div>
  </template>
  <template v-else>
    <router-view />
  </template>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue" 
import { useRoute, useRouter } from "vue-router";
import { getFields } from "../service";
import { useParamsStore } from '@/store/params.store'
import { DateTime } from "luxon";
const route = useRoute()
const tm = DateTime.local().toFormat("MMddHHmm");
const data = reactive({
  caption: "选择待分析的数据",
  title: `计数与极值#${tm}`,
  fields: [
    {
      name: 'chargingStatus',
      desc: '充电状态',
      description: '1停车充电、2行驶充电、3未充电、4充电完成、0xFE异常、0xFF无效'
    }
  ],
  active: false
})
const getData = async() => {
  const res = await getFields()
  console.log(res)
  const { fields } = res
  data.fields = Object.keys(fields).map(x => {
    return {
      name: x,
      desc: fields[x].desc,
      description: fields[x].description,
      data: fields[x].data
    }
  })
}
getData()

const picked = reactive({
  keys: [],
  values: []
});
const select = (k: any) => {
  if(picked.keys.indexOf(k) === -1) {
    picked.keys.push(k)
  } else {
    const index = picked.keys.indexOf(k)
    picked.keys.splice(index, index+1)
  }
  if(picked.keys && picked.keys.length) data.active = true
  else data.active = false
};

const router = useRouter()
const prev = () => {
  router.push({
    name: 'NewAnalyzor'
  })
};
const next = () => {
  const values = data.fields.filter((v, k) => picked.keys.includes(k))
  const store = useParamsStore()
  store.picked = values
  router.push({
    name: 'Summary'
  })
}


</script>
