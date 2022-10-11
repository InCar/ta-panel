<style scoped lang="scss">
@import "../theme.scss";
.container{
    align-self: flex-start;
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    gap: 8px;
}
.x-item{
    border: 1px solid $dark;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 16em;
    .title{
        font-weight: 600;
        color: $dark;
        background-color: $light;
        border-bottom: 1px solid $dark;
        align-self: stretch;
        padding: 4px;
    }
    .content{
        margin: 0.5em;
        flex-grow: 1;
    }
    .footer{
        min-width: 7em;
        margin: 0.5em;
        align-self: flex-end;
        justify-self: end;
        &.disabled{
            color: silver;
            background-color: gray;
            cursor: not-allowed;
        }
    }
}
</style>

<template>
    <div class="container">
        <div class="x-item">
            <span class="title">数值分布</span>
            <span class="content">分析一个指标的数值分布情况,对指标值进行区间计数统计,看看哪些区间的数据比较多,哪些比较少</span>
            <button class="footer" @click="pageObj.clickMode1">OK</button>
        </div>
        <div class="x-item">
            <span class="title">单值地理分布</span>
            <span class="content">分析一个指标在地理维度上的分布情况</span>
            <button class="footer disabled">OK</button>
        </div>
        <div class="x-item">
            <span class="title">多数值地理分布</span>
            <span class="content">将多个指标进行混合运算后,再进行地理分布分析</span>
            <button class="footer disabled">OK</button>
        </div>
    </div>
</template>

<script setup lang="ts">
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