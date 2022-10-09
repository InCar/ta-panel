<template>    
    <div class="row justify-content-center">
        <div class="col col-md-auto">
            <table class="table table-sm table-hover">
                <tbody>
                    <tr v-for="(v, k) in pageObj.jsonFields">
                        <td>{{v.desc??k}}</td>
                        <td><span class="badge rounded-pill text-bg-primary">{{k}}</span></td>
                        <td>{{v.description}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, shallowReactive, onMounted, inject } from 'vue';
    import { TensorAnalyzor, TJsonFields } from '../TensorAnalyzor';

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