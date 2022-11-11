<style scoped lang="scss">
    .container{
        margin: 1em;
        font-weight: bold;
    }
</style>

<template>
    <div class="container">
        {{version}}
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const version = ref("");

onMounted(async ()=>{
    const resp = await fetch("/api/version");
    if(resp.ok){
        const gitVer = await resp.json();
        version.value = gitVer.version;
    }
})
</script>