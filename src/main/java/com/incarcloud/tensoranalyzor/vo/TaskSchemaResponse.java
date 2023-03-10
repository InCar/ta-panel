package com.incarcloud.tensoranalyzor.vo;

/**
 * 数据分析返回
 *
 * @author xiaolan, created on 2023/3/2
 * @version 0.1.0-SNAPSHOT
 */
public class TaskSchemaResponse {
    /**
     * 任务ID
     */
    private String taskId;
    /**
     * 错误信息
     */
    private String errorMsg;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}
