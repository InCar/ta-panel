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
            <input type="text" v-model="backPointValue"/>
            <button @click="reset">reset</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import{ onMounted, ref, watch } from "vue";
import { useSDM } from "@sdm";

const aboutDM = useSDM().AboutDM;
const backPointValue = ref("");

const reset = ()=>{
    aboutDM.BackPoint = null;
    backPointValue.value = aboutDM.BackPoint;
}

onMounted(()=>{
    backPointValue.value = aboutDM.BackPoint;

    watch(backPointValue, (value)=>{
        aboutDM.BackPoint = value;
    });
})
</script>