<script setup lang="ts">
    import { ref, reactive, onMounted, shallowReactive } from 'vue';

    class HomePage{
        readonly text = "Hello Vue3!";
        count = ref(0);
        jsonFields:{ [key:string]: {desc?:string, description?:string}} = shallowReactive({});

        init = async()=>{
            const resp = await fetch("/api/fields");
            const data = await resp.json();
            Object.assign(this.jsonFields, data.fields);
        };

        onClick = (e: MouseEvent)=>{
            this.count.value++;
        }
    };

    const home = new HomePage();
    onMounted(home.init);

</script>

<template>
    <div class="container-fluid">
        <div class="row align-items-center bg-dark text-light">
            <!--Top-->
            <div class="col"><h1 class="text-center">TensorAnalyzor</h1></div>
        </div>
        <div class="row">
            <div class="col-md-2 left-menu" >
                <!--Left-->
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">分析结果</li>
                    <li class="list-group-item">任务管理</li>
                    <li class="list-group-item">创建新任务</li>
                    <li class="list-group-item">About</li>
                </ul>
            </div>
            <div class="col">
                <!--right-->
                <div class="row justify-content-center">
                    <div class="col col-md-auto">
                        <table class="table table-sm table-hover">
                            <tbody>
                                <tr v-for="(v, k) in home.jsonFields">
                                    <td>{{v.desc??k}}</td>
                                    <td><span class="badge rounded-pill text-bg-primary">{{k}}</span></td>
                                    <td>{{v.description}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="row justify-content-md-center mt-3">
                    <div class="col-md-auto">
                            <p>{{home.text}} => <span class="ss">{{home.count}}</span></p>
                            <button v-on:click="home.onClick" class="btn btn-primary">Click Me!</button><br/>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<style scoped lang="scss">
    @import "theme.scss";
    .left-menu{
        background-color: $light;
        li{
            background-color: $light;
        }
    }
    .ss{
        color: crimson;
        font-weight: bolder;
    }
</style>