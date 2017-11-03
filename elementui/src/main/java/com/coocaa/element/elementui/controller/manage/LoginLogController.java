package com.coocaa.element.elementui.controller.manage;

import com.coocaa.element.common.controller.BaseController;
import com.coocaa.element.common.util.ObjMapConvertUtil;
import com.coocaa.element.core.model.manage.LoginLog;
import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.service.manage.LoginLogService;
import com.coocaa.element.core.service.manage.UserService;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * Created by panwei on 16/10/17.
 */
@Controller
@RequestMapping("${adminPath}/manage/loginLog")
public class LoginLogController extends BaseController {
    @Autowired
    LoginLogService loginLogService;
    @Autowired
    UserService userService;

    private final static String templatePre = "/manage/loginLog/";

    @RequiresPermissions("sysLog:loginLog:index")
    @RequestMapping("/index")
    public String index() {
        return getViews(templatePre, "index");
    }

    @RequiresPermissions("sysLog:loginLog:index")
    @RequestMapping("/get_loginLogs_json")
    @ResponseBody
    public Object getLoginLogsJson(Integer currentPage, Integer pageSize, LoginLog loginLog) throws Exception {
        HashMap<String, Object> result = new HashMap<>();
        HashMap<String, Object> params = new HashMap<>();
//        params = Conversion.objToMap(params, loginLog, true);
        String loginName = loginLog.getLoginName();
        if (StringUtils.isNotBlank(loginName)) {
            Integer userId = userService.getUserId(loginName);
            if (userId != null) {
                params.put("userId", userId);
            } else {
                params.put("userId", 0);
            }
        }
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        PageHelper.startPage(currentPage,pageSize);
        List<LoginLog> list = loginLogService.findBy(params);
        List<Map<String, Object>> lists = new ArrayList<>();
        for (LoginLog item : list) {
            Integer userId = item.getUserId();
            if (userId != null) {
                User user = userService.getEntityById(userId);
                if (user != null) {
                    item.setLoginName(user.getLoginName());
                }
            }
            lists.add(ObjMapConvertUtil.objectToMap(item));
        }
        PageInfo pageInfo = new PageInfo(list);

        result.put("count", pageInfo.getTotal());
        result.put("lists", lists);
        return result;
    }

}
