<style scoped lang="scss">
@use "sass:color";
@use "../theme.scss";
@use "./analyzor.scss";

.popup-dialog{
    &.shown{
        visibility: visible;
    }
    
    .mode-select{
        display: flex;
        &.hidden{
            visibility: hidden;
        }

        .mode-select-item{
            display: flex;
            flex: 1 0 auto;
        }

        .lab{
            width: 6em;
            font-size: 0.8em;
            font-weight: 600;
        }
    }

    button{
        color: color.scale(theme.$success, $lightness:+20%);
        background-color: theme.$dark;
        min-width: 6em;
    }
}
</style>

<template>
    <span class="caption">{{data.title}}</span>
    <span>{{data.mode.TaskName}}</span>
    <div class="field-list">
        <div v-for="(v, k) in data.mode.Fields" class="box-field">
            <span class="field-key">{{k}}</span>
            <span class="field-desc">{{v.desc}}</span>
            <span class="field-range">
                TODO: 设定区间
            </span>
            <button class="field-action" @click="data.ConfigRange(k as string)">设定</button>
        </div>
        <div class="popup-dialog" :class="{shown: data.bShowDialog.value }">
            <div class="dialog">
                <div class="dialog-head">设定区间</div>
                <div class="dialog-body">
                    <div class="mode-select">
                        <span class="lab">模式选择:</span>
                        <div class="mode-select-item">
                            <input type="radio" name="mode" value="0" id="mode0" v-model="data.rangeMode.value"/><label for="mode0">离散值</label>
                        </div>
                        <div class="mode-select-item">
                            <input type="radio" name="mode" value="1" id="mode1" v-model="data.rangeMode.value"/><label for="mode1">连续值</label>
                        </div>
                    </div>
                    <div class="mode-select" :class="{ hidden: data.rangeMode.value==0}">
                        <span class="lab">起始: </span>
                        <input type="input" v-model="data.rangeFrom.value" />
                    </div>
                    <div class="mode-select" :class="{ hidden: data.rangeMode.value==0}">
                        <span class="lab">步长: </span>
                        <input type="input" v-model="data.rangeStep.value" />
                    </div>
                    <div class="mode-select" :class="{ hidden: data.rangeMode.value==0}">
                        <span class="lab">终止: </span>
                        <input type="input" v-model="data.rangeTo.value" />
                    </div>
                </div>
                <div class="dialog-footer">
                    <button @click="data.onDialogCancel">取消</button>
                    <button @click="data.onDialogOK">确定</button>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">下一步</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TAModeBase, Range } from '../TAModes';
const props = defineProps<{mode: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-ready", title:string):void,
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class PageFilter{
    public title = "设定数值区间";
    public mode = props.mode;
    public bShowDialog = ref(false);

    public rangeMode = ref(0);
    public rangeFrom = ref(0);
    public rangeStep = ref(10);
    public rangeTo = ref(100);
    private rangeField = "";


    public constructor(){
        emit("on-ready", this.title);
        this.initRange();
    }

    public move = (step:number)=>{
        emit("on-step", step, this.mode);
    };

    public ConfigRange = (field:string)=>{
        // 初始值
        this.rangeField = field;
        const range:Range = this.mode.Range[field] as Range;
        if(range.from !== undefined){
            this.rangeMode.value = 1;
            this.rangeFrom.value = range.from;
            this.rangeStep.value = range.step;
            this.rangeTo.value = range.to;
        }
        else{
            this.rangeMode.value = 0;
        }


        this.bShowDialog.value = true;
    };

    public onDialogOK = ()=>{
        if(this.rangeMode.value == 0){
            this.mode.Range[this.rangeField] = {};
        }
        else{
            // TODO: 检查是不是数值
            this.mode.Range[this.rangeField] = {
                from: Number(this.rangeFrom.value),
                step: Number(this.rangeStep.value),
                to: Number(this.rangeTo.value)
            }
        }
        this.rangeField = "";
        this.bShowDialog.value = false;
    }

    public onDialogCancel = ()=>{
        this.bShowDialog.value = false;
    }

    private initRange = ()=>{
        for(let k in this.mode.Fields){
            if(!this.mode.Range[k]){
                this.mode.Range[k] = {};
            }
        }
    }

    private isNumber = (str:any)=>{
        return !isNaN(str) && !isNaN(parseFloat(str));
    };
}

const data = new PageFilter();
</script>