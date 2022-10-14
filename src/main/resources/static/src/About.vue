<style scoped lang="scss">
@use "theme.scss";

.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em 0;
}
.ss {
    color: theme.$danger;
    font-weight: bolder;
}
.links{
    display: flex;
    justify-content: space-around;
    a{
        margin: 4px;
    }
}
</style>

<template>
    <div class="container">
        <img src="/img/ta.png" />
        <p>{{page.text}} => <span class="ss">{{page.count}}</span></p>
        <button v-on:click="page.onClick">Click Me!<span class="material-symbols-outlined">check_box</span></button>
        <div class="links">
            <router-link to="/About">地址</router-link>
            <router-link to="/About/tm">时间</router-link>
        </div>
        <router-view></router-view>
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