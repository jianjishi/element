package com.coocaa.element.elementui.interceptor;

import com.alibaba.fastjson.JSON;
import com.coocaa.element.core.model.manage.LoginLog;
import com.coocaa.element.core.model.manage.OperateLog;
import com.coocaa.element.core.model.manage.User;
import com.coocaa.element.core.service.manage.LoginLogService;
import com.coocaa.element.core.service.manage.OperateLogService;
import com.coocaa.element.core.service.manage.UserService;
import com.coocaa.magazine.utils.ServletUtil;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

/**
 * Created by panwei on 2016/7/7.
 */
@Aspect
@Configuration
public class AspectInterceptor {
    @Autowired
    LoginLogService loginLogService;
    @Autowired
    OperateLogService operateLogService;
    @Autowired
    UserService userService;

    /**
     * 登录日志
     *
     * @param joinPoint：可获取登录方法login(String uid, String pwd)及其参数
     * @param returnValue：登录方法的返回值
     */
    @AfterReturning(pointcut = "execution(public * com.coocaa.element.elementui.controller.manage.HomeController.login(String, String))",
            returning = "returnValue")
    public void doAfterReturningLogin(JoinPoint joinPoint, Object returnValue) {
        if (returnValue.equals(true)) {   //登录成功时记录登录日志
            Object[] objects = joinPoint.getArgs();
            String loginName = (String) objects[0];
            Integer userId = userService.getUserId(loginName);

            //获取request
            ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            HttpServletRequest request = requestAttributes.getRequest();

            LoginLog loginLog = new LoginLog();
            loginLog.setUserId(userId);
            loginLog.setStatus(1);
            loginLog.setLoginTime(new Date());
            loginLog.setLoginIp(ServletUtil.getRemortIP(request));

            loginLogService.insert(loginLog);
        }
    }


