<style scoped lang="scss">
@use "../theme.scss";
.container{
    display: flex;
    flex-flow: row wrap;
    align-self: center;
    justify-content: center;
    gap: 8px;
    padding: 8px;
}
.x-item{
    color: theme.$color;
    border: 1px solid theme.$color-2nd;
    width: 16em;
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    &:hover{
        background-color: theme.$color-bk-2nd;
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

.nav{
    align-self: flex-start;
    margin: 4px;
    padding: 0;
    display: flex;
    flex-flow: row wrap;
    li{
        color: theme.$color;
        display: inline;
        flex: 0 0 auto;
        margin: 0 2px;
        text-decoration: underline dashed 1px theme.$color;
        text-underline-offset: 4px;
        cursor: pointer;
        &:hover{
            @include theme.mx-warning;
        }
        span{
            text-decoration: none;
        }
    }
}
.bread-crumb{
    align-self: stretch;
    min-height: 2em;
}
</style>

<template>
    <BreadCrumb class="nav" ref="breadCrumb" @on-nav="onNav"/>
    <div class="container" v-if="!isChildActive">
        <div class="x-item" v-for="(listTasks, op) in store.dictAnalyzorGroups" @click="onClickGroup(op as string)">
            <img class="box hue-205" src="/img/ta.png" />
            <span class="title">{{`${dictGroupTitle[op].title}(${listTasks.length})`}}</span>
            <span>{{dictGroupTitle[op].description}}</span>
        </div>

        <template v-if="Object.keys(store.dictAnalyzorGroups).length === 0">
            <div class="x-item" v-for="x in home.listResult">
                <img class="box hue-205" src="/img/ta.png" />
                <span class="title">{{x.title}}</span>
                <span>{{x.description}}</span>
            </div>
        </template>
    </div>
    <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAnalyzorStore, useNavStore } from "@store";
import { BreadCrumb, BreadCrumbItem } from "@cmx";

interface XEntry {
    title: string;
    description: string;
}

const dictGroupTitle: { [key:string]:XEntry } = {
    "aggregation": { title: "计数&极值", description: "统计数据源中的基本情况,包括数据量、极大极小值"},
    "group-aggregation": { title: "数值分布", description: "统计某个指标数值的分布区间,哪些区间数据多,哪些区间数据少"}
};

const router = useRouter();
const store = useAnalyzorStore();
const navStore = useNavStore();

const breadCrumb = ref<InstanceType<typeof BreadCrumb>|null>(null);

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

const isChildActive = computed(()=>{
    const routes = router.currentRoute.value;
    return routes.matched.length > 1;
});

const onNav = (item:BreadCrumbItem, i:number)=>{
    router.push(item.data);
};

const onClickGroup = (op:string)=>{
    router.push(`/Analyzor/${op}`);
}

onMounted(async ()=>{ 
    breadCrumb.value?.appendItem({ text: ref("分析结果"), data: "/Analyzor" });
    await store.fetch();   
});

onBeforeUnmount
</script>