package com.coocaa.element.common.util;

import org.apache.log4j.Logger;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

/**
 * Created by panwei on 2017/6/16.
 */
public class SendEmailUtil {
    private static Logger logger = Logger.getLogger(SendEmailUtil.class);
    private JavaMailSender mailSender;

    public void setMailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String subject, String from, String[] to, String[] cc, String content, boolean html) throws Exception {
        MimeMessage msg = this.mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, false, "utf-8");
        helper.setFrom(from);
        helper.setTo(to);
        helper.setCc(cc);
        helper.setSubject(MimeUtility.encodeText(subject, "utf-8", "B"));
        helper.setText(content, html);
        this.mailSender.send(msg);
        logger.info("邮件发送成功...");
    }

}
