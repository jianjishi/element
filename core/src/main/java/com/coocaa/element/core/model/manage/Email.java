package com.coocaa.element.core.model.manage;

import com.coocaa.element.core.model.BaseModel;

/**
 * Created by panwei on 16/10/17.
 */
public class Email extends BaseModel<Email> {
    private Integer id; // 编号
    private String emailName; // 邮件
    private Integer type; // 邮件类型
    private Integer status;    // 状态

    private String comment; // 描述

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getEmailName() {
        return emailName;
    }

    public void setEmailName(String emailName) {
        this.emailName = emailName;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
