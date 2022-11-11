<style scoped lang="scss">
@use "../../theme.scss";
@use "./analyzor.scss";
.field-header{
    margin: 1em;
}
</style>

<template>
    <div class="field-header">
        <span class="caption">全局参数</span>
        <span class="title">{{data.mode.TaskName}}</span>
    </div>

    <div class="field-list">
        <div class="box-field">
            <span class="field-key">数据量限制</span>
            <input class="field-desc" type="number" v-model="data.limitMax.value" />
            <span class="field-description">超过此值限定的数据不会参与分析</span>
        </div>
    </div>    

    <div class="footer">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">下一步</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { TAModeBase } from "@ta";

const props = defineProps<{taskArgs: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-step", step:number, mode:TAModeBase):void,
        (e:"on-can-back", canBack:boolean):void
    }>();

class Settings{
    public title = "全局参数";
    public mode = props.taskArgs;
    public limitMax = ref(-1);

    public constructor(){
    }

    public init = ()=>{
        if(this.mode.LimitMax != null){
            this.limitMax.value = this.mode.LimitMax;
            watchEffect(()=>{
                this.mode.LimitMax = this.limitMax.value;
            });
        }
    };

    public move = (step:number)=>{
        emit("on-step", step, this.mode);
    };
}

const data = new Settings();
onMounted(data.init);
defineExpose({
    caption: data.title
});
</script>