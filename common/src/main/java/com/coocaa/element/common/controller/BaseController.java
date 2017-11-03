package com.coocaa.element.common.controller;

import com.coocaa.magazine.utils.MyUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 所有网站应该继承的controller，封装公用的方法
 */
public abstract class BaseController extends MyUtils {

    /**
     * Controller调用前调用
     *
     * @param request
     * @param response
     * @param session
     * @param model
     */
    @ModelAttribute
    protected void setter(HttpServletRequest request, HttpServletResponse response, HttpSession session, ModelMap model) {
        this.request = request;
        this.response = response;
        this.session = session;
        this.model = model;
    }

    /**
     * 管理基础路径
     */
    @Value("${adminPath}")
    protected String adminPath;

    protected static void putSessionCache(Object key, Object value) {
        SecurityUtils.getSubject().getSession().setAttribute(key, value);
    }

    protected static Object getSessionCache(Object key) {
        return SecurityUtils.getSubject().getSession().getAttribute(key);
    }

    protected String getViews(String templatePre, String str) {
        return templatePre + str;
    }

}
