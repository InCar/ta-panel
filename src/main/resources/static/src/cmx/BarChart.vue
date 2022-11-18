<style lang="scss">
@use "../theme.scss";

.bar-chart{
    align-items: center;
    padding: 1em;
    svg{
        fill: theme.$color-bk-2nd;
        stroke: theme.$color;

        text.label-sm{
            stroke: none;
            fill: theme.$color;
        }

        text.error-message{
            fill: theme.$color-bk-error;
        }
    }
}
</style>

<template>
    <div class="bar-chart">
        <svg :viewBox="logicBox"></svg>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import * as d3  from "d3";

interface ItemData{
    label: string;
    value: number;
}

const props = defineProps<{
    data: Array<ItemData>
}>();

const logicWidth = ref(500);
const logicHeight = ref(200);

const logicBox = computed(()=>{ return `0 0 ${logicWidth.value} ${logicHeight.value}`});

const listData = computed(()=>{
    const listValues = props.data.map(x=>x.value);
    const min = Math.min(...listValues);
    const max = Math.max(...listValues);
    const range = max - min;

    const fnX = (value:number)=>{ return range==0?100:value*(100/range); }

    return props.data.map((item)=>{
        const value = fnX(item.value);
        return { label: item.label, value };
    });
});

const render = (listData: ItemData[])=>{
    const holder = d3.select(".bar-chart");

    const width = logicWidth.value;
    const height = logicHeight.value;
    const marginLeft = 40;
    const marginBottom = 20;
    const margin = 8;

    let barWidth = 20;
    let barGap = 25;

    const count = listData.length;
    const totalBarWidth = barWidth*count + barGap*(count-1);
    const blankWidth = width - totalBarWidth - marginLeft*2;

    const max = Math.max(...listData.map(x=>x.value));
    const ratioY = (height - marginBottom - margin)/max;

    let leftStartPos = marginLeft;
    if(blankWidth > 0)
        leftStartPos += blankWidth/2.0;
    else{
        // TODO: too width to fit
    }

    const svg = holder.select("svg");

    svg.selectAll("rect")
        .data(listData)
        .join("rect")
        .attr("x", (d, i)=>leftStartPos+(barWidth+barGap)*i)
        .attr("y", d=>height-marginBottom-d.value*ratioY)
        .attr("width", barWidth)
        .attr("height", d=>d.value*ratioY);
    
    svg.selectAll("text")
        .data(listData)
        .join("text")
        .text(d=>d.label)
        .attr("x", (d, i)=>leftStartPos+(barWidth+barGap)*i)
        .attr("y", d=>height-4)
        .attr("class", "label-sm")
        .attr("font-size", "0.5em")
    
    if(listData.length === 0){
        svg.append("text")
            .attr("x", (width-marginLeft)/2)
            .attr("y", (height-marginBottom)/2)
            .attr("class", "error-message")
            .text("无数据");
    }
    
}

onMounted(()=>{
    render(props.data);
});
</script>