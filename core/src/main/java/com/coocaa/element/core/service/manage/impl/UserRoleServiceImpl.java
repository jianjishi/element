package com.coocaa.element.core.service.manage.impl;

import com.coocaa.element.core.dao.manage.UserRoleMapper;
import com.coocaa.element.core.model.manage.UserRole;
import com.coocaa.element.core.model.view.UserRoleView;
import com.coocaa.element.core.service.ServicesImpl;
import com.coocaa.element.core.service.manage.RoleService;
import com.coocaa.element.core.service.manage.UserRoleService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
@Service
public class UserRoleServiceImpl extends ServicesImpl<UserRole> implements UserRoleService {
    @Autowired
    UserRoleMapper userRoleMapper;
    @Autowired
    RoleService roleService;

    @Override
    public List<UserRoleView> findViewBy(HashMap<String, Object> params) {
        return userRoleMapper.findViewBy(params);
    }

    @Override
    public void deleteByUserId(Integer userId) {
        userRoleMapper.deleteByUserId(userId);
    }

    @Override
    public void insertUserRole(Integer userId, Integer[] roleIds) {
        userRoleMapper.deleteByUserId(userId);
        for (Integer item : roleIds) {
            UserRole userRole = new UserRole();
            userRole.setUserId(userId);
            userRole.setRoleId(item);
            userRoleMapper.insert(userRole);
        }
    }

    @Override
    public List<Integer> getRoleIdsByUserId(Integer userId) {
        List<Integer> roleIds = new ArrayList<>();
        HashMap<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        List<UserRole> userRoleList = userRoleMapper.findBy(params);
        for (UserRole item : userRoleList) {
            roleIds.add(item.getRoleId());
        }
        return roleIds;
    }

    @Override
    public List<String> getRoleNamesByUserId(Integer userId) {
        List<String> roleNames = new ArrayList<>();
        HashMap<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        List<UserRole> userRoleList = userRoleMapper.findBy(params);
        for (UserRole item : userRoleList) {
            Integer roleId = item.getRoleId();
            String roleName = roleService.getRoleNameByRoleId(roleId);
            if (StringUtils.isNotBlank(roleName)) {
                roleNames.add(roleName);
            }
        }
        return roleNames;
    }

}
