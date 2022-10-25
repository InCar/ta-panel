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
        color: theme.$color;
        background-color: theme.$color-bk;
    }

    .frame-body{
        grid-area: frame-body;
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

        &:first-child{
            padding-top: 8px;
        }
        &:last-child{
            border-bottom: none;
        }

        a{
            color: theme.$color;
            padding: 4px 1em;
            text-decoration: none;
            font-size: normal;
            display: flex;
            align-items: center;
            .material-symbols-outlined{
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
            }
            @media(max-width: 640px){
                justify-content: center;
                .material-symbols-outlined{
                    font-size: 48px;
                }
            }
        
            &:hover{
                background-color: theme.$color-bk-2nd;
            }
            &.router-link-active{
                font-weight: bold;
                color: theme.$color-em;
                background-color: theme.$color-bk-2nd;
                .material-symbols-outlined{
                    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
                }
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
                <li class="menu-item" v-for="x in listRoutes">
                    <router-link :to="x">
                        <span class="material-symbols-outlined">{{x.meta['icon']}}</span>
                        <span class="mobile-none">{{x.meta['title']}}</span>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="frame-body"><router-view></router-view></div>
        <div class="frame-footer">英卡科技 {{version}}</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';

const listRoutes = useRouter().getRoutes().filter((x)=>x.meta['topLevel']);
const version = ref("");

const init = async () => {
    const resp = await fetch("/api/hello");
    version.value = await resp.text();
};

onMounted(init);
</script>