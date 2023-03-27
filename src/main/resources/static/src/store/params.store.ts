import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useParamsStore = defineStore('params', {
  state: () => {
    const rParams = reactive({})
    const picked = reactive({})
    const limit = ref(10000)
    const setting = reactive({
      mode: '1',
      from: 0,
      step: 10,
      to: 100
    })
    return { rParams, picked }
  }
})
