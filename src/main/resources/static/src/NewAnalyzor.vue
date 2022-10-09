<template>
    <div class="row justify-content-center">
        <div class="col col-md-auto">
            <table class="table table-sm table-hover">
                <tbody>
                    <tr v-for="(v, k) in taskAnalyzor.jsonFields">
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
    import { ref, shallowReactive, onMounted } from 'vue';

    class TaskAnalyzor{
        jsonFields:{ [key:string]: {desc?:string, description?:string}} = shallowReactive({});

        init = async()=>{
            const resp = await fetch("/api/fields");
            const data = await resp.json();
            Object.assign(this.jsonFields, data.fields);
        };
    };

    const taskAnalyzor = new TaskAnalyzor();
    onMounted(taskAnalyzor.init);
</script>