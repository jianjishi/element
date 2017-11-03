package com.coocaa.element.core.model.manage;

import com.coocaa.element.core.model.BaseModel;

import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public class Role extends BaseModel<Role> {
    private Integer id; // 编号
    private Integer officeId; // 归属部门
    private String name; // 角色名称
    private String enname; // 英文名称
    private String roleType; // 角色类型
    private String isSys; // 是否系统数据
    private Integer useable; // 是否可用

    private List<Integer> menuIds; // 该角色所用的菜单

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Integer officeId) {
        this.officeId = officeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEnname() {
        return enname;
    }

    public void setEnname(String enname) {
        this.enname = enname;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    public String getIsSys() {
        return isSys;
    }

    public void setIsSys(String isSys) {
        this.isSys = isSys;
    }

    public Integer getUseable() {
        return useable;
    }

    public void setUseable(Integer useable) {
        this.useable = useable;
    }

    public List<Integer> getMenuIds() {
        return menuIds;
    }

    public void setMenuIds(List<Integer> menuIds) {
        this.menuIds = menuIds;
    }
}
