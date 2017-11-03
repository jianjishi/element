package com.coocaa.element.core.model.manage;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by panwei on 2016/7/9.
 */
public class OperateLog implements Serializable {
    private Integer id;
    private Integer operator;
    private String operation;
    private String operateBefore;
    private String operateAfter;
    private Integer status;
    private Date operateTime;
    private String operateIp;

    private String loginName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOperator() {
        return operator;
    }

    public void setOperator(Integer operator) {
        this.operator = operator;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getOperateBefore() {
        return operateBefore;
    }

    public void setOperateBefore(String operateBefore) {
        this.operateBefore = operateBefore;
    }

    public String getOperateAfter() {
        return operateAfter;
    }

    public void setOperateAfter(String operateAfter) {
        this.operateAfter = operateAfter;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getOperateTime() {
        return operateTime;
    }

    public void setOperateTime(Date operateTime) {
        this.operateTime = operateTime;
    }

    public String getOperateIp() {
        return operateIp;
    }

    public void setOperateIp(String operateIp) {
        this.operateIp = operateIp;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }
}
