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
    font-size: 0.8rem;
    background-color: theme.$color-bk-2nd;
    // padding: 8px;
    h2{
      font-size: 1.2rem;
      text-align: center;
      margin: 6px 0;
    }
    p{
      text-align: center;
      margin: 4px 0;
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
  }
}
</style>

<template>
    <div class="agg-content">
      <div class="agg-content-box">
        <h2 class="title">数值分布#02171013</h2>
        <p><span class="name">结果数据</span><span class="value">15</span><span class="unit">条</span></p>
        <p><span class="name">指标</span><span class="value">5</span><span class="unit">条</span></p>
        <p>完成时间 <span>2023-02-17 11:02:24</span></p>
      </div>
      <div class="agg-content-box">
        <h2 class="title">数值分布#02171013</h2>
        <p><span class="name">结果数据</span><span class="value">15</span><span class="unit">条</span></p>
        <p><span class="name">指标</span><span class="value">5</span><span class="unit">条</span></p>
        <p>完成时间 <span>2023-02-17 11:02:24</span></p>
      </div>
      <div class="agg-content-box">
        <h2 class="title">数值分布#02171013</h2>
        <p><span class="name">结果数据</span><span class="value">15</span><span class="unit">条</span></p>
        <p><span class="name">指标</span><span class="value">5</span><span class="unit">条</span></p>
        <p>完成时间 <span>2023-02-17 11:02:24</span></p>
      </div>
      <div class="agg-content-box">
        <h2 class="title">数值分布#02171013</h2>
        <p><span class="name">结果数据</span><span class="value">15</span><span class="unit">条</span></p>
        <p><span class="name">指标</span><span class="value">5</span><span class="unit">条</span></p>
        <p>完成时间 <span>2023-02-17 11:02:24</span></p>
      </div>
      <div class="agg-content-box">
        <h2 class="title">数值分布#02171013</h2>
        <p><span class="name">结果数据</span><span class="value">15</span><span class="unit">条</span></p>
        <p><span class="name">指标</span><span class="value">5</span><span class="unit">条</span></p>
        <p>完成时间 <span>2023-02-17 11:02:24</span></p>
      </div>
      <div class="agg-content-box">
        <h2 class="title">数值分布#02171013</h2>
        <p><span class="name">结果数据</span><span class="value">15</span><span class="unit">条</span></p>
        <p><span class="name">指标</span><span class="value">5</span><span class="unit">条</span></p>
        <p>完成时间 <span>2023-02-17 11:02:24</span></p>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue" 
import { useRoute, useRouter } from "vue-router";

const router = useRouter()
const route = useRoute()

</script>

