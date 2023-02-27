import { computed } from "vue";
import { DateTime } from "luxon"

// 保留两位有效小数
export const toFixedTwo = computed(() => {
  // value是计算属性执行后，再次执行return里面的函数时传的参数
  return (value:any) => {
    if(value && value.toString().split('.')[1].length >= 2) {
      const newValue =  value.toFixed(2)
      return newValue
    } else {
      return value
    }
    
  }
})

// 将毫秒格式转化为日期格式
export const formatDate = computed(() => {
  return (value:number, format:string) => {
    if(value && format) {
      const newDate = DateTime.fromMillis(Number.parseFloat(value + '')).toFormat(format)
      return newDate
    } else {
      return value
    }
  }
})
