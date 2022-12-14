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
        <p>{{data.actionMessage.value}}</p>
    </div>
    <div class="action-result waiting-bar" v-if="data.isWaiting.value" :class="{paused: !data.isWaiting.value}">请稍候</div>
    

    <div class="footer" v-if="!data.isFinished.value">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">确定</button>
    </div>
    <div class="footer" v-else-if="!data.isWaiting.value">
        <button v-if="data.hasError.value" @click="data.retry()">重试</button>
        <button v-else @click="data.jump(data.taskId.value!)">确定</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { useRouter } from 'vue-router';
import { TAModeBase } from "@ta";
import type { Range } from "@ta";
import { useSDM } from "@sdm";

const props = defineProps<{taskArgs: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-step", step:number, mode:TAModeBase):void,
        (e:"on-can-back", canBack:boolean):void
    }>();

class Summary{
    private _router = useRouter();
    public mode = props.taskArgs;
    public isFinished = ref(false);
    public isWaiting = ref(false);
    public taskId = ref<string|null>(null);
    public hasError = ref(false);
    public actionMessage = ref("");
    private taskDM = useSDM().TaskDM;

    public constructor(){
    }

    public move = (step:number)=>{
        if(step > 0){
            this.isFinished.value = true;
            this.isWaiting.value = true;
            emit("on-can-back", false);

            // 向远程提交任务
            this.taskDM.submitTask(this.mode).then((taskId)=>{
                this.taskId.value = taskId;
                this.actionMessage.value = "创建任务成功!";
                this.isWaiting.value = false;
            }).catch((e)=>{
                this.actionMessage.value = `${e}${e?.cause?(" => " + e.cause):""}`;
                this.hasError.value = true;
                this.isWaiting.value = false;
            });
        }
        else{
            emit("on-step", step, this.mode);
        }
    };

    public resultStyle = computed(()=>({
        success: !this.hasError.value,
        failed: this.hasError.value
    }));

    public jump = (taskId?: string)=>{
        if(!taskId) console.error("taskId不存在");
        this._router.push(`/TaskManager/${taskId}`);
    }

    public retry = ()=>{
        this.isFinished.value = false;
        this.hasError.value = false;
        emit("on-can-back", true);
    };
}

const data = new Summary();
const caption = "摘要";
defineExpose({
    caption
});
</script>