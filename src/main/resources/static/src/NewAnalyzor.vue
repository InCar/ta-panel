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
    <component :is="data.activeX.value" :mode="data.activeMode" 
        @on-ready="data.OnChildReady"
        @on-step="data.OnStep" />
</template>

<script setup lang="ts">
import BreadCrumb from "./cmx/BreadCrumb.vue";
import { BreadCrumbItem } from "./cmx/BreadCrumb.vue";
import { TAModeBase } from "./TAModes";
import { ref, shallowRef, shallowReactive, nextTick } from "vue";

import XMode from "./analyzor/mode.vue";
import XSelect from "./analyzor/selector.vue";
import XRange from "./analyzor/range.vue";
import XSummary from "./analyzor/summary.vue";

class NewTaskPage{
    public listNavItems:Array<BreadCrumbItem> = shallowReactive([]);
    public activeX = shallowRef({}); // 激活的子界面组件
    public activeMode:TAModeBase|null = null; // 激活的创建模式
    public stepCaption = ref(""); // 用于接收子界面的标题
    public isFinished = ref(false);
    private taskStep:{[key:string]: Array<any>} = {
        "数值分布": [ XSelect, XRange, XSummary ],
        "单值地理分布": [ XSelect, XSummary ],
        "多数值地理分布": [ XSelect, XSummary ]
    }

    public constructor(){
        const item = { text: ref("创建新任务"), data: XMode };
        this.listNavItems.push(item);
        this.activeX.value = item.data;
    }

    public OnNav = (item:BreadCrumbItem, i:number)=>{
        if(!this.isFinished.value){
            this.listNavItems.length = i+1;
            this.activeX.value = item.data;
        }
    };

    public OnStep = (step:number, mode:TAModeBase)=>{
        if(step == -1){
            // move back
            if(this.listNavItems.length <= 1) return;
            const item = this.listNavItems.at(-2);
            this.OnNav(item!, this.listNavItems.length-2);
        }
        else if(step == +1){
            // move next
            this.activeMode = mode;
            const count = this.listNavItems.length;
            const stepNext = this.taskStep[mode.Title][count-1];
            if(stepNext){
                this.activeX.value = stepNext;
                const item = { text: ref(""), data: this.activeX.value};
                this.listNavItems.push(item);
            }
            else{
                // no more step
                this.isFinished.value = true;
            }
        }
    }

    public OnChildReady = (title:string)=>{
        const item = this.listNavItems.at(-1);
        if(item!.text.value.length == 0){
            item!.text.value = title;
        }
    };
}
const data = new NewTaskPage();
</script>