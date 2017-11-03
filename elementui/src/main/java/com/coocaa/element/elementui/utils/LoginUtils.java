package com.coocaa.element.elementui.utils;

import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.model.view.RoleMenuView;
import com.coocaa.element.core.model.view.UserRoleView;
import com.coocaa.element.core.service.manage.RoleMenuService;
import com.coocaa.element.core.service.manage.RoleService;
import com.coocaa.element.core.service.manage.UserRoleService;
import com.coocaa.element.core.service.manage.UserService;
import com.coocaa.element.core.utils.JLdapHelper;
import com.coocaa.magazine.utils.CipherUtil;
import com.coocaa.magazine.utils.StringUtil;
import com.novell.ldap.LDAPEntry;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class LoginUtils {

    @Autowired
    UserService userService;
    @Autowired
    UserRoleService userRoleService;
    @Autowired
    RoleService roleService;
    @Autowired
    RoleMenuService roleMenuService;
    @Autowired
    JLdapHelper jLdapHelper;

    public Integer getUserIdByLoginName(String loginName) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("loginName", loginName);
        params.put("loginFlag", 1);
        params.put("delFlag", 1);
        List<User> userList = userService.findBy(params);
        if (userList.size() > 0) {
            User user = userList.get(0);
            return user.getId();
        }
        return null;
    }

    public List<UserRoleView> getUserRoleViewList(String loginName) {
        Integer userId = getUserIdByLoginName(loginName);
        return getUserRoleViewList(userId);
    }

    /**
     * 获取该用户对应的所有角色
     *
     * @param loginName
     * @return
     */
    public Set<String> getRoleNamesBy(String loginName) {
        Set<String> roleNameSet = new HashSet<>();
        List<UserRoleView> userRoleViewList = getUserRoleViewList(loginName);
        for (UserRoleView item : userRoleViewList) {
            String name = item.getName();
            roleNameSet.add(name);
        }
        return roleNameSet;
    }

    /**
     * 获取该用户对应的所有权限
     *
     * @return
     */
    public Set<String> getPermissionsBy() {
        Set<String> permissionSet = new HashSet<>();
        Subject currentUser = SecurityUtils.getSubject();
        List<Integer> roleIdList = new ArrayList<>();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            roleIdList = (List<Integer>) session.getAttribute("roleIdList");
        }
        HashMap<String, Object> params = new HashMap<>();
        params.put("roleIdList", roleIdList);
        params.put("delFlag", 1);
        List<RoleMenuView> roleMenuViewList = roleMenuService.findViewBy(params);
        for (RoleMenuView roleMenuView : roleMenuViewList) {
            String permission = roleMenuView.getPermission();
            permissionSet.add(permission);
        }
        return permissionSet;
    }

    public List<UserRoleView> getUserRoleViewList(Integer userId) {
        List<UserRoleView> userRoleViewList = new ArrayList<>();
        if (userId != null) {
            HashMap<String, Object> params = new HashMap<>();
            params.put("userId", userId);
            params.put("useable", 1);
            params.put("delFlag", 1);
            userRoleViewList = userRoleService.findViewBy(params);
        }
        return userRoleViewList;
    }

    /**
     * ldap用户第一次登录，初始化用户环境.
     *
     * @param username
     * @return
     */
    public User firstLdapUser(String username, String password) {
        User user = new User();
        user.setLoginName(username);
        Integer id = userService.getUserId(username);
        System.out.println(id);
        String salt = StringUtil.genSalt();
        user.setSalt(salt);
        if (id != null) {
            user = userService.getEntityById(id);
            if (user.getLoginFlag().equals(0)) {
                throw new LockedAccountException();
            }
        } else {
            user.setCreateDate(new Date());
            user.setLoginFlag(1);
            LDAPEntry data = jLdapHelper.getUserInfo(username, password);
            if (null != data) {
                if (data.getAttribute("mail") != null) {
                    user.setEmail(data.getAttribute("mail").getStringValue().toString());
                } else {
                    user.setEmail(data.getAttribute("userPrincipalName").getStringValue().toString());
                }
                if (data.getAttribute("name") != null) {
                    user.setName(data.getAttribute("name").getStringValue());
                } else {
                    user.setName("");
                }
                if (data.getAttribute("mobile") != null) {
                    user.setMobile(data.getAttribute("mobile").getStringValue());
                } else {
                    user.setMobile("");
                }
                user.setPassword(CipherUtil.md5(""));
                userService.insert(user);
//                userRoleService.insertUserRole(user.getId(), new Integer[]{6});
            }
        }
        return user;
    }

    /**
     * 将一些数据放到ShiroSession中,以便于其它地方使用
     */
    public void setSession(User user) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            Integer userId = user.getId();
            session.setAttribute("userId", userId);
            session.setAttribute("loginName", user.getLoginName());
            session.setAttribute("name", user.getName());
            List<UserRoleView> userRoleViewList = getUserRoleViewList(userId);
            List<Integer> roleIdList = new ArrayList<>();
            if (userRoleViewList == null || userRoleViewList.size() == 0) {
                roleIdList.add(6);
                session.setAttribute("roleIdList", roleIdList);
                return;
            }
            for (UserRoleView item : userRoleViewList) {
                Integer roleId = item.getRoleId();
                System.out.println(roleId);
                roleIdList.add(roleId);
            }
            session.setAttribute("roleIdList", roleIdList);
        }
    }

}
