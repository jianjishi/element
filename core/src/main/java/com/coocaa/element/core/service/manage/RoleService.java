package com.coocaa.element.core.service.manage;

import com.coocaa.element.core.model.manage.Role;
import com.coocaa.element.core.service.Services;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface RoleService extends Services<Role> {
    String getRoleNameByRoleId(Integer roleId);

    List<Role> getRoleList();

    boolean validateRoleParams(HashMap<String, Object> rtn, Role role, Integer[] menuIds);
}
