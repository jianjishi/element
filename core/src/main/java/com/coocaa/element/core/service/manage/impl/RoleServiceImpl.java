package com.coocaa.element.core.service.manage.impl;

import com.coocaa.element.core.dao.manage.RoleMapper;
import com.coocaa.element.core.model.manage.Role;
import com.coocaa.element.core.service.ServicesImpl;
import com.coocaa.element.core.service.manage.RoleService;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
@Service
public class RoleServiceImpl extends ServicesImpl<Role> implements RoleService {
    @Autowired
    RoleMapper roleMapper;

    @Override
    public String getRoleNameByRoleId(Integer roleId) {
        Role role = roleMapper.getEntityById(roleId);
        if (role != null) {
            return role.getName();
        }
        return null;
    }

    @Override
    public List<Role> getRoleList() {
        HashMap<String, Object> params = new HashMap<>();
        params.put("useable", 1);
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        return roleMapper.findBy(params);
    }

    @Override
    public boolean validateRoleParams(HashMap<String, Object> rtn, Role role, Integer[] menuIds) {
        if (role != null) {
            String name = role.getName();
            Integer useable = role.getUseable();
            if (StringUtils.isBlank(name) || useable == null) {
                rtn.put("msg", "请填写完整");
                return false;
            }
            if (menuIds == null || menuIds.length == 0) {
                rtn.put("msg", "请选择权限");
                return false;
            }
            HashMap<String, Object> params = new HashMap<>();
            params.put("name", name);
            List<Role> roleList = roleMapper.findBy(params);
            Integer id = role.getId();
            if (id == null) { // add
                if (roleList.size() > 0) {
                    rtn.put("msg", "该角色已存在");
                    return false;
                }
            } else { // update
                if (roleList.size() > 0) {
                    if (roleList.get(0).getId() != role.getId()) {
                        rtn.put("msg", "该角色已存在");
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
}
