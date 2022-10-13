<style scoped lang="scss">
.container{
    margin: 4px;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    li{
        color: blue;
        display: inline;
        flex: 0 0 auto;
        margin: 0 2px;
        text-decoration: underline dashed 1px;
        text-underline-offset: 4px;
        cursor: pointer;
        &:hover{
            color: navy;
        }
        span{
            text-decoration: none;
        }
    }
}

</style>

<template>
    <ol class="container">
        <template v-for="(x,i) in data.listItems">
            <span v-if="i>0" class="material-symbols-outlined">arrow_right</span>
            <li  @click="data.onItemClicked(x, i)">{{x.text}}</li>
        </template>
    </ol>
</template>

<script lang="ts">
export interface BreadCrumbItem{
    text: string;
    data?: any;
}
</script>

<script setup lang="ts">
const props = defineProps<{ items: BreadCrumbItem[]}>();
const emit = defineEmits<{(e:"on-nav", item:BreadCrumbItem, i:number):void}>();

class BreadCrumb{
    public listItems = props.items;

    public constructor(){
    }

    public onItemClicked = (x: BreadCrumbItem, i:number)=>{
        emit("on-nav", x, i);
    }
}

const data = new BreadCrumb();
</script>

