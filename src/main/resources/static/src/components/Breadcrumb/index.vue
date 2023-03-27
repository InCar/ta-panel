<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in routers" :key="item.path" @click="onClickBread(item)">
      {{ item?.meta?.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ArrowRight } from '@element-plus/icons-vue'
import { computed } from "vue";
const router = useRouter()
// 当前路由的匹配记录

const routers = computed(()=>{
    // 过滤掉没有meta的 
    return router.currentRoute.value.matched.filter(item=>item.meta.title)
})

// 如果是叶子节点路由，不允许跳转
const onClickBread = (route) => {
  if(route.children && route.children.length) {
    router.push({
      name: route.name
    })
  } else {
    return
  }
}
</script>

<style lang="scss" scoped>
</style>
