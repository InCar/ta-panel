<style scoped lang="scss">
@use "../../theme.scss";
@use "sass:color";

.container{
    align-self: flex-start;
    display: flex;
    flex-wrap: wrap;
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
        color: theme.$color;
        background-color: theme.$color-bk;
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
import { TAModeBase, TAModeMultipleGeo, TAModeSingleDistribution, TAModeSingleGeo } from "logic";

const emit = defineEmits<{(e:"on-step", step:number, mode:TAModeBase):void}>();

class AnalyzorMode{
    public listModes:Array<TAModeBase> = [
        new TAModeSingleDistribution(),
        new TAModeSingleGeo(),
        new TAModeMultipleGeo()
    ];

    public onOK = (x:TAModeBase)=>{
        if(!x.Active) return;

        const tm = new Intl.DateTimeFormat('en-US', {month:'2-digit', day:'2-digit', hour12:false, hour:"2-digit", minute:'2-digit'})
            .format(Date.now()).replaceAll(/\D/g, "");
        x.TaskName = `${x.Title}#${tm}`;
        emit('on-step', +1, x);
    };
}

const data = new AnalyzorMode();
</script>