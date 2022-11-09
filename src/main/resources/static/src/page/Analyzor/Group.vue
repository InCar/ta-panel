<style lang="scss">
.analyzor-group{
    padding: 1em;
    display: flex;
    flex-flow: row wrap;
    gap: 1em;
}
</style>

<template>
    <div class="analyzor-group">
        <AnalyzorBrief v-for="task in listTasks" :task="task" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAnalyzorStore } from "@store";
import { AnalyzorBrief } from "@cmx";

const router = useRouter();
const store = useAnalyzorStore();

const listTasks = computed(()=>{
    const op = router.currentRoute.value.params["group"] as string;
    return store.dictAnalyzorGroups[op];
});

</script>