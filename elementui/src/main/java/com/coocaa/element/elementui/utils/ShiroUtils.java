package com.coocaa.element.elementui.utils;

import com.coocaa.element.elementui.realm.BaseRealm;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.mgt.RealmSecurityManager;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Component;

import java.util.Iterator;

@Component
public class ShiroUtils {

    Logger logger = Logger.getLogger(this.getClass());

    /**
     * 根据角色来重载权限
     *
     * @param roleName
     */
    public void reloadPermissionByRole(String roleName) {
        RealmSecurityManager rsm = (RealmSecurityManager) SecurityUtils.getSecurityManager();
        Iterator iterator = rsm.getRealms().iterator();
        while (iterator.hasNext()) {
            handlerPermissionByRole((BaseRealm) iterator.next(), roleName);
        }

    }

    /**
     * 处理角色权限
     *
     * @param shiroRealm
     * @param roleName
     */
    private void handlerPermissionByRole(BaseRealm shiroRealm, String roleName) {
        Subject currentUser = SecurityUtils.getSubject();
        String realmName = currentUser.getPrincipals().getRealmNames().iterator().next();
        Iterator iterator = shiroRealm.getAuthorizationCache().keys().iterator();
        while (iterator.hasNext()) {
            String loginName = iterator.next().toString();
            AuthorizationInfo info = shiroRealm.getAuthorizationCache().get(loginName);
            if (info == null) return;
            if (info.getRoles().contains(roleName)) {
                SimplePrincipalCollection principals = new SimplePrincipalCollection(loginName, realmName);
                if (principals != null) {
                    shiroRealm.clear(principals);
                    currentUser.runAs(principals);
                    logger.info("缓存区:" + shiroRealm.getAuthorizationCache().keys().iterator().hasNext());
                }
            }
        }
    }

    /**
     * 根据人员重新加载权限
     * @param loginName
     */
    public void reloadPermissionByUser(String loginName) {
        RealmSecurityManager rsm = (RealmSecurityManager) SecurityUtils.getSecurityManager();

        Iterator iterator = rsm.getRealms().iterator();
        while (iterator.hasNext()) {
            handlerPermissionByUser((BaseRealm) iterator.next(), loginName);
        }
    }

    /**
     * 处理人员权限
     *
     * @param shiroRealm
     * @param loginName
     */
    private void handlerPermissionByUser(BaseRealm shiroRealm, String loginName) {
        Subject currentUser = SecurityUtils.getSubject();
        String realmName = currentUser.getPrincipals().getRealmNames().iterator().next();
        Iterator iterator = shiroRealm.getAuthorizationCache().keys().iterator();
        while (iterator.hasNext()) {
            String loginName1 = iterator.next().toString();
//            AuthorizationInfo info = shiroRealm.getAuthorizationCache().get(loginName);
            System.out.println(loginName1);
//            if (info == null) return;
            SimplePrincipalCollection principals = new SimplePrincipalCollection(loginName, realmName);
            if (principals != null) {
                shiroRealm.clear(principals);
                currentUser.runAs(principals);
                logger.info("缓存区:" + shiroRealm.getAuthorizationCache().keys().iterator().hasNext());
            }
        }
    }

}
