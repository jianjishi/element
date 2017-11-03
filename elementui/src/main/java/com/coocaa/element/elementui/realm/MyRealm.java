package com.coocaa.element.elementui.realm;

import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.service.manage.UserService;
import com.coocaa.element.elementui.utils.LoginUtils;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import org.apache.shiro.authc.*;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 17/1/10.
 */
public class MyRealm extends BaseRealm {

    @Autowired
    UserService userService;

    @Autowired
    LoginUtils utils;

    /**
     * 身份认证
     * Subject currentUser = SecurityUtils.getSubject(); currentUser.login(token); --调用login方法时就会调用该方法
     *
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        String username = token.getUsername();
        HashMap<String, Object> params = new HashMap<>();
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        params.put("loginName", username);
        List<User> userList = userService.findBy(params);
        if (userList.size() > 0) {
            User user = userList.get(0);
            if (user != null) {
                if (user.getLoginFlag().equals(0)) {
                    throw new LockedAccountException();
                }
                SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                        user.getLoginName(),
                        user.getPassword(),// 密码
                        ByteSource.Util.bytes(user.getSalt()),//salt
                        this.getClass().getName()
                );
                utils.setSession(user);
                return authenticationInfo;
            }
        }
        return null;
    }

}
