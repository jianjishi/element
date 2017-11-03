package com.coocaa.element.elementui.realm;

import com.coocaa.element.core.utils.LdapHelper;
import com.coocaa.element.elementui.utils.LoginUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

public class LdapRealm extends BaseRealm {

    @Autowired
    LoginUtils utils;

    @Autowired
    LdapHelper ldapHelper;

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        String username = token.getUsername();
        String password = String.valueOf(token.getPassword());
        if (ldapHelper.checkUser(username, password)) {
            SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                    username,
                    password,// 密码
                    ByteSource.Util.bytes(""),
                    this.getClass().getName()
            );
            utils.setSession(utils.firstLdapUser(username,password));
            return authenticationInfo;
        }
        return null;
    }
}
