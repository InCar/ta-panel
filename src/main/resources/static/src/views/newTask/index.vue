<template>
  <div v-if="route.name === 'NewTask'" class="task-list">
    <div class="list-item" v-for="(i, k) in listModes" :key="k">
      <div class="title">{{ i.Title }}</div>
      <div class="desc">{{ i.Description }}</div>
      <Button class="btn" type="primary" :active="!i.Active" @click="ok(i)">ok</Button>
    </div>
  </div>
  <v-else>
    <router-view />
  </v-else>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useRouter, useRoute } from 'vue-router';
import { collectionSheetSize } from './service'
import {
        TAMode,
        TAModeBase,
        TAModeDetection, TAModeCount,
        TAModeMultipleGeo, TAModeSingleDistribution, TAModeSingleGeo
    } from "./Modes";

const router = useRouter();
const route = useRoute()

console.log(route.name, 'route.name')

const listModes:Array<TAModeBase> = [
    new TAModeDetection(),
    new TAModeCount(),
    new TAModeSingleDistribution(),
    new TAModeSingleGeo(),
    new TAModeMultipleGeo()
]

collectionSheetSize().then(res => {
  console.log(res)
}).catch(err => console.log(err))

const ok = (i) => {
  console.log(i)
  if(TAMode[i.Mode] === 'Detection') {
    router.push({ name: 'DataSheet' })
  }
}

</script>

<style lang="scss" scoped>
@use '@/assets/scss/theme.scss';
.task-list{
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  // gap:8px;
  grid-template-columns: repeat(auto-fill, 16em);
  grid-gap: 8px;
  .list-item{
    // flex: auto;
    // flex-basis: 16em;
    min-width: 160px;
    width: 16em;
    height: 180px;
    border: 1px solid theme.$color;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    // margin: 8px;
    .title{
      background-color: theme.$color;
      color: theme.$color-bk;
      font-size: 1rem;
      height: 38px;
      line-height: 38px;
      padding: 0 8px;
      font-weight: bold;
    }
    .desc{
        flex-grow:1;
        color: theme.$color;
        font-size: 1rem;
        padding: 8px 16px;
    }
    .btn{
      min-width: 7em;
      margin: 0.5em;
      align-self: flex-end;
      justify-self: end;
      align-self: flex-end;
    }
  }
  i{
    width: 16em;
    margin: 4px;
  }
}
</style>