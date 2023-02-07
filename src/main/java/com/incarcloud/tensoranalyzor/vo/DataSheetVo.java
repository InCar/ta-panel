package com.incarcloud.tensoranalyzor.vo;

/**
 * 数据表返回对象
 *
 * @author xiaolan, created on 2023/2/6
 * @version 0.1.0-SNAPSHOT
 */
public class DataSheetVo {
    /**
     * 条数
     */
    private Integer collectionCount;
    /**
     * 大小
     */
    private Double collectionSize;

    public Integer getCollectionCount() {
        return collectionCount;
    }

    public void setCollectionCount(Integer collectionCount) {
        this.collectionCount = collectionCount;
    }

    public Double getCollectionSize() {
        return collectionSize;
    }

    public void setCollectionSize(Double collectionSize) {
        this.collectionSize = collectionSize;
    }
}
