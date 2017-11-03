package com.coocaa.element.core.service.manage;

import com.coocaa.element.core.service.Services;
import com.coocaa.element.core.model.manage.User;

import java.util.HashMap;

/**
 * Created by panwei on 16/10/17.
 */
public interface UserService extends Services<User> {
    boolean validateUserParams(HashMap<String, Object> rtn, User user, Integer[] roleIds);

    Integer getUserId(String loginName);

    String getUserName(Integer userId);
}
