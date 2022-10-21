<style scoped lang="scss">
@use "../theme.scss";
@use "./analyzor.scss";

.action-result{
    font-size: large;
    font-weight: bold;

    .success{
        color: theme.$success;
    }

    .failed{
        color: theme.$danger;
    }
}
</style>

<template>
    <span class="caption">全局参数</span>
    <span>{{data.mode.TaskName}}</span>

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
import { TAModeBase } from '../TAModes';

const props = defineProps<{mode: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-ready", title:string):void,
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class Settings{
    public title = "全局参数";
    public mode = props.mode;
    public limitMax = ref(10000);

    public constructor(){
        emit("on-ready", this.title);
    }

    public init = ()=>{
        watchEffect(()=>{
            this.mode.LimitMax = this.limitMax.value;
        });
    };

    public move = (step:number)=>{
        emit("on-step", step, this.mode);
    };
}

const data = new Settings();
onMounted(data.init);
</script>