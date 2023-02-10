<style lang="scss">
@use "../theme.scss";

.dropdown-menu{
    cursor: pointer;
    .dropdown-menu-header{
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }
    .dropdown-menu-body{
        position: fixed;
        visibility: collapse;
        z-index: 9999;
        display: flex;
        flex-flow: column nowrap;
        filter: drop-shadow(8px 8px 4px theme.$color);

        &.pop-up{
            visibility: visible;
        }
        &:focus{
            outline: none;
        }
    }
}
</style>

<template>
    <div class="dropdown-menu" :class="{'menu-pop-up': isVisible}">
        <div ref="menuHeader" class="dropdown-menu-header" @click="onClickHeader">
            <slot>下拉菜单</slot>
            <span class="material-symbols-outlined">arrow_drop_down</span>
        </div>
        <div ref="menuBody" class="dropdown-menu-body" :class="{'pop-up': isVisible}" tabindex="-1" @blur="onFocusOut">
            <slot name="menu">
                <span>菜单项</span>
                <span>菜单项</span>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

const menuHeader = ref<HTMLDivElement|null>(null);
const menuBody = ref<HTMLDivElement|null>(null);
const isVisible = ref(false);

const onClickHeader = ()=>{
    if(!isVisible.value){
        const pos = menuHeader.value?.getBoundingClientRect().bottom;
        menuBody.value?.style.setProperty("top", `${pos}px`);
        isVisible.value = true;
        nextTick(()=>{
            menuBody.value?.focus();
        });
        
    }
    else{
        isVisible.value = false;
    }
};

const onFocusOut = (e:FocusEvent)=>{
    isVisible.value = false;
};

const closeMenu = ()=>{
    isVisible.value = false;
};

defineExpose({ closeMenu });
</script>