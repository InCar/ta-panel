<style scoped lang="scss">
@use "../../theme.scss";
@use "sass:color";

.container{
    align-self: flex-start;
    display: flex;
    flex-flow: row wrap;
    padding: 8px;
    gap: 8px;
}
.x-item{
    border: 1px solid theme.$color;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 16em;
    .title{
        font-weight: 600;
        color: theme.$color-bk;
        background-color: theme.$color;
        border-bottom: 1px solid theme.$color;
        align-self: stretch;
        padding: 4px;
    }
    .content{
        margin: 0.5em;
        flex-grow: 1;
        align-self: flex-start;
    }
    .footer{
        min-width: 7em;
        margin: 0.5em;
        align-self: flex-end;
        justify-self: end;
    }
}
</style>

<template>
    <div class="container">
        <div class="x-item" v-for="x in data.listModes">
            <span class="title">{{x.Title}}</span>
            <span class="content">{{x.Description}}</span>
            <button class="footer" :class="{disabled:!x.Active}" @click="data.onOK(x)">OK</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { TAModeBase, TAModeCount, TAModeMultipleGeo, TAModeSingleDistribution, TAModeSingleGeo } from "logic";

const props = defineProps(["taskArgs"]);
const emit = defineEmits<{
        (e:"on-step", step:number, mode:TAModeBase):void
    }>();

class AnalyzorMode{
    public listModes:Array<TAModeBase> = [
        new TAModeCount(),
        new TAModeSingleDistribution(),
        new TAModeSingleGeo(),
        new TAModeMultipleGeo()
    ];

    public onOK = (x:TAModeBase)=>{
        if(!x.Active) return;

        const tm = moment().format("MMDDHHmm");
        x.TaskName = `${x.Title}#${tm}`;
        emit('on-step', +1, x);
    };
}

const data = new AnalyzorMode();
const caption = "创建新任务";
defineExpose({
    caption
});
</script>