package com.coocaa.element.core.service.manage;

import com.coocaa.element.core.model.manage.RoleMenu;
import com.coocaa.element.core.model.view.RoleMenuView;
import com.coocaa.element.core.service.Services;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface RoleMenuService extends Services<RoleMenu> {
    List<RoleMenuView> findViewBy(HashMap<String, Object> params);
    void deleteByRoleId(Integer roleId);
    List<HashMap<String, Object>> getMenus(Integer parentId, List<Integer> roleIdList);

    void insertRoleMenu(Integer id, Integer[] menuIds);

    List<Integer> getMenuIdsByRoleId(Integer roleId);
}
