<style scoped lang="scss">
@use "../theme.scss";
.theme-main{
    justify-content: center;
    min-width: 6em;
    .menu{
        border: 1px dotted theme.$color;
        :nth-child(n+1){
            color: theme.$color;
            background-color: theme.$color-bk;
            border-bottom: 1px dotted;
            padding: 4px 8px;
            text-align: center;
            &:hover{
                color: theme.$color-bk;
                background-color: theme.$color;
            }
        }
        :last-child{
            border-bottom: none;
        }
    }
}

</style>

<template>
    <div class="theme-main" :class="activeTheme">
        <div class="box-color">
            <Dropdown ref="dropdownMenu">
                <span class="mobile-none">{{activeThemeCaption}}</span>
                <template v-slot:menu>
                    <div class="menu">
                        <span v-for="(v,k) in dictThemes" :class="k" @click="onClick(k as string)">{{v}}</span>
                    </div>
                </template>
            </Dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { ref, Ref } from "vue";
import Dropdown from "./Dropdown.vue";

const emit = defineEmits<{(e:"on-theme", theme:string):void}>();

const dropdownMenu = ref<InstanceType<typeof Dropdown>|null>(null);

const dictThemes = ref<{[k:string]:string}>({
    "theme": "默认主题",
    "theme-black": "纯黑风格"
});

const activeTheme = ref("theme");

const activeThemeCaption = computed(()=>{
    return dictThemes.value[activeTheme.value];
});

const onClick = (theme:string)=>{
    if(activeTheme.value != theme){
        activeTheme.value = theme;
        emit("on-theme", theme);
    }
    dropdownMenu.value?.closeMenu();
}

</script>