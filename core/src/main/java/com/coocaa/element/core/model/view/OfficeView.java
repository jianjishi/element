package com.coocaa.element.core.model.view;

import java.io.Serializable;

/**
 * Created by panwei on 16/10/17.
 */
public class OfficeView implements Serializable {
    private Integer id; // 编号
    private Integer parentId; // 父级编号
    private String name; // 名称
    private Integer sort; // 排序
    private Integer type; // 机构类型
    private String master; // 负责人
    private String email; // 邮箱
    private Integer useable; // 是否启用
    private String parentName; // 上级机构的名称
    private Integer depth; // 机构深度

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getMaster() {
        return master;
    }

    public void setMaster(String master) {
        this.master = master;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getUseable() {
        return useable;
    }

    public void setUseable(Integer useable) {
        this.useable = useable;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
    }
}
