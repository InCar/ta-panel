<style scoped lang="scss">
@use "../theme.scss";
.box-field{
    display: flex;
    border-bottom: 1px solid theme.$light;
    align-self: stretch;
    @mixin field-gap{
        padding: 4px 8px;
    }
    .desc{
        flex: 0 0 8em;
        @include field-gap;
    }
    .key{
        flex: 0 0 10em;
        @include field-gap;
        font-weight: bold;
    }
    .description{
        flex: 1 0 auto;
        @include field-gap;
    }
}
</style>

<template>
    <div class="box-field" v-for="(v, k) in pageObj.jsonFields">
        <span class="desc">{{v.desc??k}}</span>
        <span class="key">{{k}}</span>
        <span class="description">{{v.description}}</span>
    </div>
</template>

<script setup lang="ts">
import { shallowReactive, onMounted, inject } from 'vue';
import { TensorAnalyzor, TJsonFields } from '../TensorAnalyzor';

const emit = defineEmits<{(e:"on-mode", mode:any):void}>();

class PageSelectFields{
    jsonFields: TJsonFields = shallowReactive({});

    init = async () => {
        const taObj: TensorAnalyzor = inject('taObj') as TensorAnalyzor;
        const jsonFields = await taObj.fetchJsonFields();
        Object.assign(this.jsonFields, jsonFields);
    };
};

const pageObj = new PageSelectFields();
onMounted(pageObj.init);
</script>