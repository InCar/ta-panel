<style scoped lang="scss">
@use "../../theme.scss";
@use "./analyzor.scss";

.action-result{
    font-size: large;
    font-weight: bold;
}
.field-header{
    margin: 1em;
}
</style>

<template>
    <div class="field-header">
        <span class="caption">摘要</span>
        <span class="title">{{data.mode.TaskName}}</span>
    </div>

    <div class="field-list">
        <div v-for="(v, k) in data.mode.Fields" class="box-field">
            <span class="field-key">{{k}}</span>
            <span class="field-desc">{{v.desc}}</span>
            <div class="field-range">
                范围: 
                <span v-if="(data.mode.Range[k]as Range).from !== undefined">
                    {{(data.mode.Range[k]as Range).from}} ~ {{(data.mode.Range[k]as Range).to}} [步长: {{(data.mode.Range[k]as Range).step}}]
                </span>
                <span v-else>离散</span>
            </div>
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
import { TAModeBase, TensorAnalyzor } from 'logic';
import type { Range } from 'logic';

const props = defineProps<{taskArgs: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class Summary{
    private _taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
    public mode = props.taskArgs;
    public isFinished = ref(false);
    public result: Ref<{code:number, message: string}> = shallowRef({code:0, message:""});

    public constructor(){
        console.info(this.mode.Range)
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
const caption = "摘要";
defineExpose({
    caption
});
</script>