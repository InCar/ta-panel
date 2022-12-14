<style scoped lang="scss">
@use "sass:color";
@use "../../theme.scss";
@use "./analyzor.scss";

.box-field{
    &:hover{
        background-color: theme.$color-bk-2nd;
    }
}
</style>

<template>
    <div class="field-header">
        <span class="caption">选择待分析的数据</span>
        <span class="title">{{data.mode.TaskName}}</span>
    </div>
    <div class="action-result failed" v-if="data.errorMessage.value.length>0">{{data.errorMessage.value}}</div>
    <div class="field-list">
        <div class="box-field" v-for="(v, k) in dataSourceFields" @click="data.select(k as string)">
            <input v-if="data.isRadio" type="radio" name="field" :value="k" v-model="data.picked.value" />
            <input v-else type="checkbox" name="field" :value="k" v-model="data.listPicked.value"/>
            <span class="field-desc">{{v.desc??k}}</span>
            <span class="field-key">{{k}}</span>
            <span class="field-description mobile-none">{{v.description}}</span>
        </div>
    </div>
    <div class="footer">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)" :class="{disabled: !data.canNext.value }">下一步</button>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, Ref } from 'vue';
import { TAMode, TAModeBase, TDataFields } from "@ta";
import { useSDM } from '@sdm';

const props = defineProps<{taskArgs: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-step", step:number, mode:TAModeBase):void,
        (e:"on-can-back", canBack:boolean):void
    }>();

const dataSourceDM = useSDM().DataSourceDM;
const dataSourceFields:TDataFields = dataSourceDM.DataFields;

class PageSelectFields{
    public mode = props.taskArgs;
    public isRadio = true;
    public picked: Ref<string> = ref("");
    public listPicked:Ref<string[]> = ref([]);
    public errorMessage = ref("");

    public init = async () => {
        // radio or checkbox
        switch(this.mode.Mode){
            case TAMode.Count:
            case TAMode.MultipleGeo:
                this.isRadio = false;
                break;
            default:
                this.isRadio = true;
        }
        // reset picked fields
        this.initPicked();

        // loading fields
        try{
            await dataSourceDM.fetch();
        }
        catch(ex: unknown){
            const e = ex as Error;
            this.errorMessage.value = `${e} ${e.cause?e.cause:""}`;
        }
    };

    public move = (step:number)=>{
        if(step > 0){
            if(!this.canNext.value) return;
            if(this.isRadio){
                const k = this.picked.value;
                const target:any = {};
                target[k] = dataSourceFields[k];
                this.mode.Fields = target;
            }
            else{
                const target:any = {};
                for(let k of this.listPicked.value){
                    target[k] = dataSourceFields[k];
                }
                this.mode.Fields = target;
            }
        }
        
        emit("on-step", step, this.mode);
    }

    public canNext = computed(()=>{
        return (this.picked.value.length > 0)||(this.listPicked.value.length > 0);
    });

    private initPicked = ()=>{
        if(this.mode.Mode == TAMode.SingleDistribution){
            const keys = Object.keys(this.mode.Fields);
            if(keys.length > 0){
                this.picked.value = keys[0];
            }
        }
        else{
            const selectedFields = Object.keys(this.mode.Fields);
            this.listPicked.value.push(...selectedFields);
        }
    };

    public select = (k:string)=>{
        if(this.isRadio){
            this.picked.value = k;
        }
        else{
            const found = this.listPicked.value.indexOf(k);
            if(found < 0) this.listPicked.value.push(k);
            else this.listPicked.value.splice(found, 1);
        }
    };
};

const data = new PageSelectFields();
onMounted(data.init);

const caption = "选择指标";
defineExpose({
    caption
});
</script>