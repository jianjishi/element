package com.coocaa.element.elementui.controller.manage;

import com.coocaa.element.common.controller.BaseController;
import com.coocaa.element.common.util.EmailTemplatesUtil;
import com.coocaa.element.common.util.ObjMapConvertUtil;
import com.coocaa.element.core.model.manage.Office;
import com.coocaa.element.core.model.manage.Role;
import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.service.manage.OfficeService;
import com.coocaa.element.core.service.manage.RoleService;
import com.coocaa.element.core.service.manage.UserRoleService;
import com.coocaa.element.core.service.manage.UserService;
import com.coocaa.element.elementui.controller.async.AsyncSendEmail;
import com.coocaa.element.elementui.utils.ShiroUtils;
import com.coocaa.magazine.utils.CipherUtil;
import com.coocaa.magazine.utils.StringUtil;
import com.coocaa.magazine.utils.ValidateUtil;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

/**
 * Created by panwei on 16/10/17.
 */
@Controller
@RequestMapping("${adminPath}/manage/user")
public class UserController extends BaseController {
    @Autowired
    UserService userService;
    @Autowired
    UserRoleService userRoleService;
    @Autowired
    RoleService roleService;
    @Autowired
    OfficeService officeService;
    @Autowired
    AsyncSendEmail asyncSendEmail;
    @Autowired
    ShiroUtils shiroUtils;

    private final static String templatePre = "/manage/user/";

    //    @RequiresRoles("超级管理员")
    @RequiresPermissions("sysAdministrative:user:index")
    @RequestMapping("/index")
    public String index(ModelMap modelMap) {
        List<Role> roleList = roleService.getRoleList();
        modelMap.put("roleList", roleList);
        return getViews(templatePre, "index");
    }

    /**
     *
     * @param currentPage: 当前页
     * @param pageSize: 每页显示多少条
     * @param user
     * @return
     * @throws Exception
     */
    @RequiresPermissions("sysAdministrative:user:index")
    @RequestMapping("/get_users_json")
    @ResponseBody
    public Object getUsersJson(Integer currentPage, Integer pageSize, User user) throws Exception {
        HashMap<String, Object> result = new HashMap<>();
        HashMap<String, Object> params = new HashMap<>();
        params = Conversion.objToMap(params, user, true);
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        Integer icount = userService.countBy(params);
        PageHelper.startPage(currentPage,pageSize);
        List<User> list = userService.findBy(params);
        List<Map<String, Object>> lists = new ArrayList<>();
        for (User item : list) {
            // officeName
            Integer officeId = item.getOfficeId();
            if (officeId != null) {
                Office office = officeService.getEntityById(officeId);
                if (office != null) {
                    item.setOfficeName(office.getName());
                }
            }
            // roleNameStr
            List<String> roleNamesByUserId = userRoleService.getRoleNamesByUserId(item.getId());
            String roleNameStr = StringUtils.join(roleNamesByUserId, ",");
            item.setRoleNameStr(roleNameStr);
            // roleIds
            List<Integer> roleIds = userRoleService.getRoleIdsByUserId(item.getId());
            item.setRoleIds(roleIds);
            lists.add(ObjMapConvertUtil.objectToMap(item));
        }
        PageInfo pageInfo = new PageInfo(list);
        result.put("count", pageInfo.getTotal());
        result.put("lists", lists);
        return result;
    }

    @RequiresPermissions("sysAdministrative:user:add")
    @RequestMapping("/addPage")
    public String addPage(ModelMap modelMap) {
        List<Role> roleList = roleService.getRoleList();
        modelMap.put("roleList", roleList);
        return getViews(templatePre, "add");
    }

    @RequiresPermissions("sysAdministrative:user:edit")
    @RequestMapping("/editPage")
    public String editPage(Integer id, ModelMap modelMap) {
        User user = new User();
        List<Integer> roleIds = new ArrayList<>();
        if (id != null) {
            user = userService.getEntityById(id);
            Integer officeId = user.getOfficeId();
            if (officeId != null) {
                Office office = officeService.getEntityById(officeId);
                if (office != null) {
                    user.setOfficeName(office.getName());
                }
            }
            roleIds = userRoleService.getRoleIdsByUserId(id);
        }
        modelMap.put("model", user);
        List<Role> roleList = roleService.getRoleList();
        modelMap.put("roleList", roleList);
        modelMap.put("roleIds", roleIds);
        return getViews(templatePre, "edit");
    }

