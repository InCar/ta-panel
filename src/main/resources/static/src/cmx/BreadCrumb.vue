<style scoped lang="scss">
@use "../theme.scss";
.container{
    margin: 4px;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    li{
        color: theme.$color-2nd;
        display: inline;
        flex: 0 0 auto;
        margin: 0 2px;
        text-decoration: underline dashed 1px;
        text-underline-offset: 4px;
        cursor: pointer;
        &:hover{
            color: theme.$color-em;
        }
        &:last-child, material-symbols-outlined{
            cursor: auto;
            color: theme.$color-2nd;
            text-decoration: none;
        }
    }
}

</style>

<template>
    <ol class="container">
        <template v-for="(x,i) in listNavItems">
            <span v-if="(i>0)" class="material-symbols-outlined">arrow_right</span>
            <li  @click="onItemClicked(x, i)">{{x.text.value}}</li>
        </template>
    </ol>
</template>

<script lang="ts">
export interface BreadCrumbItem{
    text: Ref<string>;
    data?: any;
}
</script>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref, Ref, ShallowReactive, shallowReactive } from 'vue';

const props = defineProps({ disabled: Boolean });
const emit = defineEmits<{(e:"on-nav", item:BreadCrumbItem, i:number):void}>();

const listNavItems:ShallowReactive<BreadCrumbItem[]> = shallowReactive([]);

const total = computed(()=>listNavItems.length);

const onItemClicked = (x: BreadCrumbItem, i:number) => {
    if(props.disabled || i+1 == listNavItems.length) return;
    listNavItems.length = i+1;
    emit("on-nav", x, i);
};

const appendItem = (item: BreadCrumbItem)=>{
    listNavItems.push(item);
    
};

const stepBack = ()=>{
    const index = listNavItems.length-2;
    if(index < 0) return;
    const item = listNavItems[index];
    onItemClicked(item, index);
};

defineExpose({ total, appendItem, stepBack });
</script>

