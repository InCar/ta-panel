<style scoped lang="scss">
@use '@/assets/scss/theme.scss';
.frame {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: theme.$color;
  background-color: theme.$color-bk;
  .frame-header {
    width: 100%;
    height:8vh;
    line-height: 8vh;
    background-color: theme.$color;
    color: theme.$color-bk-2nd;
    display: flex;
    font-size: 1rem;
    .logo {
      margin-top: 1vh;
      max-height: 8vh;
      margin-left: 2vw;
    }
    .title {
      font-size: 2.2rem;
      margin: 0 auto;
      text-align: center;
      flex-grow: 1;
    }
    .theme{
      align-self: center;
      margin-right: 2vw;
      display: flex;
      align-items: center;
      height: 38px;
      line-height: 38px;
      min-width: 90px;
    }
  }
  .frame-body {
    left: 100px;
    display: flex;
    flex: 1;
      overflow: hidden;

    .body-left {
      width: 15vw;
      // transition: 0.2s width ease-in;
      min-width: 50px;
      max-width: 150px;
      background-color: theme.$color-bk-2nd;;
      color: theme.$color;
      font-size: 1rem;
      .menu-list {
        a {
          text-decoration: none;
        }
        .list-item {
          height: 32px;
          line-height: 40px;
          vertical-align: middle;
          padding: 0 15px;
          color: theme.$color;
          border-bottom: 1px solid theme.$color;
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;
          visibility: visible;
          &:hover {
            background-color: theme.$color-bk !important;
          }
          .item-text {
            margin-left: .5vw;
            font-size: 14px;
          }
          .none{
            visibility: hidden;
          }
          

          .trans{
            -webkit-transition: 0.2s ease-in;
            -moz-transition: 0.2s ease-in;
            -o-transition: 0.2s ease-in;
            -ms-transition: 0.2s ease-in;
            transition: 0.2s ease-in;
          }
          .material-symbols-outlined{
            font-size: 1.4rem;
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
          }
          &.router-link-active {
            font-weight: bold;
            background-color: theme.$color-bk;
            .material-symbols-outlined{
                font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
            }
          }
        }
        // &:not(:last-child) {
        //   border-bottom: 1px solid theme.$color;
        // }
      }
    }

    .collapse{
      width: 50px;
      transition: 0.5s width ease-in;
    }

    .body-right {
      flex: 1;
      height: 100%;
      background-color: theme.$color-bk;
      overflow: hidden;
      position: relative;
      .breadcrumb-row{
        .collapse-icon {
          position: absolute;
          left: 14px;
          top: 8px;
          cursor: pointer;
          color: theme.$color;
          &:hover{
            color: theme.$color-2nd;
          }
        }
      }
      .el-breadcrumb {
        height: 30px;
        line-height: 30px;
        padding: 5px 20px 5px 40px;
      }
      .page-container {
        padding: 10px 20px 20px;
        height: calc((100% - 70px));
        overflow: auto;
      }
    }
  }
  .frame-footer {
    height: 1.3rem;
    line-height: 1.3rem;
    background-color: theme.$color;
    color: theme.$color-2nd;
    font-size: 1rem;
    text-align: center;
  }
}
li.down-item{
  height: 28px;
  line-height: 28px;
  padding: 5px 8px;
  color: #fff;
  border: 1px dashed theme.$color;
  &:hover{
    background-color: theme.$color-em;
  }
  &.selected{
    background-color: theme.$color-em;
  }
  &:not(:first-child) {
    border-top: none;
  }
}
</style>

