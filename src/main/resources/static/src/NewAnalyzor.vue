<style scoped lang="scss">
@use "theme.scss";
.nav{
    align-self: flex-start;
    margin: 4px;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    li{
        color: theme.$dark;
        display: inline;
        flex: 0 0 auto;
        margin: 0 2px;
        text-decoration: underline dashed 1px theme.$dark;
        text-underline-offset: 4px;
        cursor: pointer;
        &:hover{
            color: theme.$warning;
        }
        span{
            text-decoration: none;
        }
    }
}
.bread-crumb{
    align-self: stretch;
    min-height: 2em;
}
</style>

<template>
    <BreadCrumb class="bread-crumb" :items="data.listNavItems" @on-nav="data.OnNav"/>
    <component :is="data.activeX.value" @on-mode="data.OnMode" />
</template>

<script setup lang="ts">
import BreadCrumb from "./cmx/BreadCrumb.vue";
import { BreadCrumbItem } from "./cmx/BreadCrumb.vue";
import { TAModeBase } from "./TAModes";
import { shallowRef, shallowReactive } from "vue";

import XMode from "./analyzor/mode.vue";
import XSelect from "./analyzor/selector.vue";

class NewTaskPage{
    public listNavItems:Array<BreadCrumbItem> = shallowReactive([]);
    public activeX = shallowRef({}); // 激活的子界面组件
    public activeMode:TAModeBase|null = null; // 激活的创建模式

    public constructor(){
        const item = { text: "创建新任务", data: XMode };
        this.listNavItems.push(item);
        this.activeX.value = item.data;
    }

    public OnNav = (item:BreadCrumbItem, i:number)=>{
        this.listNavItems.length = i+1;
        this.activeX.value = item.data;
    };

    public OnMode = (mode:TAModeBase)=>{
        const item = { text: mode.Title, data: XSelect };
        this.listNavItems.push(item);
        this.activeX.value = item.data;
        this.activeMode = mode;
    };
}
const data = new NewTaskPage();
</script>