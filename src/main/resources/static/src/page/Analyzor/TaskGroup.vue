<style scoped lang="scss">
@use "../../theme.scss";

.table-grid{
    align-self: center;
    display: flex;
    flex-flow: row wrap;
    margin: 1em;

    div{
        flex: 1 0 auto;
    }

    .table-fn{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    span{
        border: 1px solid theme.$color;
        margin: -1px 0 0 -1px;
        padding: 0.5em;
    }
    .field-name{
        text-align: center;
        font-weight: bold;
    }
    .fn-name{
        text-align: center;
        font-weight: bold;
    }
    .fn-value{
        text-align: right;
    }
}
</style>

<template>
    <BarChart :data="barChartData"/>
    <div v-if="hasResult">
        <div class="table-grid">
            <div v-for="field in listData">
                <span class="field-name">{{field.field}}</span>
                <div class="table-fn">
                    <template v-for="fnD in field.fns">
                        <span class="fn-name">{{fnD.fn}}</span>
                        <span class="fn-value">{{fnD.value}}</span>
                    </template>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Task } from "@ta";
import { BarChart } from "@cmx";
import { DateTime } from "luxon";

interface ItemData{
    fn: string;
    value: number|string;
}

const props = defineProps<{
    task: Task
}>();

const hasResult = computed(()=>{
    return tensorData.value.tensor.length > 0;
});

const tensorData = computed(()=>{
    return props.task.makeTensor();
})

const barChartData = computed(()=>{
    return tensorData.value.tensor
        .filter(v=>v[1] == "count")
        .map(v=>({label: v[0], value:v[2]}))
});

const listData = computed(()=>{
    const dictFields: {[field:string]: ItemData[] } = {};

    for(let data of tensorData.value.tensor){
        const field = data[0];
        if(!dictFields[field]){
            dictFields[field] = [];
        }

        const item = { fn: data[1], value: data[2] };
        dictFields[field].push(item);
    }

    const listData = Object.keys(dictFields).sort().map(field=>{
        return {
            field,
            fns: dictFields[field].sort((left, right)=>left.fn.localeCompare(right.fn))
        }
    });

    return listData.map(data=>{
        // 时间需要区别对待
        if(data.field === "采集时间"){
            for(let fs of data.fns){
                if(fs.fn === "min" || fs.fn === "max"){
                    const tmValue = DateTime.fromMillis(Number(fs.value));
                    fs.value = tmValue.toFormat("yyyy-MM-dd HH:mm:ss");
                }
            }
        }
        
        return data;
    });
})
</script>