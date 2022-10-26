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
        color: theme.$color-bk;
        background-color: theme.$color;
        position: sticky;
        top: 0;
        z-index: 100;
        padding: 0 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        .logo{
            margin-top: 8px;
            max-width: 4em;
        }

        .title{
            margin: auto;
            font-size: 3em;
            font-weight: normal;
        }
    }

    .frame-left{
        grid-area: frame-left;
        background-color: theme.$color-bk-2nd;
    }

    .frame-body{
        grid-area: frame-body;
        background-color: theme.$color-bk;
    }

    .frame-footer{
        grid-area: frame-footer;
        color: theme.$color-bk;
        background-color: theme.$color;
        align-items: center;
    }
}

.menu-left{
    list-style-type: none;
    margin: 0;
    padding: 0;
    position: sticky;
    top: 4em;

    .menu-item {
        border-bottom: 1px solid theme.$color;
        .material-symbols-outlined{
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
        }
        &:first-child{
            padding-top: 8px;
        }
        &:last-child{
            border-bottom: none;
        }
        
        &:hover{
            background-color: theme.$color-bk;
        }
        &.router-link-active{
            font-weight: bold;
            color: theme.$color-em;
            background-color: theme.$color-bk;
            .material-symbols-outlined{
                font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
            }
        }

        a{
            color: theme.$color;
            padding: 4px 1em;
            text-decoration: none;
            font-size: normal;
            display: flex;
            align-items: center;
            @media(max-width: 640px){
                justify-content: center;
                .material-symbols-outlined{
                    font-size: 48px;
                }
            }
        }
    }
}
</style>

<template>
    <div class="frame" :class="activeTheme">
        <div class="frame-header">
            <img class="logo" src="/favicon.ico" />
            <h1 class="title">TensorAnalyzor</h1>
            <Theme @on-theme="onTheme" />
        </div>
        <div class="frame-left">
            <ul class="menu-left">
                <template v-for="x in listRoutes">
                    <router-link :to="x" custom v-slot="{ href, route, navigate, isActive, isExactActive }">
                        <li class="menu-item" :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']">
                                <a :href="href" @click="navigate">
                                <span class="material-symbols-outlined">{{x.meta['icon']}}</span>
                                <span class="mobile-none">{{x.meta['title']}}</span>
                            </a>
                        </li>
                    </router-link>
                </template>
            </ul>
        </div>
        <div class="frame-body"><router-view></router-view></div>
        <div class="frame-footer">英卡科技 {{version}}</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import Theme from "./cmx/Theme.vue";
import TODO from "./page/todo.vue";

const listRoutes = useRouter().getRoutes().filter((x)=>x.meta['topLevel']);
const version = ref("");
const activeTheme = ref("theme");

const init = async () => {
    const resp = await fetch("/api/hello");
    version.value = await resp.text();
};

const onTheme = (theme:string)=>{
    activeTheme.value = theme;
};

onMounted(init);
</script>