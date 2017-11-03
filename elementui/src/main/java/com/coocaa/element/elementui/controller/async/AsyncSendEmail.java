package com.coocaa.element.elementui.controller.async;

import com.coocaa.element.common.config.MailConfig;
import com.coocaa.element.common.enums.EmailTypeEnum;
import com.coocaa.element.common.util.SendEmailUtil;
import com.coocaa.element.core.model.manage.Email;
import com.coocaa.element.core.service.manage.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by panwei on 17/4/17.
 */
@Component
public class AsyncSendEmail {
    @Autowired
    MailConfig mailConfig;
    @Autowired
    SendEmailUtil sendEmailUtil;
    @Autowired
    EmailService emailService;

    /**
     * 发送给用户邮箱
     * @param subject
     * @param context
     * @param email
     */
    @Async
    public void sendEmailContextToUser(String subject, String context, String email) {
        String from = mailConfig.getSERVERFROM();
        String[] to = {email};
        String[] cc = {};
        try {
            sendEmailUtil.sendEmail(subject, from, to, cc, context, true);
            System.out.println("邮件发送成功");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("邮件发送失败");
        }
    }

    /**
     * 发送给超级管理员列表的邮箱
     * @param subject
     * @param context
     * @param params
     */
    @Async
    public void sendEmailContext(String subject, String context, HashMap<String, Object> params) {
        String from = mailConfig.getSERVERFROM();
        HashMap<String, Object> param = new HashMap<>();
        param.put("type", EmailTypeEnum.SUPERMANAGER.getCode());
        param.put("status", 1);
        List<Email> emailList = emailService.findBy(param);
        List<String> emailStrList = emailList.stream().map(Email::getEmailName).collect(Collectors.toList());
        String[] to = emailStrList.toArray(new String[emailStrList.size()]);
        String[] cc = {};
        try {
            sendEmailUtil.sendEmail(subject, from, to, cc, context, true);
            System.out.println("邮件发送成功");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("邮件发送失败");
        }
    }
}
