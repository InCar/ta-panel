<style scoped lang="scss">
    @import "theme.scss";

    .left-menu {
        background-color: $light;
        min-height: 600px;

        li {
            background-color: $light;
        }
    }

    .router-link-active{
        width: 100%;
        font-weight:800;
        color: $warning;
    }
</style>

<template>
    <div class="container-fluid">
        <div class="row align-items-center bg-dark text-light">
            <!--Top-->
            <div class="col"><h1 class="text-center">TensorAnalyzor</h1></div>
        </div>
        <div class="row">
            <div class="col-md-2 left-menu">
                <!--Left-->
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="x in mainPage.listRoutes">
                        <router-link :to="x">{{x.name}}</router-link>
                    </li>
                </ul>
            </div>
            <div class="col">
                <!--right-->
                <router-view></router-view>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
    import { useRouter, useRoute, RouterLink } from 'vue-router';
    import { ref, shallowReactive, onMounted } from 'vue';

    class MainPage {
        listRoutes = useRouter().getRoutes();
        windowHeight = ref(600);

        init = async () => {
            console.info(this.listRoutes[0]);
            console.info(window.innerHeight);

            const resp = await fetch("/api/hello");
            const text = await resp.text()
            console.info(`received: ${text.length} bytes`);
        };
    };

    const mainPage = new MainPage();
    onMounted(mainPage.init);

</script>