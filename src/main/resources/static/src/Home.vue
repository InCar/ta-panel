<style scoped lang="scss">
    @import "theme.scss";

    .img-hold {
        width: 15rem;
        height: 15rem;
        display: block;
        margin: 0 auto;
        background-color: $dark;
    }
</style>

<template>
    <div class="row" style="padding-top:1rem;">
        <div class="col col-md-3 m-2" v-for="x in home.listResult">
            <div class="card pt-2">
                <img class="card-img-top img-hold" />
                <div class="card-body">
                    <h5 class="text-center">{{x.title}}</h5>
                    <p>{{x.description}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, shallowReactive, onMounted } from 'vue';

    interface XEntry {
        title: string;
        description: string;
    }

    class HomePage {
        listResult: XEntry[] = [
            { title: "充电站分析", description: "根据充电和位置数据分析一个城市中有几个充电站" },
            { title: "道路情况评估", description: "根据道路的行车数据分析道路情况" },
            { title: "交通信号灯", description: "根据行车数据分析路口的交通信号灯各方向时长间隔" },
            { title: "电池健康", description: "长时间的电池充放电数据,测算电池健康度" },
            { title: "车型速度/加速度分布", description: "不同车型的特征性能分布差异，掌握用户针对特定车型的使用习惯" }
        ];
    }

    const home = new HomePage();

</script>