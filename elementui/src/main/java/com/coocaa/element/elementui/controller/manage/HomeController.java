package com.coocaa.element.elementui.controller.manage;

import com.alibaba.fastjson.JSONObject;
import com.coocaa.element.common.controller.BaseController;
import com.coocaa.element.core.model.manage.Menu;
import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.service.manage.*;
import com.coocaa.element.elementui.controller.async.AsyncSendEmail;
import com.coocaa.magazine.utils.CipherUtil;
import com.coocaa.magazine.utils.StringUtil;
import com.coocaa.magazine.utils.ValidateUtil;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

/**
 * Created by panwei on 16/12/22.
 */
@Controller
public class HomeController extends BaseController {
    @Autowired
    UserService userService;
    @Autowired
    UserRoleService userRoleService;
    @Autowired
    RoleService roleService;
    @Autowired
    RoleMenuService roleMenuService;
    @Autowired
    MenuService menuService;
    @Autowired
    AsyncSendEmail asyncSendEmail;

    @RequestMapping("/")
    public String index(ModelMap modelMap) {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") == null) {
                return "/login";
            }
        }
        Session session = currentUser.getSession();
//        modelMap.put("user", session.getAttribute("name") + "(" + session.getAttribute("loginName") + ")");
        List<String> roleNames = new ArrayList<>();
        List<Integer> roleIdList = (List<Integer>) session.getAttribute("roleIdList");
        for (Integer roleId : roleIdList) {
            String roleName = roleService.getRoleNameByRoleId(roleId);
            roleNames.add(roleName);
        }
        String roleNameStr = StringUtils.join(roleNames.toArray(), ",");
        modelMap.put("user", session.getAttribute("loginName") + "(" + roleNameStr + ")");

        List<HashMap<String, Object>> menuListOfTheRole = roleMenuService.getMenus(0, roleIdList);
        modelMap.put("menus", JSONObject.toJSONString(menuListOfTheRole));
        modelMap.put("adminPath", adminPath);
        return "/index";
    }

    @RequestMapping("/login")
    public String login() {
        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") != null) {
                return "/index";
            }
        }
        return "/login";
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public Object login(String loginName, String password) {
        HashMap<String, Object> rtn = new HashMap<>();
        UsernamePasswordToken token = new UsernamePasswordToken(loginName, password);
//        token.setRememberMe(true);
        Subject currentUser = SecurityUtils.getSubject();
        try {
            System.out.println("对用户[" + loginName + "]进行登录验证..验证开始");
            currentUser.login(token);
            System.out.println("对用户[" + loginName + "]进行登录验证..验证通过");
        } catch (UnknownAccountException uae) {
            System.out.println("对用户[" + loginName + "]进行登录验证..验证未通过,未知账户");
            rtn.put("msg", "未知账户");
            currentUser.logout();
        } catch (IncorrectCredentialsException ice) {
            System.out.println("对用户[" + loginName + "]进行登录验证..验证未通过,错误的凭证");
            rtn.put("msg", "密码不正确");
            currentUser.logout();
        } catch (LockedAccountException lae) {
            System.out.println("对用户[" + loginName + "]进行登录验证..验证未通过,账户已锁定");
            rtn.put("msg", "账户已锁定");
            currentUser.logout();
        } catch (ExcessiveAttemptsException eae) {
            System.out.println("对用户[" + loginName + "]进行登录验证..验证未通过,错误次数过多");
            rtn.put("msg", "用户名或密码错误次数过多");
            currentUser.logout();
        } catch (AuthenticationException ae) {
            //通过处理Shiro的运行时AuthenticationException就可以控制用户登录失败或密码错误时的情景
            System.out.println("对用户[" + loginName + "]进行登录验证..验证未通过,堆栈轨迹如下");
            ae.printStackTrace();
            rtn.put("msg", "用户名或密码不正确");
            currentUser.logout();
        }

        System.out.println("登录是否成功: " + currentUser.isAuthenticated());// TODO: 17/2/7 当第一次登录成功后,第二次输入错的密码也返回true ??
//        if (currentUser.isAuthenticated()) {
        if (rtn.size() == 0) {
            System.out.println("用户[" + loginName + "]登录认证通过(这里可以进行一些认证通过后的一些系统参数初始化操作)");
            return true;
        } else {
            token.clear();
        }
        return rtn;
    }

    @RequestMapping("/registerPage")
    public String registerPage() {
        return "/register";
    }

    @RequestMapping("/register")
    @ResponseBody
    public Object register(User user, String rPassword) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (validateRegisterParams(rtn, user, rPassword)) {
            user.setCreateDate(new Date());
            user.setLoginFlag(0);
            String salt = StringUtil.genSalt();
            user.setSalt(salt);
            user.setPassword(CipherUtil.md5(user.getPassword() + salt));
            userService.insert(user);
//            String subject = "设备报备系统";
//            String context = EmailTemplatesUtil.getRegisterTemplate(user.getLoginName(), user.getRemarks(), deviceConfig.getAdeviceSite());
//            HashMap<String, Object> params = new HashMap<>();
//            asyncSendEmail.sendEmailContext(subject, context, params);
            return true;
        }
        return rtn;
    }

    private boolean validateRegisterParams(HashMap<String, Object> rtn, User user, String rPassword) {
        if (user != null) {
            String name = user.getName(), loginName = user.getLoginName(),
                    email = user.getEmail(), password = user.getPassword(), remarks = user.getRemarks();
            //1 非空校验
            if (StringUtils.isBlank(name) || StringUtils.isBlank(loginName)
                    || StringUtils.isBlank(email) || StringUtils.isBlank(password)
                    || StringUtils.isBlank(rPassword) || StringUtils.isBlank(remarks)) {
                rtn.put("msg", "请将信息填写完整");
                return false;
            }
            //2 正则校验(包括格式、长度校验)
            String pwdReg = "^[\\w\\W]{6,14}$";
            if (!ValidateUtil.isValidSkyWorthCoocaaEmail(email)) {
                rtn.put("msg", "邮箱格式不对");
                return false;
            }
            if (!ValidateUtil.match(pwdReg, password) || !ValidateUtil.match(pwdReg, rPassword)) {
                rtn.put("msg", "密码格式不对");
                return false;
            }
            if (!Objects.equals(password, rPassword)) {
                rtn.put("msg", "两次密码输入不一致");
                return false;
            }
            //3 是否注册过校验
            HashMap<String, Object> loginNameParam = new HashMap<>();
            loginNameParam.put("loginName", loginName);
            List<User> userListByLoginName = userService.findBy(loginNameParam);
            if (userListByLoginName.size() > 0) {
                rtn.put("msg", "该账号已存在");
                return false;
            }
            HashMap<String, Object> emailParam = new HashMap<>();
            emailParam.put("email", email);
            List<User> userListByEmail = userService.findBy(emailParam);
            if (userListByEmail.size() > 0) {
                rtn.put("msg", "该邮箱已存在");
                return false;
            }
            return true;
        }
        return false;
    }

    @RequestMapping("/registerSuccess")
    public String registerSuccess() {
        return "/registerSuccess";
    }

    @RequestMapping("/welcome")
    public String welcome(ModelMap modelMap) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        PageHelper.startPage(1, 1000);
        List<Menu> menuList = menuService.findBy(params);
        modelMap.put("menuList", menuList);
        return "/welcome";
    }

    @RequestMapping("/noPower")
    public String noPower() {
        return "/noPower";
    }

    @RequestMapping("/logout")
    public String logout() {
        SecurityUtils.getSubject().logout();
        return "/login";
    }

}
