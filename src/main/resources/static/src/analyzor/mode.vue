<style scoped lang="scss">
    @import "../theme.scss";

</style>

<template>
    <div class="row mt-2">
        <div class="col col-md-3">
            <div class="card border-success">
                <div class="card-header">数值分布</div>
                <div class="card-body">
                    <p class="card-text">分析一个指标的数值分布情况,对指标值进行区间计数统计,看看哪些区间的数据比较多,哪些比较少</p>
                    <button class="btn btn-sm btn-success float-end" @click="pageObj.clickMode1">OK</button>
                </div>
                </div>
        </div>

        <div class="col col-md-3">
            <div class="card border-success">
                <div class="card-header">单值地理分布</div>
                <div class="card-body">
                    <p class="card-text">分析一个指标在地理维度上的分布情况,</p>
                    <button class="btn btn-sm btn-success float-end disabled">OK</button>
                </div>
                </div>
        </div>

        <div class="col col-md-3">
            <div class="card border-success">
                <div class="card-header">多数值地理分布</div>
                <div class="card-body">
                    <h5 class="card-title"></h5>
                    <p class="card-text">将多个指标进行混合运算后,再进行地理分布分析</p>
                    <button class="btn btn-sm btn-success float-end disabled">OK</button>
                </div>
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, inject } from 'vue';
    import { useRouter } from 'vue-router';
    
    class AnalyzorMode{
        private _router = useRouter();

        clickMode1 = ()=>{
            const step1 = `${this._router.currentRoute.value.path}/step1`;
            this._router.push(step1);
        };
    }

    const pageObj = new AnalyzorMode();
</script>