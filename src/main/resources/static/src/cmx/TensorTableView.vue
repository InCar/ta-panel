<style scoped lang="scss">
@use "../theme.scss";


.data-table-h{
    margin:1em;
    align-self: center;
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    row-gap: 0.25em;

    span{
        text-align: center;
        padding: 0.25em;
        border: 1px solid theme.$color;
        margin: -1px 0 0 -1px;
    }
}

.data-table-v{
    margin:1em;
    align-self: center;
    display: grid;
    grid-template-columns: 1fr 1fr;
    span:nth-of-type(2n+1){
        text-align: center;
    }
    span:nth-of-type(2n){
        text-align: right;
    }
    
    span{
        text-align: center;
        border: 1px solid theme.$color;
        padding: 0.25em;
        margin: -1px 0 0 -1px;
    }
}
</style>

<template>
    <div class="data-table-v mobile-only">
        <template v-for="axis in dims">
            <span>{{axis.label}}</span>
        </template>
        <template v-for="v in listDataForVer">
            <span>{{v[0]}}</span>
            <span>{{v[1]}}</span>
        </template>
    </div>
    <div class="data-table-h mobile-none">
        <div v-for="v in listDataForHoz">
            <span>{{v[1]}}</span>
            <span>{{v[0]}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TensorData } from '@ta';


const props = defineProps<{
    data: TensorData
}>();

const dims = computed(()=>{
    return props.data.dims;
})

const listDataForVer = computed(()=>{
    return props.data.tensor;
})

const listDataForHoz = computed(()=>{
    const listData = props.data.tensor;
    const dims = props.data.dims;
    const CountInRow = 10;

    const listAll: Array<any[]> = [];
    for(let i=0;i<Math.ceil(listData.length/CountInRow);i++){
        listAll.push(dims.map(axis=>axis.label));
        for(let j=i*CountInRow;j<(i+1)*CountInRow;j++){
            if(j < listData.length)
                listAll.push(listData[j]);
        }
    }

    return listAll;
});

</script>