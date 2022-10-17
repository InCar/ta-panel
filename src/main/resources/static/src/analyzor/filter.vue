<style scoped lang="scss">
@use "../theme.scss";
@use "./analyzor.scss";
</style>

<template>
    <span class="caption">过滤条件</span>
    <span>{{data.mode.TaskName}}</span>
    <div class="field-list">
        <template v-for="(v, k) in data.mode.Fields">
            <span class="field-key">{{k}}</span>
            <span class="field-desc">{{v.desc}}</span>
            <button class="field-action disabled">设定</button>
        </template>
    </div>
    
    <p>TODO: 设定一些过滤条件</p>

    <div class="footer">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">下一步</button>
    </div>
</template>

<script setup lang="ts">
import { TAModeBase } from '../TAModes';
const props = defineProps<{mode: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-ready", title:string):void,
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class PageFilter{
    public mode = props.mode;

    public constructor(){
        emit("on-ready", "过滤条件");
    }

    public move = (step:number)=>{
        emit("on-step", step, this.mode);
    };
}

const data = new PageFilter();
</script>