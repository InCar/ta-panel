<template>
    <el-button :type="type" :disabled="active">
      <slot></slot>
    </el-button>
</template>

<script lang="ts" setup>
import { ref } from "vue" 
interface Props {
  type?: String,
  active?: Boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: () => 'primary',
  active: () => false
})

</script>

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.el-button{
  height: 28px;
}
.el-button--primary{
  background-color: theme.$color;
  // padding: 8px 6px;
  font-weight: bolder;
  border-radius: 4px;
  border: 1px solid theme.$color;
  font-size: 1rem;
}
button:hover{
  background-color: theme.$color-2nd;
  border: 1px solid theme.$color-2nd;
}
.el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover{
  background-color: #acacac;
  border: 1px solid #acacac;
}
</style>