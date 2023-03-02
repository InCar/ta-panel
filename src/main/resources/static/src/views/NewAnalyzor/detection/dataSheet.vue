<template>
  <template v-if="route.name === 'DataSheet'">
    <div class="field-header">
      <span class="caption">{{ data.caption }}</span>
      <span class="title">{{ data.title }}</span>
    </div>
    <div v-loading="loading" class="field-list">
      <div class="box-field" v-for="(v, k) in data.Sheets" @click="select(k)">
        <input type="radio" name="sheet" :value="k" v-model="picked" />
        <!-- <input v-else type="checkbox" name="field" :value="k" v-model="value"/> -->
        <span class="field-description">{{ v.collectionName }}</span>
        <span class="field-description mobile-none">{{
          v.collectionCount
        }}</span>
        <span class="field-description mobile-none"
          >{{ toFixedTwo(v.collectionSize) }}MB</span
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

<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { collectionSheetSize, collectionSheetFields } from "../service";
import { toFixedTwo } from "@/utils/filter/index";

export default defineComponent({
  name: "App",
  setup() {
    const data = reactive({
      caption: "选择待分析的数据",
      title: "数据侦测",
      Sheets: [
        {
          collectionName: "",
          collectionCount: "",
          collectionSize: "",
        },
      ],
      active: false,
    });
    const router = useRouter();
    const route = useRoute();
    const picked = ref(-1);
    const loading = ref(true)
    const getData = async () => {
      const res = await collectionSheetSize();
      loading.value = false
      data.Sheets = res;
    };
    getData();
    const prev = () => {
      router.go(-1);
    };
    const next = async () => {
      const res = await collectionSheetFields({
        collectionName: data.Sheets[picked.value].collectionName,
      });
      router.push({
        name: "DataField",
        params: {
          id: data.Sheets[picked.value].collectionName,
        },
      });
    };
    const select = (k: any) => {
      picked.value = k;
      if (picked.value > 0) {
        data.active = true;
      }
    };
    return {
      data,
      picked,
      prev,
      next,
      select,
      route,
      toFixedTwo,
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
.footer {
  text-align: center;
}
</style>
