<style scoped lang="scss">
@use "../theme.scss";
@use "./analyzor.scss";

.box-field{
    display: flex;
    padding: 0 1em;
    border-bottom: 1px solid theme.$light;
    align-self: stretch;
    @mixin field-gap{
        padding: 4px 8px;
    }
    .desc{
        flex: 0 0 8em;
        @include field-gap;
    }
    .key{
        flex: 0 0 10em;
        @include field-gap;
        font-weight: bold;
    }
    .description{
        flex: 1 0 auto;
        @include field-gap;
    }
}
</style>

<template>
    <span class="caption">选择待分析的数据</span>
    <div class="box-field" v-for="(v, k) in data.jsonFields">
        <input :type="data.isRadio?'radio':'checkbox'" name="field" :value="k" v-model="data.picked.value"/>
        <span class="desc">{{v.desc??k}}</span>
        <span class="key">{{k}}</span>
        <span class="description">{{v.description}}</span>
    </div>
    <div class="footer">
        <button @click="data.move(-1)">上一步</button>
        <button @click="data.move(+1)">下一步</button>
    </div>
</template>

<script setup lang="ts">
import { ref, shallowReactive, onMounted, inject } from 'vue';
import { TAMode, TAModeBase, TAModeSingleDistribution } from '../TAModes';
import { TensorAnalyzor, TJsonFields } from '../TensorAnalyzor';

const props = defineProps<{mode: TAModeBase}>();
const emit = defineEmits<{
        (e:"on-ready", title:string):void,
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class PageSelectFields{
    public mode = props.mode;
    public isRadio = true;
    public jsonFields: TJsonFields = shallowReactive({});
    public picked = ref("speed");

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
        // loading fields
        const taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
        const jsonFields = await taObj.fetchJsonFields();
        Object.assign(this.jsonFields, jsonFields);
    };

    public move = (step:number)=>{
        if(this.mode.Mode == TAMode.SingleDistribution){
            (this.mode as TAModeSingleDistribution).field = this.picked.value;
        }
        else{
            console.error(`尚未实现:${this.mode.Title}`);
            return;
        }
        
        emit("on-step", step, this.mode);
    }
};

const data = new PageSelectFields();
onMounted(data.init);
</script>