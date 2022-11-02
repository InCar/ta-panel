<style scoped lang="scss">
@use "../../theme.scss";
@use "./analyzor.scss";

.field-header{
    margin: 1em;
}

.field-list{
    &.finished{
        flex: 0 0 auto;
    }
}

.action-result{
    font-size: large;
    font-weight: bold;
    align-items: center;
    margin: 1em;
    p{
        margin: 1em;
    }
    &.success{
        @include theme.mx-success;
    }
    &.failed{
        @include theme.mx-error;
    }
    
}
</style>

<template>
    <div class="field-header">
        <span class="caption">摘要</span>
        <span class="title">{{data.mode.TaskName}}</span>
    </div>

    <div class="field-list" :class="{finished:data.isFinished.value}">
        <div v-for="(v, k) in data.mode.Fields" class="box-field">
            <span class="field-key">{{k}}</span>
            <span class="field-desc">{{v.desc}}</span>
            <div class="field-range" v-if="data.mode.Range[k]">
                范围: 
                <span v-if="(data.mode.Range[k]as Range).from !== undefined">
                    {{(data.mode.Range[k]as Range).from}} ~ {{(data.mode.Range[k]as Range).to}} [步长: {{(data.mode.Range[k]as Range).step}}]
                </span>
                <span v-else>离散</span>
            </div>
        </div>
    </div>

    <div class="action-result" v-if="data.isFinished.value && !data.isWaiting.value" :class="data.resultStyle.value">
        <p>{{data.result.value.message}}</p>
    </div>
    <div class="action-result waiting-bar" v-if="data.isWaiting.value" :class="{paused: !data.isWaiting.value}">请稍候</div>
    

    <div class="footer" v-if="!data.isFinished.value">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">确定</button>
    </div>
    <div class="footer" v-else-if="!data.isWaiting.value">
        <button v-if="data.result.value.code<0" @click="data.retry()">重试</button>
        <button v-else @click="data.jump(data.result.value.taskId)">确定</button>
    </div>
</template>

<script setup lang="ts">
import { inject, ref , Ref, shallowRef } from 'vue';
import { computed } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { TAModeBase, TensorAnalyzor } from "@logic";
import type { Range } from "@logic";

const props = defineProps<{taskArgs: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-step", step:number, mode:TAModeBase):void,
        (e:"on-can-back", canBack:boolean):void
    }>();

class Summary{
    private _taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
    private _router = useRouter();
    public mode = props.taskArgs;
    public isFinished = ref(false);
    public isWaiting = ref(false);
    public result: Ref<{code:number, message: string, taskId?:string }> = shallowRef({code:0, message:""});

    public constructor(){
    }

    public move = (step:number)=>{
        if(step > 0){
            this.isFinished.value = true;
            this.isWaiting.value = true;
            emit("on-can-back", false);

            // 向远程提交任务
            this._taObj.submitTask(this.mode).then((result)=>{
                this.result.value = result;
                this.isWaiting.value = false;
            });
        }
        else{
            emit("on-step", step, this.mode);
        }
    };

    public resultStyle = computed(()=>({
        success: this.result.value.code >=0,
        failed: this.result.value.code < 0
    }));

    public jump = (taskId?: string)=>{
        if(!taskId) console.error("taskId不存在");
        this._router.push(`/TaskManager/${taskId}`);
    }

    public retry = ()=>{
        this.isFinished.value = false;
        this.result.value = { code: 0, message: "" };
        emit("on-can-back", true);
    };
}

const data = new Summary();
const caption = "摘要";
defineExpose({
    caption
});
</script>