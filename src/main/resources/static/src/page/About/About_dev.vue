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
import { onMounted, ref, watch } from "vue";
import { useTA } from "@remote";

class DevSettings{
    private taObj = useTA();
    public backPoint = ref("");

    public init = ()=>{
        this.backPoint.value = this.taObj.BackPoint;

        watch(this.backPoint, 
            (value, last)=>{
                this.taObj.BackPoint = value;
            });
    };

    public reset = ()=>{
        this.taObj.BackPoint = null;
        this.backPoint.value = this.taObj.BackPoint;
    }
}

const data = new DevSettings();
onMounted(data.init);
</script>