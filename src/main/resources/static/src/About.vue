<style scoped lang="scss">
    @import "theme.scss";
    .ss {
        color: crimson;
        font-weight: bolder;
    }
</style>

<template>
    <div class="row justify-content-md-center mt-3">
        <div class="col-md-auto">
            <img src="/img/ta.png" />
            <p>{{page.text}} => <span class="ss">{{page.count}}</span></p>
            <button v-on:click="page.onClick" class="btn btn-primary">Click Me!</button><br />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, shallowReactive, onMounted } from 'vue';
    class AboutPage {
        readonly text = "Hello Vue3!";
        count = ref(0);

        onClick = (e: MouseEvent) => {
            this.count.value++;
        }
    };

    const page = new AboutPage();
</script>