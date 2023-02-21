<style scoped lang="scss">
@use "../theme.scss";
.container{
    display: grid;
    flex-flow: row wrap;
    // align-self: center;
    justify-content: center;
    padding: 8px;
    grid-template-columns: repeat(auto-fill, 16em);
    grid-gap: 8px;
}
.x-item{
    color: theme.$color;
    border: 1px solid theme.$color-2nd;
    // width: 16em;
    padding: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    &:hover{
        background-color: theme.$color-bk-2nd;
        cursor: pointer;
    }
    &.disabled{
        color: gray;
        background-color: theme.$color-bk;
        cursor: default;
        img{
            filter: grayscale(1.0);
        }
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
    p{
        margin: 0;
    }
    .em{
        color: theme.$color-em;
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
.error-message{
    @include theme.mx-error;
    padding: 1em;
}
</style>

<template>
    <div class="error-message" v-if="errorMessage.length>0">{{errorMessage}}</div>
    <BreadCrumb class="nav" ref="breadCrumb" @on-nav="onNav"/>
    <div class="container" v-if="!isChildActive">
        <div class="x-item" v-for="x in listGroupTitle" @click="onClickGroup(x.op)" :class="{ disabled: !x.op}">
            <img class="box hue-205" src="/img/ta.png" />
            <p class="title">
                <span>{{x.title}}</span>(<span class="em">{{calcItemCount(x.op)}}</span>)
            </p>
            <span>{{x.description}}</span>
        </div>
    </div>
    <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useSDM } from "@sdm";
import { BreadCrumb, BreadCrumbItem } from "@components";

interface XEntry {
    title: string;
    op?: string;
    description: string;
}

const router = useRouter();
const taskGroupDM = useSDM().TaskGroupDM;

const breadCrumb = ref<InstanceType<typeof BreadCrumb>|null>(null);
const errorMessage = ref("");

const listGroupTitle: XEntry[] = [
    { title: "计数&极值", op:"aggregation", description: "统计数据源中的基本情况,包括数据量、极大极小值"},
    { title: "数值分布", op:"group-aggregation", description: "统计某个指标数值的分布区间,哪些区间数据多,哪些区间数据少"},
    { title: "充电站分析", description: "根据充电和位置数据分析一个城市中有几个充电站" },
    { title: "道路情况评估", description: "根据道路的行车数据分析道路情况" },
    { title: "交通信号灯", description: "根据行车数据分析路口的交通信号灯各方向时长间隔" },
    { title: "电池健康", description: "长时间的电池充放电数据,测算电池健康度" },
    { title: "车型速度/加速度分布", description: "不同车型的特征性能分布差异，掌握用户针对特定车型的使用习惯" }
];

const isChildActive = computed(()=>{
    const routes = router.currentRoute.value;
    return routes.matched.length > 1;
});

const routePath = computed(()=>{
    const routes = router.currentRoute.value;
    return routes.fullPath;
});

const onNav = (item:BreadCrumbItem, i:number)=>{
    router.push(item.data);
};

const onClickGroup = (op:string|void)=>{
    if(!!op)
        router.push(`/Analyzor/${op}`);
}

const calcItemCount = (op: string|void)=>{
    if(!op) return 0;

    return taskGroupDM.AnalyzorGroups.value[op]?.length ?? 0;
}

onMounted(async ()=>{
    try{
        await taskGroupDM.fetch();
    }
    catch(e){
        if(e instanceof Error){
            errorMessage.value = e.message;
            if(!!e.cause)
                errorMessage.value += ` => ${e.cause}`
        }
        else{
            errorMessage.value = `${e}`;
        }
    }
    
    watch(routePath, (v, last)=>{
        if(v.startsWith("/Analyzor")){
            const routes = router.currentRoute.value;

            if(routes.matched.length === 1){
                while(breadCrumb.value?.total! > 1){
                    breadCrumb.value?.stepBack();
                }
            }

            if(breadCrumb.value?.total! < 1){
                breadCrumb.value?.appendItem({ text: ref("分析结果"), data: "/Analyzor" });
            }

            const group = routes.params["group"] as string;
            if(breadCrumb.value?.total! < 2 && group){
                const title = listGroupTitle.find(x=>x.op == group)!.title;
                breadCrumb.value?.appendItem({ text: ref(title), data: `/Analyzor/${group}`});
            }

            const taskId = routes.params["taskId"] as string;
            if(breadCrumb.value?.total! < 3 && taskId){
                const task = taskGroupDM.AnalyzorGroups.value[group].find(v=>v.id == taskId);
                breadCrumb.value?.appendItem({ text: ref(task!.name), data: `/Analyzor/${group}/${taskId}` });
            }
            
        }
    }, { immediate: true });
});

</script>