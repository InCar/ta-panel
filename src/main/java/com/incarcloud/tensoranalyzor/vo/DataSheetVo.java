package com.incarcloud.tensoranalyzor.vo;

/**
 * 数据表返回对象
 *
 * @author xiaolan, created on 2023/2/6
 * @version 0.1.0-SNAPSHOT
 */
public class DataSheetVo {

    /**
     * 数据表名称
     */
    private String collectionName;
    /**
     * 条数
     */
    private Long collectionCount;
    /**
     * 大小
     */
    private Double collectionSize;

    public String getCollectionName() {
        return collectionName;
    }

    public void setCollectionName(String collectionName) {
        this.collectionName = collectionName;
    }

    public Long getCollectionCount() {
        return collectionCount;
    }

    public void setCollectionCount(Long collectionCount) {
        this.collectionCount = collectionCount;
    }

    public Double getCollectionSize() {
        return collectionSize;
    }

    public void setCollectionSize(Double collectionSize) {
        this.collectionSize = collectionSize;
    }
}
