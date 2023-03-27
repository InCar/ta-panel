import { reactive, onMounted, nextTick } from "vue";
import { getTasks } from "@/service/index";

export default function () {
  const taskList = reactive([]);

  const getData = (async () => {
    function isJsonString(str) {
      try {
        if (typeof JSON.parse(str) == "object") {
          return true;
        }
      } catch (e) {}
      return false;
    }
    const res:any = await getTasks();
    const filterData = res.data
      .filter((item) => item.finishTime && item.status === "3")
      .sort((a, b) => {
        return b.finishTime - a.finishTime;
      });
    filterData.forEach((item) => {
      const { id, name, finishTime, paramJson, status, resJson } = item;
      const task = {
        id: id,
        name: name,
        finishTime: finishTime,
        op: JSON.parse(paramJson).operator?.op,
        status: status,
        paramArgs: JSON.parse(paramJson),
        resData: isJsonString(resJson) ? JSON.parse(resJson) : {},
      };
      taskList.push(task);
    });
  })();
  return {
    taskList,
  };
}
