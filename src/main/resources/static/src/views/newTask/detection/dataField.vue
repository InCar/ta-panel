<template>
  <div v-loading="loading" v-if="route.name === 'DataField'">
    <div class="field-header">
      <span class="caption">{{ data.caption }}</span>
      <span class="title">{{ data.title }}</span>
    </div>
    <div class="field-list">
      <div class="box-field" v-for="(v, k) in data.field">
        <span class="field-description">{{ v }}</span>
      </div>
    </div>
    <div class="footer">
      <Button type="primary" @click="prev">上一步</Button>
      <Button type="primary" @click="next">确定</Button>
    </div>
  </div>
  <v-else>
    <router-view />
  </v-else>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { collectionSheetFields } from "../service";

export default defineComponent({
  name: "App",
  setup() {
    const data = reactive({
      caption: "选择待分析的数据",
      title: "摘要",
      field: [],
      active: false
    });
    const loading = ref(true)
    const router = useRouter()
    const route = useRoute();
    console.log(route.params.field, 'route.params.field')
    console.log(route.name)
    const picked = ref(-1);
    const getData = async () => {
      const res = await collectionSheetFields({
        collectionName: route.params.id,
      });
      loading.value = false
      data.field = res;
    };
    getData();
    const prev = () => {
        router.go(-1)
    };
    const next = async () => {
    };
    const select = (k: any) => {
      console.log(k);
      picked.value = k;
      console.log(picked, "picked");
      if(picked.value > 0) {
        data.active = true
      }
    };
    const caption = "选择指标";
    return {
      data,
      picked,
      prev,
      next,
      select,
      caption,
      route,
      loading
    };
  },
});
</script>

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.box-field {
  &:hover {
    background-color: theme.$color-bk-2nd;
  }
}
.field-description {
  width: 33%;
}
.footer{
  text-align: center;
}
</style>
