package com.coocaa.element.elementui.controller.manage;

import com.coocaa.element.common.controller.BaseController;
import com.coocaa.element.common.util.ObjMapConvertUtil;
import com.coocaa.element.core.model.manage.OperateLog;
import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.service.manage.OperateLogService;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by panwei on 16/10/17.
 */
@Controller
@RequestMapping("${adminPath}/manage/operateLog")
public class OperateLogController extends BaseController {
    @Autowired
    OperateLogService operateLogService;
    @Autowired
    UserService userService;

    private final static String templatePre = "/manage/operateLog/";

    @RequiresPermissions("sysLog:operateLog:index")
    @RequestMapping("/index")
    public String index() {
        return getViews(templatePre, "index");
    }

    @RequiresPermissions("sysLog:operateLog:index")
    @RequestMapping("/get_operateLogs_json")
    @ResponseBody
    public Object getOperateLogsJson(Integer currentPage, Integer pageSize, OperateLog operateLog) throws Exception {
        System.out.println(request.getQueryString());
        HashMap<String, Object> result = new HashMap<>();
        HashMap<String, Object> params = new HashMap<>();
//        params = Conversion.objToMap(params, operateLog, true);
        String loginName = operateLog.getLoginName();
        if (StringUtils.isNotBlank(loginName)) {
            Integer userId = userService.getUserId(loginName);
            if (userId != null) {
                params.put("operator", userId);
            } else {
                params.put("operator", 0);
            }
        }
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        PageHelper.startPage(currentPage,pageSize);
        List<OperateLog> list = operateLogService.findBy(params);
        List<Map<String, Object>> lists = new ArrayList<>();
        for (OperateLog item : list) {
            Integer operator = item.getOperator();
            User user = userService.getEntityById(operator);
            if (user != null) {
                item.setLoginName(user.getLoginName());
            }
            lists.add(ObjMapConvertUtil.objectToMap(item));
        }
        PageInfo pageInfo = new PageInfo(list);

        result.put("count", pageInfo.getTotal());
        result.put("lists", lists);
        return result;
    }

}
