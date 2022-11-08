<style scoped lang="scss">
@use "../theme.scss";

.container{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em 0;
}

.check-item{
    flex-direction: row;
}

.links{
    display: flex;
    justify-content: space-around;
    a{
        margin: 4px;
    }
}
.version{
    
    display: grid;
    grid-template-columns: 1fr 1fr;
    span:nth-of-type(2n+1){
        font-weight: bold;
    }span:nth-of-type(2n){
        margin-left: 1em;
        font-style: italic;
    }
}
.dev-test{
    flex-flow: row nowrap;
    align-items: center;
    gap: 1em;
}

.em{
    color: theme.$color-em;
    font-weight: bold;
}
</style>

<template>
    <div class="container">
        <img src="/img/ta.png" class="hue-205"/>
        <span>{{widthViewPort}} x {{heightViewPort}}</span>
        <span>({{data.pixelSize.value}} @ {{devPixelRatio}})</span>
        <div class="version" >
            <template v-for="(v,k) in agents">
                <span>{{k}}</span>
                <span>{{v}}</span>
            </template>
            <span>Worker</span><span>{{IsWorkerSupported?"Supported":"NA"}}</span>
            <span>SharedWorker</span><span>{{IsSharedWorkerSupported?"Supported":"NA"}}</span>
            <span>WorkerMode</span><span>{{store.WorkerMode}}</span>
        </div>
        <hr />
        <div class="dev-test">
            <span class="em">{{store.Count}}</span>
            <button @click="store.increment">Click</button>
        </div>
        <hr />
        <div class="check-item">
            <input type="checkbox" v-model="data.IsDevChecked.value"/>
            <span>显示开发设定</span>
        </div>
        <router-view></router-view>
        <DatePicker />
        <div style="min-height: 10em"></div>
    </div>
</template>

<script setup lang="ts">
import { useAboutStore } from '@store';
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";

import DatePicker from "../cmx/DatePicker.vue";

const widthViewPort = ref(window.innerWidth);
const heightViewPort = ref(window.innerHeight);
const devPixelRatio = window.devicePixelRatio.toFixed(2);
const agents:any = ref({});
const IsWorkerSupported = !!window.Worker;
const IsSharedWorkerSupported = !!window.SharedWorker;

const store = useAboutStore();

class AboutPage {
    private _router = useRouter();
    public IsDevChecked = ref(false);

    public init = ()=>{
        watch(this.LinkForView, (value, last)=>{
            this._router.push(value);
        });

        addEventListener("resize", ()=>{
            widthViewPort.value = window.innerWidth;
            heightViewPort.value = window.innerHeight;
        });

        this.parseUserAgent();
    }

    public pixelSize = computed(()=>{
        const w = widthViewPort.value * window.devicePixelRatio;
        const h = heightViewPort.value * window.devicePixelRatio;
        return `${w.toFixed(0)} x ${h.toFixed(0)}`;
    });

    public LinkForView = computed(()=>{
        return this.IsDevChecked.value?"/About/dev":"/About";
    });

    private parseUserAgent = ()=>{
        const match = navigator.userAgent.matchAll(/(\w+)\/([\d\.]+)/g);
        for(let m of match){
            if(m[1].startsWith("Ver")) continue;
            agents.value[m[1]] = m[2];
            
        }
    };
};

const data = new AboutPage();
onMounted(data.init);
</script>