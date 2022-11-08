<style scoped lang="scss">
@use "../theme.scss";
.nav{
    align-self: flex-start;
    margin: 4px;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    li{
        color: theme.$color;
        display: inline;
        flex: 0 0 auto;
        margin: 0 2px;
        text-decoration: underline dashed 1px theme.$color;
        text-underline-offset: 4px;
        cursor: pointer;
        &:hover{
            @include theme.mx-warning;
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
    <BreadCrumb ref="nav" class="bread-crumb" @on-nav="onNav" :disabled="!canNav"/>
    <component ref="activeX" :is="activeType" :task-args="taskArgs" @on-step="onStep" @on-can-back="onCanBack" />
</template>

<script setup lang="ts">
import { ref, shallowRef, nextTick, onMounted, ShallowRef } from "vue";
import BreadCrumb from "../cmx/BreadCrumb.vue";
import { BreadCrumbItem } from "../cmx/BreadCrumb.vue";
import { TAMode, TAModeBase } from "@remote";

import XMode from "./NewAnalyzor/mode.vue";
import XSelect from "./NewAnalyzor/selector.vue";
import XRange from "./NewAnalyzor/range.vue";
import XLimit from "./NewAnalyzor/limit.vue";
import XSummary from "./NewAnalyzor/summary.vue";

// 导航组件
const nav = ref<InstanceType<typeof BreadCrumb>|null>(null);
const canNav = ref(true); // 是否允许面包屑导航

const activeX:ShallowRef<any> = shallowRef(null);
let activeType:ShallowRef<any> = shallowRef(null); // 激活的子界面组件
let taskArgs: ShallowRef<TAModeBase|null> = shallowRef(null);

interface TaskStepType{ [key:string]: Array<any> };

const taskStep = ((step:TaskStepType)=>{
    step[TAMode.Count] =  [ XSelect, XSummary ];
    step[TAMode.SingleDistribution] = [ XSelect, XRange, XLimit, XSummary ];
    step[TAMode.SingleGeo] = [ XSelect, XLimit, XSummary ];
    step[TAMode.MultipleGeo] = [ XSelect, XLimit, XSummary ];
    return step;
})({});


const onNav = (item:BreadCrumbItem, i:number)=>{
    activeType.value = item.data;
};

const onStep = (step:number, data:TAModeBase)=>{
    taskArgs.value = data;
    if(step > 0){
        const nextStep = nav.value!.total - 1;
        const stepNext = findStep(taskStep, data.Mode!, nextStep);
        if(stepNext){
            activeType.value = stepNext;
            pushNavItem();
        }
    }
    else{
        nav.value?.stepBack();
    }
};

const onCanBack = (canBack:boolean)=>{
    canNav.value = canBack;
};

onMounted(()=>{
    activeType.value = XMode;
    pushNavItem();
});

const pushNavItem = ()=>{
    nextTick(()=>{
        const text = ref(activeX.value.caption);
        nav.value?.appendItem({ text, data: activeType.value });
    });
};

const findStep = (taskStep:TaskStepType, mode:TAMode, i:number)=>{
    return taskStep[mode][i];
};
</script>