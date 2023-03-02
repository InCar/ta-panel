export enum TaskStatus{
  NA,
  Pending, // 待定
  Running, // 运行
  Succeeded, // 完成
  Failed, // 失败
  Canceled, // 取消
  Terminated // 中止
}

export const tastStatus = {
  '3': '完成',
  '6': '中止',
  '5': '取消',
  '4': '失败',
  '2': '运行',
  '1': '待定',
  '0': 'NA'
}