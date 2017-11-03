package com.coocaa.element.core.dao.manage;

import com.coocaa.element.core.dao.Mappers;
import com.coocaa.element.core.model.manage.RoleMenu;
import com.coocaa.element.core.model.view.RoleMenuView;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface RoleMenuMapper extends Mappers<RoleMenu> {
    List<RoleMenuView> findViewBy(HashMap<String, Object> params);
    void deleteByRoleId(Integer roleId);
}
