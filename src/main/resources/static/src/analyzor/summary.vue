<style scoped lang="scss">
@use "../theme.scss";
@use "./analyzor.scss";
</style>

<template>
    <span class="caption">摘要</span>
    <p v-if="data.isFinished.value" style="color:green">TODO: 任务创建成功</p>
    <p v-else>TODO: 显示任务摘要</p>
    <div class="footer" v-if="!data.isFinished.value">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">确定</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TAModeBase } from '../TAModes';
const props = defineProps<{mode: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-ready", title:string):void,
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class Summary{
    public mode = props.mode;
    public isFinished = ref(false);

    public constructor(){
        emit("on-ready", "摘要");
    }

    public move = (step:number)=>{
        this.isFinished.value = true;
        emit("on-step", step, this.mode);
    };
}

const data = new Summary();
</script>