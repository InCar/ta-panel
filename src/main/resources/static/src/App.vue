<style scoped lang="scss">
@use "theme.scss";

@mixin frame-grid-config{
    display: grid;
    grid-template-columns: 10em 1fr;
    grid-template-rows: 4em 1fr auto;
    grid-template-areas: 
        "frame-header frame-header"
        "frame-left   frame-body"
        "frame-footer frame-footer";
    place-items: stretch;

    @media(max-width: 640px){
        // 窄一点的侧边栏
        grid-template-columns: 6em 1fr;
    }
}

.frame{
    min-height: 100vh;
    @include frame-grid-config;
    
    .frame-header{
        grid-area: frame-header;
        color: theme.$light;
        background-color: theme.$dark;
        display: flex;
        justify-content: space-around;
        padding: 0 1em;

        position: sticky;
        top: 0;
        z-index: 100;

        .logo{
            padding-top: 8px;
            max-width: 4em;
        }
    }

    .frame-left{
        grid-area: frame-left;
        background-color: theme.$light;
        display: flex;
        flex-flow: column nowrap;
    }

    .frame-body{
        grid-area: frame-body;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .frame-footer{
        grid-area: frame-footer;
        color: theme.$light;
        background-color: theme.$dark;
        display: flex;
        justify-content: space-around;
    }
}

.title{
    margin: auto;
    font-size: 3em;
    font-weight: normal;
}

.menu-left{
    display: flex;
    flex-flow: column nowrap;
    list-style-type: none;
    margin: 0;
    padding: 0;
    position: sticky;
    top: 4em;

    .menu-item {
        padding: 4px;
        border-bottom: 1px solid theme.$primary;

        &:first-child{
            padding-top: 8px;
        }
        &:last-child{
            border-bottom: none;
        }
        
        &:hover{
            background-color: theme.$primary;
        }

        a{
            display: block;
            margin: 0px 1em;
            text-decoration: none;
            font-size: normal;

            &.router-link-active{
                font-weight: bold;
                color: theme.$dark;
            }
        }
    }
}
</style>

<template>
    <div class="frame">
        <div class="frame-header">
            <img class="logo" src="/favicon.ico" />
            <h1 class="title">TensorAnalyzor</h1>
        </div>
        <div class="frame-left">
            <ul class="menu-left">
                <li class="menu-item" v-for="x in mainPage.listRoutes">
                    <router-link :to="x">
                        <span class="material-symbols-outlined">{{x.meta['icon']}}</span>
                        {{x.meta['title']}}
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="frame-body"><router-view></router-view></div>
        <div class="frame-footer">英卡科技 {{mainPage.version.value}}</div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter, RouterLink } from 'vue-router';
    import { ref, onMounted } from 'vue';

    class MainPage {
        listRoutes = useRouter().getRoutes().filter((x)=>x.meta['topLevel']);
        version = ref("");

        init = async () => {
            const resp = await fetch("/api/hello");
            this.version.value = await resp.text();
        };
    };

    const mainPage = new MainPage();
    onMounted(mainPage.init);

</script>