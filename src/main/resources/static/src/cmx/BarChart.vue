<style scoped lang="scss">
@use "../theme.scss";

.bar-chart{
    align-items: center;
    padding: 1em;
    svg{
        fill: theme.$color-bk-2nd;
        stroke: theme.$color;
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
import { ref, computed, onMounted } from "vue";
import * as d3  from "d3";

interface ItemData{
    fn: string;
    value: number;
}

interface ListItemData{
    field: string,
    fns: ItemData[]
}

const props = defineProps<{
    data: Array<ListItemData>
}>();

const logicWidth = ref(500);
const logicHeight = ref(200);

const logicBox = computed(()=>{ return `0 0 ${logicWidth.value} ${logicHeight.value}`});

const render = (listData: ListItemData[])=>{
    const holder = d3.select(".bar-chart");

    const width = logicWidth.value;
    const height = logicHeight.value;
    const marginLeft = 40;
    const marginBottom = 20;
    const margin = 8;

    let barWidth = 20;
    let barGap = 5;

    let dataForBar:number[] = [];
    listData.forEach(x=>{
        dataForBar = dataForBar.concat(x.fns.map(y=>y.value));
    });
    const factor = 5.5;
    dataForBar = dataForBar.map(x=>{
        if(x > 2.7) return factor*Math.log(x);
        else if(x >= -2.7) return 1;
        else return factor*Math.log(-x);
    });

    const count = dataForBar.length;
    const totalBarWidth = barWidth*count + barGap*(count-1);
    const blankWidth = width - totalBarWidth - marginLeft*2;
    const max = Math.max(...dataForBar);
    const ratioY = (height - marginBottom - margin)/max;

    let leftStartPos = marginLeft;
    if(blankWidth > 0)
        leftStartPos += blankWidth/2.0;
    else{
        // TODO: too width to fit
    }

    const svg = holder.select("svg");

    svg.selectAll("rect")
        .data(dataForBar)
        .join("rect")
        .attr("x", (d, i)=>leftStartPos+(barWidth+barGap)*i)
        .attr("y", d=>height-marginBottom-d*ratioY)
        .attr("width", barWidth)
        .attr("height", d=>d*ratioY)
        

    /*svg.append("text")
        .attr("x", (width-marginLeft)/2)
        .attr("y", (height-marginBottom)/2)
        .attr("class", "error-message")
        .text("label");*/
}

onMounted(()=>{
    render(props.data);
});
</script>