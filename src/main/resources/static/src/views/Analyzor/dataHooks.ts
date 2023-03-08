import { reactive, onMounted, nextTick } from "vue";
import { getTasks } from "@/service/index.ts";

export default function () {
  const taskList = reactive([]);

  const getData = (async () => {
    const res = await getTasks();
    const filterData = res.data.filter((item) => item.finishTime && item.status === '3').sort((a, b)=>{return  b.finishTime - a.finishTime});
    filterData.forEach((item) => {
      const { id, name, finishTime, paramJson, status, resJson } = item;
      const task = {
        id: id,
        name: name,
        finishTime: finishTime,
        op: JSON.parse(paramJson).operator?.op,
        status: status,
        paramArgs: JSON.parse(paramJson),
        resData: resJson ? JSON.parse(resJson) : {}
      };
      taskList.push(task);
    });
  })();
  console.log(taskList, '1122taskList')
  return {
    taskList,
  };
}
