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
</style>

<template>
    <div class="container">
        <img src="/img/ta.png" />
        
        <div class="check-item">
            <input type="checkbox" v-model="data.IsDevChecked.value"/>
            <span>显示开发设定</span>
        </div>
        <router-view></router-view>
        
        <DatePicker />
    </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRouter } from "vue-router";

import DatePicker from "../cmx/DatePicker.vue";

class AboutPage {
    private _router = useRouter();
    public IsDevChecked = ref(false);

    public init = ()=>{
        watch(this.LinkForView, (value, last)=>{
            this._router.push(value);
        });
    }

    public LinkForView = computed(()=>{
        return this.IsDevChecked.value?"/About/dev":"/About";
    });
};

const data = new AboutPage();
onMounted(data.init);
</script>