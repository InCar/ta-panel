<style scoped lang="scss">
@import "theme.scss";

.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em 0;
}
.ss {
    color: $danger;
    font-weight: bolder;
}
</style>

<template>
    <div class="container">
        <img src="/img/ta.png" />
        <p>{{page.text}} => <span class="ss">{{page.count}}</span></p>
        <button v-on:click="page.onClick">Click Me!<span class="material-symbols-outlined">check_box</span></button>
        
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    class AboutPage {
        readonly text = "Hello Vue3!";
        count = ref(0);

        onClick = (e: MouseEvent) => {
            this.count.value++;
        }
    };

    const page = new AboutPage();
</script>