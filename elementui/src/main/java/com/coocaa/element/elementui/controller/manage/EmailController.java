package com.coocaa.element.elementui.controller.manage;

import com.coocaa.element.common.controller.BaseController;
import com.coocaa.element.common.enums.EmailTypeEnum;
import com.coocaa.element.common.util.ObjMapConvertUtil;
import com.coocaa.element.core.model.manage.Email;
import com.coocaa.element.core.service.manage.EmailService;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.shiro.authz.annotation.RequiresPermissions;
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
@RequestMapping("${adminPath}/manage/email")
public class EmailController extends BaseController {
    @Autowired
    EmailService emailService;

    private final static String templatePre = "/manage/email/";

    @RequiresPermissions("sysSetup:email:index")
    @RequestMapping("/index")
    public String index(ModelMap modelMap) {
        List<Map<String, Object>> emailTypeList = EmailTypeEnum.getEmailTypeList();
        modelMap.put("emailTypeList", emailTypeList);
        return getViews(templatePre, "index");
    }

    @RequiresPermissions("sysSetup:email:index")
    @RequestMapping("/get_emails_json")
    @ResponseBody
    public Object getEmailsJson(Integer currentPage, Integer pageSize, Email email) throws Exception {
        HashMap<String, Object> result = new HashMap<>();
        HashMap<String, Object> params = new HashMap<>();
        params = Conversion.objToMap(params, email, true);
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        PageHelper.startPage(currentPage,pageSize);
        List<Email> list = emailService.findBy(params);
        List<Map<String, Object>> lists = new ArrayList<>();
        for (Email item : list) {
            Integer type = item.getType();
            if (type.equals(1)) {
                item.setComment(EmailTypeEnum.SUPERMANAGER.getName());
            }
            lists.add(ObjMapConvertUtil.objectToMap(item));
        }
        PageInfo pageInfo = new PageInfo(list);
        result.put("count", pageInfo.getTotal());
        result.put("lists", lists);
        return result;
    }

    @RequiresPermissions("sysSetup:email:add")
    @RequestMapping("/addPage")
    public String addPage(ModelMap modelMap) {
        Map<String, String> emailTypeMap = EmailTypeEnum.getKeysMapSS();
        modelMap.put("emailTypeMap", emailTypeMap);
        return getViews(templatePre, "add");
    }

    @RequiresPermissions("sysSetup:email:edit")
    @RequestMapping("/editPage")
    public String editPage(Integer id, ModelMap modelMap) {
        Email email = new Email();
        if (id != null && !id.equals(0)) {
            email = emailService.getEntityById(id);
        }
        modelMap.put("model", email);
        Map<String, String> emailTypeMap = EmailTypeEnum.getKeysMapSS();
        modelMap.put("emailTypeMap", emailTypeMap);
        return getViews(templatePre, "edit");
    }

    @RequiresPermissions("sysSetup:email:add")
    @RequestMapping("/add")
    @ResponseBody
    public Object add(Email email) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (emailService.validateEmailParams(rtn, email)) {
            email.setCreateBy(getSessionCache("userId").toString());
            email.setCreateDate(new Date());
            emailService.insert(email);
            return true;
        }
        return rtn;
    }

    @RequiresPermissions("sysSetup:email:edit")
    @RequestMapping("/update")
    @ResponseBody
    public Object update(Email email) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (emailService.validateEmailParams(rtn, email)) {
            email.setUpdateBy(getSessionCache("userId").toString());
            email.setUpdateDate(new Date());
            emailService.update(email);
            return true;
        }
        return rtn;
    }

    @RequiresPermissions("sysSetup:email:changeStatus")
    @RequestMapping("/changeStatus")
    @ResponseBody
    public Object changeStatus(Integer id, Integer status) {
        Email email = emailService.getEntityById(id);
        if (email != null) {
            email.setStatus(status);
            emailService.update(email);
        }
        return true;
    }

    @RequiresPermissions("sysSetup:email:del")
    @RequestMapping("/del")
    @ResponseBody
    public Object delete(Integer id) {
        HashMap<String, Object> rtn = new HashMap<>();
        if (id == null || id.equals(0)) {
            rtn.put("msg", "删除失败");
            return rtn;
        } else {
            Email email = emailService.getEntityById(id);
            if (email != null) {
                email.setDelFlag(DeleteFlagEnum.DELETED.getCode());
                emailService.update(email);
            }
            return true;
        }
    }

    @RequiresPermissions("sysSetup:email:batchDel")
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
}
