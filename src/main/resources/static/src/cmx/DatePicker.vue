<style scoped lang="scss">
@use "../theme.scss";
.date-picker{
    .date-picker-header{
        padding: 8px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
    }
    @mixin drop-list{
        border: 1px solid theme.$color;
        background-color: theme.$color-bk-2nd;
        :nth-child(n+1){
            &:hover{
                background-color: theme.$color-bk;
            }
        }
        span{
            padding: 2px 8px;
        }
    }
    .date-picker-year{
        font-size: 1.5em;
    }
    .year-list{
        @include drop-list;
        text-align: center;
        font-size: 0.75em;
        max-width: 17em;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
    }
    .date-picker-month{
        font-size: 1.5em;
    }
    .month-list{
        @include drop-list;
        text-align: right;
    }
    .date-picker-date{
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        .box-date{
            border-right: 1px dashed theme.$color-2nd;
            border-bottom: 1px dashed theme.$color-2nd;
            padding: 1em;
            text-align: center;
            &.box-picked{
                background-color: theme.$color-bk-2nd;
                filter:drop-shadow(0 0 8px theme.$color);
            }
            &:nth-child(-n+7){
                border-top: 1px dashed theme.$color-2nd;
            }
            &:nth-child(7n+1){
                border-left: 1px dashed theme.$color-2nd;
            }
            &:hover{
                color: theme.$color-bk;
                background-color: theme.$color-2nd;
            }
        }
        .box-this-month{
            background-color: theme.$color-bk-2nd;
            
            &.box-today{
                color: theme.$color-bk;
                background-color: theme.$color;
            }
        }
    }
}
</style>

<template>
    <div class="date-picker">
        <div class="date-picker-header">
            <div class="date-picker-year">
                <Dropdown ref="pickYearCtrl">
                    {{presentMonth.year}}年
                    <template v-slot:menu>
                        <div class="year-list">
                            <span v-for="y in listYear" @click="onClickYear(y)">{{y}}</span>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="date-picker-month">
                <Dropdown ref="pickMonthCtrl">
                    {{presentMonth.month}}月
                    <template v-slot:menu>
                        <div class="month-list">
                            <span v-for="m in listMonthFixed12" @click="onClickMonth(m)">{{m}}月</span>
                        </div>
                    </template>
                </Dropdown>
            </div>
        </div>
        <div class="date-picker-date" :class="styleFlip">
            <div class="box-date" v-for="(v, i) in listDatesInLastMonth" @click="onClickDate(v)" :class="stylePickedToday(v)">{{v.date}}</div>
            <div class="box-date box-this-month" v-for="(v, i) in listDatesInThisMonth" @click="onClickDate(v)" :class="stylePickedToday(v)">{{v.date}}</div>
            <div class="box-date" v-for="(v, i) in listDatesInNextMonth" @click="onClickDate(v)" :class="stylePickedToday(v)">{{v.date}}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import moment from "moment";
import { onBeforeMount, ref } from "vue";
import Dropdown from "./Dropdown.vue";

const emit = defineEmits<{(e:"on-pick-date", date:TDate):void}>();

interface TDate{
    year: number;
    month: number;
    date: number;
}

// 当前展现月份,月份以1~12表示
const presentMonth = ref<TDate>({year:2022, month:10, date:0});
// 当前选中的日期
const picked = ref<TDate>({year:2022, month:10, date:27});

const listMonthFixed12 = Array(12).fill(0).map((v, i)=>i+1);
const listYear = Array(50).fill(0).map((v,i)=>2000+i);

const pickMonthCtrl = ref<InstanceType<typeof Dropdown>|null>(null);
const pickYearCtrl = ref<InstanceType<typeof Dropdown>|null>(null);

const onClickYear = (year: number)=>{
    if(presentMonth.value.year != year){
        presentMonth.value.year = year;
        triggerFlipAnimation();
    }
    pickYearCtrl.value?.closeMenu();
};

const onClickMonth = (month: number)=>{
    if(presentMonth.value.month != month){
        presentMonth.value.month = month;
        triggerFlipAnimation();
    }
    pickMonthCtrl.value?.closeMenu();
};

const onClickDate = (date: TDate)=>{
    picked.value = date;
    emit("on-pick-date", date);
};

const lastDateInMonth = computed(()=>{
    const tm = getTM1st();
    return tm.endOf("month").date();
});

const weekDayOfMonth1st = computed(()=>{
    // 当前月第1天是星期几(0~6),0是星期天
    const tm = getTM1st();
    return tm.day();
});

const listDatesInThisMonth = computed<TDate[]>(()=>{
    const result = [];
    const m = presentMonth.value;
    for(let i=1;i<=lastDateInMonth.value;i++){
        result.push({ year: m.year, month: m.month, date: i});
    }
    return result;
});

const listDatesInLastMonth = computed<TDate[]>(()=>{
    // 前一个月的最后几天(出现在第1周的前几天里)
    const tm = getTM1st();
    const tmLastMonth = tm.add(-1, "months");
    const year = tmLastMonth.year();
    const month = tmLastMonth.month()+1;
    const to = tmLastMonth.endOf("month").date();
    const from = to - weekDayOfMonth1st.value + 1;
    const result = [];
    for(let i=from;i<=to;i++){
        result.push({ year, month, date: i});
    }

    return result;
});

const listDatesInNextMonth = computed(()=>{
    // 后一个月的最前几天(出现在最末周的后几天里)
    const tm = getTM1st();
    const to = 6-tm.endOf("month").day();
    const tmNextMonth = tm.add(+1, "days");
    const year = tmNextMonth.year();
    const month = tmNextMonth.month()+1;
    const from = 1;
    const result = [];
    for(let i=from;i<=to;i++){
        result.push({ year, month, date: i});
    }
    return result;
});

const isInFlipAnimation = ref(false);
const styleFlip = computed(()=>{
    if(isInFlipAnimation.value) return "ami-flip";
    else return "";
});

const triggerFlipAnimation = ()=>{
    isInFlipAnimation.value = true;
    setTimeout(()=>{
        isInFlipAnimation.value = false;
    }, 1000);
}

const stylePickedToday = (date: TDate)=>{
    const result:string[] = [];

    // picked
    const pick = picked.value;
    if(pick.year == date.year && pick.month == date.month && pick.date == date.date){
        result.push("box-picked");
    }

    // today
    const tm = moment();
    if(tm.year() === date.year && tm.month()+1 == date.month && tm.date() == date.date){
        result.push("box-today");
    }

    return result;
}

const getTM1st = ()=>{
    const m = presentMonth.value;
    const tm = moment({year:m.year, month:m.month-1, date: 1});
    return tm;
};

onBeforeMount(()=>{
    const tm = moment();
    presentMonth.value = { year: tm.year(), month:tm.month()+1, date:tm.date()};
});
</script>