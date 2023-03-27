<!--
* @description  数值分布
* @fileName  index
* @author 张忠迪
* @date 2023-03-17 16:44:16
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
  <template v-if="route.name === 'Range'">
    <div class="field-header">
      <span class="caption">{{ data.caption }}</span>
      <span class="title">{{ data.title }}</span>
    </div>
    <div class="field-list">
      <div class="box-field" v-for="(v, k) in data.fields" :key="k" @click="select(k)">
        <input type="radio" name="field" :value="k" v-model="picked"/>
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
  title: `数值分布#${tm}`,
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

const picked = ref(-1)
const select = (k: any) => {
  picked.value = k;
  if (picked.value > 0) {
    data.active = true;
  }
};

const router = useRouter()
const prev = () => {
  router.push({
    name: 'NewAnalyzor'
  })
};
const next = () => {
  const values = data.fields.filter((v, k) => picked.value === k)
  const store = useParamsStore()
  store.picked = values
  router.push({
    name: 'RangeSetting'
  })
}


</script>
