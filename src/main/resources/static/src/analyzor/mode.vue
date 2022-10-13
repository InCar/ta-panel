<style scoped lang="scss">
@import "../theme.scss";
.container{
    align-self: flex-start;
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    gap: 8px;
}
.x-item{
    border: 1px solid $dark;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 16em;
    .title{
        font-weight: 600;
        color: $dark;
        background-color: $light;
        border-bottom: 1px solid $dark;
        align-self: stretch;
        padding: 4px;
    }
    .content{
        margin: 0.5em;
        flex-grow: 1;
    }
    .footer{
        min-width: 7em;
        margin: 0.5em;
        align-self: flex-end;
        justify-self: end;
        &.disabled{
            color: silver;
            background-color: gray;
            cursor: not-allowed;
        }
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
import { TAModeBase, TAModeMultipleGeo, TAModeSingleDistribution, TAModeSingleGeo } from "../TAModes";

const emit = defineEmits<{(e:"on-mode", mode:TAModeBase):void}>();

class AnalyzorMode{
    public listModes:Array<TAModeBase> = [
        new TAModeSingleDistribution(),
        new TAModeSingleGeo(),
        new TAModeMultipleGeo()
    ];

    public onOK = (x:TAModeBase)=>{
        if(!x.Active) return;
        emit('on-mode', x);
    };
}

const data = new AnalyzorMode();
</script>