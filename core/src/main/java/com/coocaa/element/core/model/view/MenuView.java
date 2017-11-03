package com.coocaa.element.core.model.view;

import java.io.Serializable;

/**
 * Created by panwei on 16/10/17.
 */
public class MenuView implements Serializable {
    private Integer id; // 编号
    private Integer parentId; // 父级编号
    private String name; // 名称
    private Integer sort; // 排序
    private String href; // 链接
    private String icon; // 图标
    private Integer isShow; // 是否在菜单中显示
    private String permission; // 权限标识
    private String parentName; // 父菜单的名称
    private Integer depth; // 菜单深度

    private String fullIcon;

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

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getIsShow() {
        return isShow;
    }

    public void setIsShow(Integer isShow) {
        this.isShow = isShow;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
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

    public String getFullIcon() {
        return fullIcon;
    }

    public void setFullIcon(String fullIcon) {
        this.fullIcon = fullIcon;
    }
}
