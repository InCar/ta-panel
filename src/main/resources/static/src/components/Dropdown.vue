<template>
  <div class="dropdown-menu">
    <div ref="menuHeader" class="dropdown-menu-header" @click="onClickHeader">
      <slot name="title">
        <span>下拉菜单</span>
      </slot>
      <i class="material-symbols-outlined">arrow_drop_down</i>
    </div>
    <ul ref="menuList" class="dropdown-menu-body" :class="{'pop-up': visible}" tabindex="-1" @blur="onFocusOut">
      <slot name="menu">
      </slot>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue"
interface Drop {

}
class DropDown implements Drop {

}

const menuHeader = ref<HTMLDivElement>(null)
const menuList = ref<HTMLDivElement>(null)
console.log(menuList, 'menuList')
const visible = ref(false)

const onClickHeader = () => {
  if(!visible.value) {
    const bo = menuHeader.value?.getBoundingClientRect().bottom
    console.log(bo, '----bo')
    // menuList.value?.style.setProperty('top', `${bo}px`)
    visible.value = true
    console.log(menuList.value.style.top, 'menuList.value.style.top')
    nextTick(()=>{
      menuList.value?.focus();
    });
  } else {
    visible.value = false;
  }
}

const onFocusOut = (e) => {
  console.log(e)
  closeMenu()
}

const closeMenu = () => {
  visible.value = false
}


defineExpose({ closeMenu });
</script>

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.dropdown-menu{
  position: relative;
  flex: 1;
  z-index: 1000;
  .dropdown-menu-header{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    cursor: pointer;
  }
  .dropdown-menu-body{
    position: absolute;
    background-color: theme.$color-2nd;
    cursor: pointer;
    box-shadow: 4px 4px 8px theme.$color;
    visibility: collapse;
    &.pop-up{
        visibility: visible;
    }
    &:focus{
        outline: none;
    }
    .down-item{
      display: inline-block;
      height: 28px;
      line-height: 28px;
      padding: 5px 8px;
      color: #333;
      border: 1px dashed theme.$color;
      &:hover{
        background-color: theme.$color-em;
      }
      &:not(:first-child) {
        border-top: none;
      }
      &.selected{
        background-color: theme.$color-em;
      }
    }
  }
}
</style>