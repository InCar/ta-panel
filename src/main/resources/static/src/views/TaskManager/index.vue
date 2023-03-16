<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
    .container{
        display: grid;
        grid-template-columns: repeat(auto-fill, 25em);
        grid-gap: 8px;
        justify-content: center;

        &-item{
            width: 25em;
            height: 60px;
            border: 1px solid theme.$color;
            display: flex;
            cursor: pointer;
            &.is-success{
                border: 1px solid theme.$color-bk-success;
            }
            &.is-running{
                border: 1px solid theme.$color-bk-warning;
            }
            &.is-end{
                border: 1px solid theme.$color-bk-disabled;
            }
            &.is-fail{
                border: 1px solid theme.$color-bk-error;
            }

            &:hover {
                background-color: theme.$color-bk-2nd;
            }
        
            .item-title{
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 1rem;
                width: 6em;
                padding: 0 8px;
                background-color: theme.$color;
                color: theme.$color-bk;
                
                &.is-success{
                    background-color: theme.$color-bk-success;
                }
                &.is-running{
                    background-color: theme.$color-bk-warning;
                }
                &.is-end{
                    background-color: theme.$color-bk-disabled;
                }
                &.is-fail{
                    background-color: theme.$color-bk-error;
                }
            }
            .item-content{
                flex: 1 1 auto;
                display: flex;
                padding: 0 8px;
                .content-left{
                    font-size: 0.8rem;
                    display: flex;
                    flex-direction: column;
                    flex: auto;
                    justify-content: center;
                    &-status{
                        height: 22px;
                        line-height: 22px;
                        .status-text{
                            font-weight: 600;
                            color: theme.$color-em;
                        }
                    }
                    &-progress{
                        height: 22px;
                        line-height: 22px;
                        .straight-progress{
                            margin-top: 4px;
                        }
                    }
                }
                .conent-right{
                    width: 148px;
                    margin-left: 8px;
                    font-size: 0.6rem;
                    display: flex;
                    flex-direction: column;
                    flex: none;
                    justify-content: center;
                    // align-items: center;
                    &-createTime{
                        height: 22px;
                        line-height: 22px;
                    }
                    &-startTime{
                        height: 22px;
                        line-height: 22px;
                    }
                }
            }
        }
    }
</style>

<template>
    <div v-if="route.name === 'TaskManager'" class="container">
        <div class="container-item" v-for="(v, k) in listTasks" :key="k" :class="{ 'is-success': v.status === '3', 'is-end': (v.status === '6' || v.status === '5'), 'is-fail': v.status === '4', 'is-running': v.status === '2' }" @click="goDetail(v)">
            <div class="item-title" :class="{ 'is-success': v.status === '3', 'is-end': (v.status === '6' || v.status === '5'), 'is-fail': v.status === '4', 'is-running': v.status === '2'  }">{{ v.name }}</div>
            <div class="item-content">
                <div class="content-left">
                    <div class="content-left-status">状态：<span class="status-text">{{ v.status ? tastStatus[v.status] : '' }}</span></div>
                    <div class="content-left-progress">
                        <StProgress :percent="Number.parseFloat(v.percent + '')" :status="v.status" :strokeWidth="14" />
                    </div>
                </div>
                <div class="conent-right mobile-none">
                    <div class="conent-right-createTime">
                        <span>创建时间:</span>
                        <span>{{ formatDate(v.createTime, 'MM月dd日 HH:mm') || '-' }}</span>
                    </div>
                    <div class="conent-right-startTime">
                        <span>开始时间:</span>
                        <span>{{ formatDate(v.startTime, 'MM月dd日 HH:mm') || '-' }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <router-view />
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from "vue" 
import { getTasks } from './service'
import { TaskStatus, tastStatus } from './Models'
import { DateTime } from "luxon"
import { formatDate } from "@/utils/filter/index"
import { useRouter, useRoute } from "vue-router";

const task = reactive({
    name: '任务管理',
    list: [{
        name: '计数和极值#02171013',
        percent: 100,
        status: 'success',
        createTime: 0,
        startTime: 0,
        finishTime: 0
    }],
    loading: false
})

const status = ref('fail')

const getTaskList = async () => {
    const res = await getTasks()
    if(res.data && res.data.length) {
        const dt = DateTime.local(2017, 5, 15, 8, 30);
        task.list = res.data.filter(task => {
            if(task?.status != TaskStatus.NA) return true
        })
    }
}

getTaskList()

const router = useRouter()
const route = useRoute()
const goDetail = (v) => {
    router.push({
        name: 'TaskDetail',
        params: {id: v.id}
    })
}

const listTasks = computed(() => {
    const tmNow = DateTime.local().toMillis();
    
    return task.list.filter(task=>{
        if(task?.status != '3') return true // 成功的
        if(!task?.finishTime) return true;
        const dura = tmNow - task?.finishTime;
        const days = dura/86400000;
        return (days < 7.0);
    });
})

</script>