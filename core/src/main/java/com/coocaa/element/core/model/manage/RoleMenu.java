package com.coocaa.element.core.model.manage;

import java.io.Serializable;

/**
 * Created by panwei on 16/10/17.
 */
public class RoleMenu implements Serializable {
    private Integer roleId; // 角色id
    private Integer menuId; // 菜单id

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getMenuId() {
        return menuId;
    }

    public void setMenuId(Integer menuId) {
        this.menuId = menuId;
    }
}
