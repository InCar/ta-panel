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
    <span class="caption">选择待分析的数据</span>
    <span>{{data.mode.TaskName}}</span>
    <div class="field-list">
        <div class="box-field" v-for="(v, k) in data.jsonFields" @click="data.select(k as string)">
            <input v-if="data.isRadio" type="radio" name="field" :value="k" v-model="data.picked.value" />
            <input v-else type="checkbox" name="field" :value="k" v-model="data.listPicked.value"/>
            <span class="field-desc">{{v.desc??k}}</span>
            <span class="field-key">{{k}}</span>
            <span class="field-description">{{v.description}}</span>
        </div>
    </div>
    <div class="footer">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)" :class="{disabled: !data.canNext.value }">下一步</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref, shallowReactive, onMounted, inject, Ref } from 'vue';
import { TAMode, TAModeBase, TAModeSingleDistribution, TensorAnalyzor, TJsonFields } from 'logic';

const props = defineProps<{mode: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-ready", title:string):void,
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class PageSelectFields{
    public mode = props.mode;
    public isRadio = true;
    public jsonFields: TJsonFields = shallowReactive({});
    public picked: Ref<string> = ref("");
    public listPicked:Ref<string[]> = ref([]);

    public init = async () => {
        emit("on-ready", "选择指标");
        // radio or checkbox
        switch(this.mode.Mode){
            case TAMode.MultipleGeo:
                this.isRadio = false;
                break;
            default:
                this.isRadio = true;
        }
        // reset picked fields
        this.initPicked();

        // loading fields
        const taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
        const jsonFields = await taObj.fetchJsonFields();
        Object.assign(this.jsonFields, jsonFields);
    };

    public move = (step:number)=>{
        if(step > 0){
            if(!this.canNext.value) return;
            if(this.mode.Mode == TAMode.SingleDistribution){
                const k = this.picked.value;
                const target:any = {};
                target[k] = this.jsonFields[k];
                this.mode.Fields = target;
            }
            else{
                console.error(`尚未实现:${this.mode.Title}`);
                return;
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
            console.error(`尚未实现:${this.mode.Title}`);
            return;
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
</script>