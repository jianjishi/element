package com.coocaa.element.core.model.manage;

import java.io.Serializable;

/**
 * Created by panwei on 16/10/17.
 */
public class RoleOffice implements Serializable {
    private Integer roleId; // 角色id
    private Integer officeId; // 机构id

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Integer officeId) {
        this.officeId = officeId;
    }
}