    @RequiresPermissions("sysAdministrative:user:add")
    @RequestMapping("/add")
    @ResponseBody
    public Object add(User user, Integer[] roleIds, Boolean mailNotice) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (userService.validateUserParams(rtn, user, roleIds)) {
            String salt = StringUtil.genSalt();
            user.setSalt(salt);
            user.setPassword(CipherUtil.md5(user.getPassword() + salt));
            user.setCreateBy(getSessionCache("userId").toString());
            user.setCreateDate(new Date());
            userService.insert(user);
            Integer id = user.getId();
            putSessionCache("addEntity", userService.getEntityById(id));
            userRoleService.insertUserRole(id, roleIds);
            if (mailNotice != null && mailNotice) {
//                String subject = "设备报备系统";
//                String context = EmailTemplatesUtil.getAddUserTemplate(user.getLoginName(), deviceConfig.getAdeviceSite());
//                asyncSendEmail.sendEmailContextToUser(subject, context, user.getEmail());
            }
            return true;
        }
        return rtn;
    }

    @RequiresPermissions("sysAdministrative:user:edit")
    @RequestMapping("/update")
    @ResponseBody
    public Object update(User user, Integer[] roleIds, Boolean mailNotice) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (userService.validateUserParams(rtn, user, roleIds)) {
            if (!StringUtils.isBlank(user.getPassword())) {
                user.setUpdateBy(getSessionCache("userId").toString());
                user.setUpdateDate(new Date());
                String salt = StringUtil.genSalt();
                user.setSalt(salt);
                user.setPassword(CipherUtil.md5(user.getPassword() + salt));
            } else {
                user.setPassword(null);
            }
            putSessionCache("updateEntity", userService.getEntityById(user.getId()));
            userService.update(user);
//            System.out.println(user.getLoginName());
//            shiroUtils.reloadPermissionByUser(user.getLoginName());
            Integer id = user.getId();
            userRoleService.insertUserRole(id, roleIds);
            if (mailNotice != null && mailNotice) {
                String subject = "设备报备系统";
                String context = EmailTemplatesUtil.getLockUserTemplate(user.getLoginName(), user.getLoginFlag());
                asyncSendEmail.sendEmailContextToUser(subject, context, user.getEmail());
            }
            return true;
        }
        return rtn;
    }

    @RequiresPermissions("sysAdministrative:user:changeStatus")
    @RequestMapping("/changeStatus")
    @ResponseBody
    public Object changeStatus(Integer id, Integer loginFlag) {
        User user = userService.getEntityById(id);
        if (user != null) {
            user.setLoginFlag(loginFlag);
            userService.update(user);
        }
        return true;
    }

    @RequiresPermissions("sysAdministrative:user:del")
    @RequestMapping("/del")
    @ResponseBody
    public Object delete(Integer id) {
        HashMap<String, Object> rtn = new HashMap<>();
        if (id == null || id.equals(0)) {
            rtn.put("msg", "删除失败");
            return rtn;
        } else {
            User user = userService.getEntityById(id);
            if (user != null) {
                putSessionCache("delEntity", userService.getEntityById(user.getId()));
                user.setDelFlag(DeleteFlagEnum.DELETED.getCode());
                userService.update(user);
            }
            return true;
        }
    }

    @RequiresPermissions("sysAdministrative:user:batchDel")
    @RequestMapping("/batchDel")
    @ResponseBody
    public Object batchDel(Integer[] ids) {
        HashMap<String, Object> rtn = new HashMap<>();
        if (ids != null || ids.length > 0) {
            for (Integer id : ids) {
                this.delete(id);
            }
            return true;
        }
        rtn.put("msg", "删除失败");
        return rtn;
    }

    /**
     * 个人信息
     *
     * @param modelMap
     * @return
     */
    @RequiresPermissions("sysPersonal:personal:personalInformation")
    @RequestMapping("/personalInformation")
    public String personalInformation(ModelMap modelMap) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") == null) {
                return "login";
            }
        }
        Integer userId = (Integer) session.getAttribute("userId");
        User user = userService.getEntityById(userId);
        Integer officeId = user.getOfficeId();
        if (officeId != null) {
            Office office = officeService.getEntityById(officeId);
            if (office != null) {
                user.setOfficeName(office.getName());
            }
        }
        modelMap.put("model", user);
        return getViews(templatePre, "personalInformation");
    }

    @RequiresPermissions("sysPersonal:personal:personalInformation")
    @RequestMapping("/updateUsernameAndEmail")
    @ResponseBody
    public Object updateUsernameAndEmail(User user) {
        HashMap<String, Object> rtn = new HashMap<>();
        if (user != null) {
            String email = user.getEmail(), mobile = user.getMobile();
            if (!ValidateUtil.isValidSkyWorthCoocaaEmail(email)) {
                rtn.put("msg", "邮箱格式不对");
                return rtn;
            }
            if (!ValidateUtil.isValidMobileNo(mobile)) {
                rtn.put("msg", "手机格式不对");
                return rtn;
            }
            userService.update(user);
            return true;
        }
        return false;
    }

    /**
     * 修改密码
     *
     * @param modelMap
     * @return
     */
    @RequiresPermissions("sysPersonal:personal:modifyPassword")
    @RequestMapping("/modifyPassword")
    public String modifyPassword(ModelMap modelMap) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") == null) {
                return "login";
            }
        }
        Integer userId = (Integer) session.getAttribute("userId");
        User user = userService.getEntityById(userId);
        modelMap.put("model", user);
        return getViews(templatePre, "modifyPassword");
    }

    @RequiresPermissions("sysPersonal:personal:modifyPassword")
    @RequestMapping("/modifyPwd")
    @ResponseBody
    public Object modifyPwd(Integer id, String pwd, String newPwd, String reNewPwd) {
        HashMap<String, Object> rtn = new HashMap<>();
        if (id != null) {
            User user = userService.getEntityById(id);
            if (user != null) {
                //判断原密码
                String salt = user.getSalt();
                if (!user.getPassword().equals(CipherUtil.md5(pwd + salt))) {
                    rtn.put("msg", "原密码不正确");
                    return rtn;
                }
                String pwdReg = "^[\\w\\W]{6,14}$";
                if (!ValidateUtil.match(pwdReg, newPwd) || !ValidateUtil.match(pwdReg, reNewPwd)) {
                    rtn.put("msg", "密码格式不对");
                    return rtn;
                }
                if (!Objects.equals(newPwd, reNewPwd)) {
                    rtn.put("msg", "两次密码输入不一致");
                    return rtn;
                }
                user.setPassword(CipherUtil.md5(newPwd + salt));
                userService.update(user);
                SecurityUtils.getSubject().logout();
                return true;
            }
        }
        return false;
    }

}
