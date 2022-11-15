<style lang="scss">
@use "../theme.scss";

.bar-chart{
    align-items: center;
    padding: 1em;
    svg{
        fill: theme.$color-bk-2nd;
        path{
            stroke: theme.$color;
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
import { onMounted, ref } from 'vue';
import * as d3  from "d3";
import { computed } from '@vue/reactivity';

const props = defineProps<{
    data: Array<{x:number, y:number}>
}>();

const logicWidth = ref(500);
const logicHeight = ref(200);

const logicBox = computed(()=>{ return `0 0 ${logicWidth.value} ${logicHeight.value}`});

const render = (data:Array<{x:number, y:number}>)=>{
    const holder = d3.select(".bar-chart");

    const width = logicWidth.value;
    const height = logicHeight.value;
    const marginLeft = 40;
    const marginBottom = 20;
    const margin = 8;

    // 计算极值区间
    const extX = d3.extent(data, d=>d.x) as [number, number];

    // x值映射函数
    const fnScaleX = d3.scaleLinear()
        .domain([extX[0], extX[1]])
        .range([marginLeft, width-margin]);
    
    // y值映射函数
    const fnScaleY = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.y) as number])
        .range([height-marginBottom, margin]);
    
    // 坐标轴
    const axisX = d3.axisBottom(fnScaleX);
    const axisY = d3.axisLeft(fnScaleY);

    // 图形计算函数
    const fnArea:any = d3.area().curve(d3.curveMonotoneX)
        .x((d:any)=>fnScaleX(d.x))
        .y1((d:any)=>fnScaleY(d.y))
        .y0(d=>fnScaleY(0));
    
    const svg = holder.select("svg");
    svg.append("g")
        .attr("transform", `translate(0, ${height-marginBottom})`)
        .call(axisX);
    svg.append("g")
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(axisY);
    svg.append("path")
       .datum(data)
       .attr("d", fnArea);
    
    if(data.length === 0){
        svg.append("text")
            .attr("x", (width-marginLeft)/2)
            .attr("y", (height-marginBottom)/2)
            .attr("class", "error-message")
            .text("无数据");
    }
};

onMounted(()=>{
    render(props.data);
});
</script>