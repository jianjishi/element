package com.coocaa.element.core.dao.manage;

import com.coocaa.element.core.dao.Mappers;
import com.coocaa.element.core.model.manage.UserRole;
import com.coocaa.element.core.model.view.UserRoleView;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface UserRoleMapper extends Mappers<UserRole> {
    List<UserRoleView> findViewBy(HashMap<String, Object> params);
    void deleteByUserId(Integer userId);
}
