<style scoped lang="scss">
@import "theme.scss";
.nav{
    align-self: flex-start;
    margin: 4px;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    li{
        color: $dark;
        display: inline;
        flex: 0 0 auto;
        margin: 0 2px;
        text-decoration: underline dashed 1px $dark;
        text-underline-offset: 4px;
        cursor: pointer;
        &:hover{
            color: $warning;
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
    <component :is="data.activeX.value" @on-mode-vvv="data.OnModet" />
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
    public listActiveX:Array<any> = [];
    public activeX:any = shallowRef(XMode);

    public constructor(){
        this.listNavItems.push({ text: "创建新任务" });
        this.listActiveX.push(this.activeX.value);
    }

    public OnNav = (item:BreadCrumbItem, i:number)=>{
        this.listNavItems.length = i+1;
        this.listActiveX.length = i+1;
        this.activeX.value = this.listActiveX[i];
    };

    public OnModet = (mode:TAModeBase)=>{
        this.listNavItems.push({ text: mode.Title, data: mode});
        this.listActiveX.push(XSelect);
        this.activeX.value = XSelect;
    };
}
const data = new NewTaskPage();
</script>