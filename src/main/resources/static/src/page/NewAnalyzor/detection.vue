<template>
    
</template>

<script setup lang="ts">
import { TAModeBase } from "@ta";
import { useSDM } from "@sdm";


const props = defineProps(["taskArgs"]);
const emit = defineEmits<{
        (e:"on-step", step:number, mode:TAModeBase):void,
        (e:"on-can-back", canBack:boolean):void
    }>();

const dataSourceDM = useSDM().DataSourceDM;
dataSourceDM.fetchMongoDB();

const caption = "数据侦测";
defineExpose({
    caption
});
</script>