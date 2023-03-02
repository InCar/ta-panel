<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.popper{
  position: absolute;
  left: 55px;
  background-color: theme.$color-2nd;
  z-index: 2154;
  font-weight: normal;
  border-radius: 4px;
  font-size: 12px;
  padding: 5px 10px;
  height: 20px;
  line-height: 20px;
  // transform: translate(979px, 663px);
  min-width: 50px;
  width: auto;
  // visibility: hidden;
  display: none;
  color: theme.$color-bk;
  transition: 0.1s 0.2s;
  
  &-arrow{
    position: relative;
    display: inline-block;
    width: 10px;
    height: 10px;
    position: absolute;
    left: -1px;
    top: 9px;
    z-index: -1;
    transform: rotate(45deg);
    background-color: theme.$color-2nd;
  }
}
</style>

<template>
    <div class="popper">
      <slot name="content"></slot>
      <span class="popper-arrow"></span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue" 

</script>
