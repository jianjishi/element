package com.coocaa.element.core.service.manage.impl;

import com.coocaa.element.core.dao.manage.UserMapper;
import com.coocaa.element.core.service.ServicesImpl;
import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.service.manage.UserService;
import com.coocaa.magazine.utils.ValidateUtil;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

/**
 * Created by panwei on 16/10/17.
 */
@Service
public class UserServiceImpl extends ServicesImpl<User> implements UserService {
    @Autowired
    UserMapper userMapper;

    @Override
    public boolean validateUserParams(HashMap<String, Object> rtn, User user, Integer[] roleIds) {
        if (user != null) {
            String name = user.getName(), loginName = user.getLoginName(), email = user.getEmail(), password = user.getPassword();
            Integer officeId = user.getOfficeId(), loginFlag = user.getLoginFlag();
            if (StringUtils.isBlank(name) || StringUtils.isBlank(loginName) || StringUtils.isBlank(email)
                    || roleIds == null || roleIds.length == 0 || loginFlag == null || officeId == null) {
                rtn.put("msg", "请填写完整");
                return false;
            }
            if (!ValidateUtil.isValidSkyWorthCoocaaEmail(email)) {
                rtn.put("msg", "邮箱格式不对");
                return false;
            }
            if (!StringUtils.isBlank(password)) {
                if (password.length() < 6 && password.length() > 14) {
                    rtn.put("msg", "密码必须在6-14位之间");
                    return false;
                }
            }
            HashMap<String, Object> params = new HashMap<>();
            params.put("email", email);
            params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
            List<User> userListForEmail = userMapper.findBy(params);
            params = new HashMap<>();
            params.put("name", name);
            params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
            List<User> userListForName = userMapper.findBy(params);
            params = new HashMap<>();
            params.put("loginName", loginName);
            params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
            List<User> userListForLoginName = userMapper.findBy(params);

            Integer id = user.getId();
            if (id == null) { // add
                if (StringUtils.isBlank(password)) {
                    rtn.put("msg", "密码不能为空");
                    return false;
                }
                if (userListForName.size() > 0) {
                    rtn.put("msg", "该姓名已存在");
                    return false;
                }
                if (userListForLoginName.size() > 0) {
                    rtn.put("msg", "该账号已被注册过");
                    return false;
                }
                if (userListForEmail.size() > 0) {
                    rtn.put("msg", "该邮箱已被注册过");
                    return false;
                }

            } else { // update
                if (userListForName.size() > 0) {
                    if (!Objects.equals(id, userListForName.get(0).getId())) {
                        rtn.put("msg", "该姓名已存在");
                        return false;
                    }
                }
                if (userListForLoginName.size() > 0) {
                    if (!Objects.equals(id, userListForLoginName.get(0).getId())) {
                        rtn.put("msg", "该账号已被注册过");
                        return false;
                    }
                }
                if (userListForEmail.size() > 0) {
                    if (!Objects.equals(id, userListForEmail.get(0).getId())) {
                        rtn.put("msg", "该邮箱已被注册过");
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    @Override
    public Integer getUserId(String loginName) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("loginName", loginName);
        List<User> userList = userMapper.findBy(params);
        if (userList.size() > 0) {
            return userList.get(0).getId();
        }
        return null;
    }

    @Override
    public String getUserName(Integer userId) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("id", userId);
        List<User> userList = userMapper.findBy(params);
        if (userList.size() > 0) {
            return userList.get(0).getName();
        }
        return null;
    }
}
