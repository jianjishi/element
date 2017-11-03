package com.coocaa.element.elementui.credentialsMatcher;

import com.coocaa.magazine.utils.CipherUtil;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;

/**
 * Created by panwei on 17/1/20.
 */
public class CredentialsMatcher extends SimpleCredentialsMatcher {
    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        UsernamePasswordToken usernamePasswordToken = (UsernamePasswordToken) token;
        //获得用户输入的密码:(可以采用加盐(salt)的方式去检验)
        String inPassword = new String(usernamePasswordToken.getPassword());
        // 获得数据库中的密码
        String dbPassword = (String) info.getCredentials();
        // 获取数据库中的盐
        String salt = new String(((SimpleAuthenticationInfo)info).getCredentialsSalt().getBytes());
//        return super.doCredentialsMatch(token, info);
        return this.equals(CipherUtil.md5(inPassword + salt), dbPassword);
    }
}
