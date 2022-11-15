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
        <span>{{dataLabel.x}}</span><span>{{dataLabel.y}}</span>
        <template class="data-xy" v-for="v in listDataForVer">
            <span>{{v.strX??v.x}}</span>
            <span>{{v.y}}</span>
        </template>
    </div>
    <div class="data-table-h mobile-none">
        <div v-for="v in listDataForHoz">
            <span>{{v.y}}</span>
            <span>{{v.strX??v.x}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';

interface ItemEntry{
    x: number;
    strX?: string;
    y: number|string;
}

interface ItemLabel{
    x: string;
    y: string;
}

interface ItemData{
    label: ItemLabel,
    listData: ItemEntry[]
}

const props = defineProps<{
    data: ItemData
}>();

const dataLabel = computed(()=>{
    return props.data.label;
})

const listDataForVer = computed(()=>{
    return props.data.listData;
})

const listDataForHoz = computed(()=>{
    const listData = props.data.listData;
    const label = props.data.label;
    const CountInRow = 10;

    const listAll: Array<ItemEntry> = [];
    for(let i=0;i<Math.ceil(listData.length/CountInRow);i++){
        listAll.push({ x: 0, strX: label.x, y: label.y});
        for(let j=i*CountInRow;j<(i+1)*CountInRow;j++){
            if(j < listData.length)
                listAll.push(listData[j]);
        }
    }

    return listAll;
});

</script>