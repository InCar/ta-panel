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
    <span class="caption">摘要</span>
    <span>{{data.mode.TaskName}}</span>

    <div class="field-list">
        <div v-for="(v, k) in data.mode.Fields" class="box-field">
            <span class="field-key">{{k}}</span>
            <span class="field-desc">{{v.desc}}</span>
            <span class="field-range">无过滤条件</span>
        </div>
    </div>

    <div class="action-result" v-if="data.isFinished.value">
        <p :class="data.resultStyle.value">{{data.result.value.message}}</p>
    </div>
    

    <div class="footer" v-if="!data.isFinished.value">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">确定</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { inject, ref , Ref, shallowRef } from 'vue';
import { TAModeBase } from '../TAModes';
import { TensorAnalyzor } from '../TensorAnalyzor';

const props = defineProps<{mode: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-ready", title:string):void,
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class Summary{
    private _taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
    public mode = props.mode;
    public isFinished = ref(false);
    public result: Ref<{code:number, message: string}> = shallowRef({code:0, message:""});

    public constructor(){
        emit("on-ready", "摘要");
    }

    public move = (step:number)=>{
        if(step > 0){
            this.isFinished.value = true;

            // 向远程提交任务
            this._taObj.submitTask(this.mode).then((result)=>{
                this.result.value = result;
            });
        }

        emit("on-step", step, this.mode);
    };

    public resultStyle = computed(()=>({
        success: this.result.value.code >=0,
        failed: this.result.value.code < 0
    }));
}

const data = new Summary();
</script>