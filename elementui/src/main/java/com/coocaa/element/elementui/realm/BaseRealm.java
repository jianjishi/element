package com.coocaa.element.elementui.realm;

import com.coocaa.element.elementui.utils.LoginUtils;
import org.apache.log4j.Logger;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

public abstract class BaseRealm extends AuthorizingRealm{

    @Autowired
    LoginUtils utils;

    Logger logger = Logger.getLogger(this.getName());

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String loginName = (String) principals.getPrimaryPrincipal();
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        Set<String> roleNames = utils.getRoleNamesBy(loginName);
        authorizationInfo.setRoles(roleNames);
        Set<String> permissionName = utils.getPermissionsBy();
        authorizationInfo.setStringPermissions(permissionName);
        return authorizationInfo;
    }

    public void clear(PrincipalCollection principals){
        clearCachedAuthorizationInfo(principals);
    }

    @Override
    protected void clearCachedAuthorizationInfo(PrincipalCollection principals) {
        System.out.println("清除【授权】缓存之前");
        Cache c = getAuthorizationCache();
        for(Object o : c.keys()){
            System.out.println( o + " , " + c.get(o));
        }
        super.clearCachedAuthorizationInfo(principals);
        System.out.println("清除【授权】缓存之后");
        int cacheSize = c.keys().size();
        System.out.println("【授权】缓存的大小:" + cacheSize);

        for(Object o : c.keys()){
            System.out.println( o + " , " + c.get(o));
        }
        if(cacheSize == 0){
            System.out.println("说明【授权】缓存被清空了。");
        }
    }

}
