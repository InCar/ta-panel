<!--
* @description  数据帧测
* @fileName  detection
* @author 阿迪
* @date 2023-02-06 09:36:07
* @version V1.0.0
!-->

<template>
  <div class="field-header">
      <span class="caption">{{ data.caption }}</span>
      <span class="title">{{ data.title }}</span>
  </div>
  <div class="field-list">
      <div class="box-field" v-for="(v, k) in data.fields" @click="select(k)">
          <input type="radio" name="field" :value="k" v-model="picked" />
          <!-- <input v-else type="checkbox" name="field" :value="k" v-model="value"/> -->
          <span class="field-description">{{ v.collectionName }}</span>
          <span class="field-description">{{ v.collectionCount }}</span>
          <span class="field-description">{{ v.collectionSize }}MB</span>
          <!-- <span class="field-description mobile-none">描述</span> -->
      </div>
  </div>
  <div class="footer">
    <button @click="prev">上一步</button>
    <button @click="next">下一步</button>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const data = reactive({
      caption: '选择待分析的数据',
      title: '数据侦测',
      fields: [
        {
          collectionName: '',
          collectionCount: '',
          collectionSize: ''
        }
      ]
    })
    const picked = ref(-1)
    const getData = async () => {
      // const res = await fetch('/api/mongo/collections')
      const res = await fetch('/api/mongo/collectionSheetSize')
      // dataSourceFields = res || []
      if(res.ok){
        const tmText = await res.json();
        console.log(tmText, 'tmText')
        data.fields = tmText
      }
    }
    getData()
    const prev = () => {}
    const next = async () => {
      console.log(picked.value, 'picked.value')
      console.log(data.fields, 'data.fields')
      console.log(data.fields[picked.value], 'data.fields[picked.value]')
      console.log(data.fields[picked.value])
      const res = await fetch(`api/mongo/collectionSheetFields?collectionName=${data.fields[picked.value].collectionName}`)
      if(res.ok){
        const tmText = await res.json();
        alert(JSON.stringify(tmText))
      }
    }
    const select = (k: any) => {
      console.log(k)
      picked.value = k
      console.log(picked, 'picked')
    }
    const caption = "选择指标";
    return {
      data,
      picked,
      prev,
      next,
      select,
      caption
    }
  }
})
</script>

<style lang="scss" scoped>
@use "sass:color";
@use "../../theme.scss";
@use "./analyzor.scss";
.box-field{
    &:hover{
        background-color: theme.$color-bk-2nd;
    }
}
.field-description{
  width: 33%;
}
</style>