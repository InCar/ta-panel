<style scoped lang="scss">
    @import "theme.scss";

    .left-menu {
        background-color: $light;

        li {
            background-color: $light;
        }
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
                    <li class="list-group-item" v-for="x in mainPage.listMenuItems">
                        <router-link v-if="x.link != null" :to="x.link">{{x.mi}}</router-link>
                        <span v-else>{{x.mi}}</span>
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
    // import { useRouter, useRoute, RouterLink } from 'vue-router';
    import { ref, shallowReactive, onMounted } from 'vue';

    class MainPage {
        listMenuItems: Array<{ mi: string, link: string|null }> = [
            { mi: "分析结果", link: "/" },
            { mi: "任务管理", link: null },
            { mi: "创建新任务", link: "/NewAnalyzor" },
            { mi: "About", link: "/About" },
        ];

        init = async () => {
            const resp = await fetch("/api/hello");
            const text = await resp.text()
            console.info(`received: ${text.length} bytes`);
        };
    };

    const mainPage = new MainPage();
    onMounted(mainPage.init);

</script>