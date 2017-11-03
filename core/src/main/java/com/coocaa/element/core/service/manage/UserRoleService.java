package com.coocaa.element.core.service.manage;

import com.coocaa.element.core.model.manage.UserRole;
import com.coocaa.element.core.model.view.UserRoleView;
import com.coocaa.element.core.service.Services;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface UserRoleService extends Services<UserRole> {
    List<UserRoleView> findViewBy(HashMap<String, Object> params);
    void deleteByUserId(Integer userId);

    void insertUserRole(Integer userId, Integer[] roleIds);

    List<Integer> getRoleIdsByUserId(Integer userId);

    List<String> getRoleNamesByUserId(Integer userId);
}