    /**
     * 拦截controller中的changeStatus方法, 更新成功执行完后执行通知
     *
     * @param joinPoint
     * @param returnValue
     */
    @AfterReturning(pointcut = "execution(public * com.coocaa.adevice.device.controller..*.changeStatus(Integer, Integer))",
            returning = "returnValue")
    public void doAfterReturningChangeStatus(JoinPoint joinPoint, Object returnValue) {
        Object[] objects = joinPoint.getArgs();//获取目标方法参数 int id, int status
        String targetMethod = joinPoint.getTarget().getClass().toString();
        String operateModel = targetMethod.substring(targetMethod.lastIndexOf(".") + 1, targetMethod.indexOf("Controller"));

        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") != null) {
                Integer userId = (Integer) session.getAttribute("userId");
                OperateLog operateLog = new OperateLog();
                operateLog.setOperator(userId);
                Integer id = (Integer) objects[0];
                Integer status = (Integer) objects[1];
                if (status == 2) {
                    operateLog.setOperation("禁用了id为" + id + "的记录, 操作实体是:" + operateModel);
                } else {
                    operateLog.setOperation("启用了id为" + id + "的记录, 操作实体是:" + operateModel);
                }
                operateLog.setOperateTime(new Date());
                operateLog.setStatus(1);
                //获取request
                ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (requestAttributes != null) {
                    HttpServletRequest request = requestAttributes.getRequest();
                    if (request != null) {
                        operateLog.setOperateIp(ServletUtil.getRemortIP(request));
                    }
                }
                operateLog.setStatus(1);
                operateLogService.insert(operateLog);
            }
        }

    }

    /**
     * 拦截controller中的update方法, 更新成功执行完后执行通知
     *
     * @param joinPoint
     * @param returnValue
     */
    @AfterReturning(pointcut = "execution(public * com.coocaa.adevice.device.controller..*.update(..))",
            returning = "returnValue")
    public void doAfterReturningUpdate(JoinPoint joinPoint, Object returnValue) {
        Object[] objects = joinPoint.getArgs();//获取目标方法参数
        String targetMethod = joinPoint.getTarget().getClass().toString();
        String operateModel = targetMethod.substring(targetMethod.lastIndexOf(".") + 1, targetMethod.indexOf("Controller"));

        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") != null) {
                Integer userId = (Integer) session.getAttribute("userId");
                OperateLog operateLog = new OperateLog();
                operateLog.setOperator(userId);
                operateLog.setOperation("更新了一条记录, 操作实体是:" + operateModel);
                Object updateEntity = session.getAttribute("updateEntity");
                if (operateModel.equals("User")) {
                    User userBefore = (User) updateEntity;
                    userBefore.setPassword(null);
                    userBefore.setSalt(null);
                    operateLog.setOperateBefore(JSON.toJSONString(userBefore));
                    User userAfter = (User) objects[0];
                    userAfter.setPassword(null);
                    userAfter.setSalt(null);
                    operateLog.setOperateAfter(JSON.toJSONString(userAfter));
                } else {
                    operateLog.setOperateBefore(JSON.toJSONString(session.getAttribute("updateEntity")));
                    operateLog.setOperateAfter(JSON.toJSONString(objects[0]));
                }
                operateLog.setOperateTime(new Date());
                operateLog.setStatus(1);
                //获取request
                ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (requestAttributes != null) {
                    HttpServletRequest request = requestAttributes.getRequest();
                    if (request != null) {
                        operateLog.setOperateIp(ServletUtil.getRemortIP(request));
                    }
                }
                operateLog.setStatus(1);
                operateLogService.insert(operateLog);
            }
        }

    }

    /**
     * 拦截controller中的insert方法, 插入成功执行完后执行通知
     *
     * @param joinPoint
     * @param returnValue
     */
    @AfterReturning(pointcut = "execution(public * com.coocaa.adevice.device.controller..*.insert(..))",
            returning = "returnValue")
    public void doAfterReturningInsert(JoinPoint joinPoint, Object returnValue) {
        Object[] objects = joinPoint.getArgs();//获取目标方法参数
        String targetMethod = joinPoint.getTarget().getClass().toString();
        String operateModel = targetMethod.substring(targetMethod.lastIndexOf(".") + 1, targetMethod.indexOf("Controller"));

        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") != null) {
                Integer userId = (Integer) session.getAttribute("userId");
                OperateLog operateLog = new OperateLog();
                operateLog.setOperator(userId);
                operateLog.setOperation("插入了一条记录, 操作实体是:" + operateModel);
                Object addEntity = session.getAttribute("addEntity");
                if (operateModel.equals("User")) {
                    User user = (User) addEntity;
                    user.setPassword(null);
                    user.setSalt(null);
                    operateLog.setOperateAfter(JSON.toJSONString(user));
                } else {
                    operateLog.setOperateAfter(JSON.toJSONString(addEntity));
                }
                operateLog.setOperateTime(new Date());
                operateLog.setStatus(1);
                //获取request
                ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (requestAttributes != null) {
                    HttpServletRequest request = requestAttributes.getRequest();
                    if (request != null) {
                        operateLog.setOperateIp(ServletUtil.getRemortIP(request));
                    }
                }
                operateLog.setStatus(1);
//                operateLogService.insert(operateLog);
            }
        }
    }

    /**
     * 拦截controller中的delete方法, 删除方法成功执行完后执行通知
     *
     * @param joinPoint
     * @param returnValue
     */
    @AfterReturning(pointcut = "execution(public * com.coocaa.adevice.device.controller..*.delete(Integer))",
            returning = "returnValue")
    public void doAfterReturningDelete(JoinPoint joinPoint, Object returnValue) {
        Object[] objects = joinPoint.getArgs();//获取目标方法参数   int id;
        String targetMethod = joinPoint.getTarget().getClass().toString();
        String operateModel = targetMethod.substring(targetMethod.lastIndexOf(".") + 1, targetMethod.indexOf("Controller"));

        Subject currentUser = SecurityUtils.getSubject();
        if (null != currentUser) {
            Session session = currentUser.getSession();
            if (session.getAttribute("userId") != null) {
                Object entity = session.getAttribute("entity");
                if (entity != null) {
                    Integer userId = (Integer) session.getAttribute("userId");
                    OperateLog operateLog = new OperateLog();
                    operateLog.setOperator(userId);
                    Integer id = (Integer) objects[0];
                    operateLog.setOperation("删除了id为" + id + "的记录, 操作实体是:" + operateModel);
                    operateLog.setOperateTime(new Date());
                    ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                    if (requestAttributes != null) {
                        HttpServletRequest request = requestAttributes.getRequest();
                        if (request != null) {
                            operateLog.setOperateIp(ServletUtil.getRemortIP(request));
                        }
                    }
                    operateLog.setStatus(1);
                    operateLogService.insert(operateLog);
                }
            }
        }
    }

    /**
     * 拦截UserController中的modifyPwd方法
     *
     * @param joinPoint
     * @param returnValue
     */
    @AfterReturning(pointcut = "execution(public * com.coocaa.element.elementui.controller.manage.UserController.modifyPwd(..))",
            returning = "returnValue")
    public void doAfterReturningModifyPwd(JoinPoint joinPoint, Object returnValue) {

    }


}
