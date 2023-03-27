<!--
* @description  数值分布-全局参数
* @fileName  gobalArgument
* @author userName
* @date 2023-03-17 17:54:29
!-->

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
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
    <template v-if="route.name === 'GobalArgument'">
        <div class="field-header">
        <span class="caption">{{ data.caption }}</span>
        <span class="title">{{ data.title }}</span>
        </div>
        <div class="field-list">
            <div class="box-field">
                <span class="field-key">数据量限制</span>
                <input class="field-desc" type="number" v-model="data.limitMax" />
                <span class="field-description">超过此值限定的数据不会参与分析</span>
            </div>
        </div>
        <div class="footer">
            <Button type="primary" @click="prev">上一步</Button>
            <Button type="primary" @click="next">下一步</Button>
        </div>
    </template>
    <template v-else>
        <router-view />
    </template>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from "vue" 
import { DateTime } from "luxon";
import { useRoute, useRouter } from "vue-router";
import { useParamsStore } from '@/store/params.store'
const route = useRoute()

const tm = DateTime.local().toFormat("MMddHHmm");
const data = reactive({
    caption: '全局参数',
    title: `数值分布#${tm}`,
    limitMax: 10000,
    fields: []
})
const store = useParamsStore()

const router = useRouter()
const prev = () => {
  router.go(-1);
};
const next = () => {
    router.push({
        name: 'RangeSummary'
    })
}

watch(() => data.limitMax, (newValue) => {
    store.limit = newValue
},{
    immediate: true
})
</script>


