<style scoped lang="scss">
@import "theme.scss";
.container{
    display: flex;
    flex-flow: row wrap;
    align-self: flex-start;
    gap: 8px;
    padding: 8px;
}
.x-item{
    border: 1px solid $primary;
    width: 16em;
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    &:hover{
        background-color: $light;
    }

    .box{
        width: 12em;
        height: 12em;
        border-radius: 8px;
    }
    .title{
        font-size: 1.2em;
        font-weight: 600;
    }
}
</style>

<template>
    <div class="container">
        <div class="x-item" v-for="x in home.listResult">
            <img class="box" src="/img/ta.png" />
            <span class="title">{{x.title}}</span>
            <span>{{x.description}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
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