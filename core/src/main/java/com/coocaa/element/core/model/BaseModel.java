package com.coocaa.element.core.model;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by panwei on 2017/6/8.
 */
public abstract class BaseModel<T> implements Serializable {
    private String createBy; // 创建者
    private Date createDate; // 创建时间
    private String updateBy; // 更新者
    private Date updateDate; // 更新时间
    private String remarks; // 备注信息
    private Integer delFlag; // 删除标记

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Integer getDelFlag() {
        return delFlag;
    }

    public void setDelFlag(Integer delFlag) {
        this.delFlag = delFlag;
    }
}
