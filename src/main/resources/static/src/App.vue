<script setup lang="ts">
    import { ref } from 'vue';
    
    const homeText = "Hello Vue3!";
    let count = ref(0);
    const onClick = (e: MouseEvent)=>{
        count.value++;
    };

</script>

<template>
    <div class="container-fluid">
        <div class="row align-items-center bg-dark text-light">
            <div class="col"><h1 class="text-center">TensorAnalyzor</h1></div>
        </div>
        <div class="row justify-content-md-center mt-3">
            <div class="col-md-auto">
                <p>{{homeText}} => <span class="ss">{{count}}</span></p>
                <button v-on:click="onClick" class="btn btn-primary">Click Me</button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .ss{
        color: crimson;
        font-weight: bolder;
    }
</style>