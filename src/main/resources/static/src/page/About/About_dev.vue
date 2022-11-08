<style scoped lang="scss">
@use "../../theme.scss";

.container{
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;

    .x-item {
        display: flex;
        flex-flow: row nowrap;
        gap: 1em;
        align-items: center;
        @media(max-width: theme.$size-mobile-max-width){
            flex-flow: column nowrap;
            gap: 0.25em;
        }

        input{
            font-size: 1.5em;
            padding: 4px;;
        }
    }
}
</style>

<template>
    <div class="container">
        <div class="x-item">
            <span>BackPoint:</span>
            <input type="text" v-model="data.backPoint.value"/>
            <button @click="data.reset">reset</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, inject } from "vue";
import { TensorAnalyzor } from "@remote";

class DevSettings{
    private taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
    public backPoint = ref("");

    public init = ()=>{
        this.backPoint.value = this.taObj.getBackPoint();

        watch(this.backPoint, 
            (value, last)=>{
                this.taObj.updateBackPoint(value);
            });
    };

    public reset = ()=>{
        this.taObj.updateBackPoint(null);
        this.backPoint.value = this.taObj.getBackPoint();
    }
}

const data = new DevSettings();
onMounted(data.init);
</script>