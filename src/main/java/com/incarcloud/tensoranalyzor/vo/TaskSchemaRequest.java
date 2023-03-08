package com.incarcloud.tensoranalyzor.vo;

/**
 * 数据库名和表名
 *
 * @author xiaolan, created on 2023/3/2
 * @version 0.1.0-SNAPSHOT
 */
public class TaskSchemaRequest {
    /**
     * 数据库名称
     */
    private String db;
    /**
     * 数据集
     */
    private String collection;


    public String getDb() {
        return db;
    }

    public void setDb(String db) {
        this.db = db;
    }

    public String getCollection() {
        return collection;
    }

    public void setCollection(String collection) {
        this.collection = collection;
    }
}