<template>
  <div class="frame" :class="activeTheme">
    <div class="frame-header">
      <img class="logo" src="/favicon.ico" />
      <div class="title">TensorAnalyzor</div>
      <div class="theme">
        <Dropdown ref="dropdownMenu">
          <template #title>
            <span>{{ curTheme }}</span>
          </template>
          <template #menu>
            <li v-for="(v, k) in dictThemes" class="down-item" :class="{'selected': activeTheme === k}" @click="selectTheme(v, k)">{{ v }}</li>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="frame-body">
      <div class="body-left" id="menu" :class="{'collapse': (isCollapse || device === 'mobile')}">
        <ul class="menu-list">
          <template v-for="r in listRoutes">
            <router-link
              :to="r"
              v-slot="{ href, route, navigate, isActive, isExactActive }"
            >
              <li ref="menu" class="list-item" :class="[isActive && 'router-link-active']">
                <span id="icon" class="material-symbols-outlined">{{r.meta['icon']}}</span>
                <span id="text" class="item-text trans" :class="{'none' :(isCollapse || device === 'mobile')}">{{ r.meta["title"] }}</span>
                <Tooltip v-if="isCollapse || device === 'mobile'">
                  <template #content>
                    {{ r.meta["title"] }}
                  </template>
                </Tooltip>
              </li>
            </router-link>
          </template>
        </ul>
      </div>
      <div class="body-right">
        <div class="breadcrumb-row">
          <!-- <span class="material-symbols-outlined">tenancy</span>
           -->
           <a v-if="device === 'desktop'" class="collapse-icon" @click="onCollapse">
            <!-- <span class="material-symbols-outlined">menu_open</span>
             -->
             <el-icon v-if="isCollapse"><Expand /></el-icon>
             <el-icon v-else><Fold /></el-icon>
           </a>
          <Breadcrumb />
        </div>
        <div class="page-container">
          <router-view />
        </div>
      </div>
    </div>
    <div class="frame-footer">英卡科技 dev50.161@4030930</div>
  </div>
</template>

<script setup lang="ts">
import { id } from "element-plus/es/locale";
import { ref, reactive, nextTick, onUnmounted, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";

const dictThemes = reactive({
  'theme': '默认主题',
  'theme-black': '纯黑风格',
  'theme-green': '英卡青绿'
})

const activeTheme = ref("theme");
const localTheme = localStorage.getItem('themeName')

activeTheme.value =  localTheme ? localTheme : 'theme'

const dropdownMenu = ref<HTMLDivElement|null>(null);
nextTick(() => {
  console.log(dropdownMenu.value, 'dropdownMenu')
})
const curTheme = ref('默认主题')
curTheme.value = dictThemes[activeTheme.value]

const listRoutes = useRouter()
  .getRoutes()
  .filter((x) => !x.meta["hidden"]);
  console.log(listRoutes, "listRoutes");

const selectTheme = (v, k) => {
  curTheme.value = v
  activeTheme.value = k;
  console.log(activeTheme.value, 'activeTheme')
  console.log(dropdownMenu.value, 'dropdownMenu.value')
  dropdownMenu.value?.closeMenu()
  console.log(dropdownMenu.value.childNodes,' dropdownMenu.value.childNodes')
  localStorage.setItem('themeName', k)
}

// 展开收起菜单
const isCollapse = ref(false)
const device = ref('')
const { body } = document
const WIDTH = 720
const isMobile = () => {
  const rect = body.getBoundingClientRect()
  if(rect.width < WIDTH) {
    device.value = 'mobile'
  } else {
    device.value = 'desktop'
  }
}
isMobile()
const onCollapse = () => {
  isCollapse.value = !isCollapse.value
}
const resize = window.addEventListener('resize', isMobile)

onUnmounted(() => {
  window.removeEventListener('resize', isMobile)
})

const menu = ref(null)
nextTick(() => {
  console.log(menu.value, 'menu')
  menu.value.forEach(element => {
    element.addEventListener('mouseover', (e) => {
      console.log(element, 'element')
      console.log(e.target.id, 'e.target.id')
      if (element.lastChild && element.lastChild.style) {
        element.lastChild.style.visibility = 'visible'
      }
    })
    element.addEventListener('mouseout', (e) => {
      console.log(element)
      if (element.lastChild && element.lastChild.style) {
        element.lastChild.style.visibility = 'hidden'
      }
    })
  })
})
</script>
