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

const calcForBar = (totalWidth:number, count:number)=>{
    let barWidth = 20;
    let barGap = 25;

    const fnCalcBlankWidth = (barWidth:number, barGap:number)=>{
        const totalBarWidth = barWidth*count + barGap*(count-1);
        return (totalWidth - totalBarWidth);
    }
    let blankWidth = fnCalcBlankWidth(barWidth, barGap);
    if(blankWidth >= 0) return [barWidth, barGap];

    
    // 空间不够
    if(totalWidth >= barWidth*count){
        // 缩小barGap可以满足
        barGap = Math.floor((totalWidth - barWidth*count)/(count-1));
        return [barWidth, barGap];
    }
    else{
        // 不留barGap了
        barGap = 0;
        barWidth = totalWidth / count;
        if(barWidth < 1) barWidth = 1;
        return [barWidth, barGap];
    }
}

const render = (listData: ItemData[])=>{
    const holder = d3.select(".bar-chart");

    const width = logicWidth.value;
    const height = logicHeight.value;
    const marginLeft = 8;
    const marginBottom = 25;
    const margin = 8;

    const count = listData.length;
    const totalBarSpace = width-marginLeft-margin;
    const [barWidth, barGap] = calcForBar(totalBarSpace, count);
    
    let leftStartPos = marginLeft;
    const totalBarWidth = barWidth*count + barGap*(count-1);
    const blankWidth = totalBarSpace - totalBarWidth;
    if(blankWidth > 0){
        leftStartPos += blankWidth/2;
    }

    const max = Math.max(...listData.map(x=>x.value));
    const ratioY = (height - marginBottom - margin)/max;

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
        .attr("x", (d, i)=>leftStartPos+(barWidth+barGap)*i + (barGap > 8 ? 0 : 0))
        .attr("y", (d, i)=>height-15 + (barGap > 8 ? 0 : 10*(i%2)))
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