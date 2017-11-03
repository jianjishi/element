package com.coocaa.element.elementui;

import com.coocaa.element.common.config.AdeviceConfig;
import com.coocaa.element.common.config.CurrencyConfig;
import com.coocaa.element.common.config.MailConfig;
import com.coocaa.element.common.util.SendEmailUtil;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.Properties;

@SpringBootApplication
@ComponentScan("com.coocaa.element")
@EnableAsync
@EnableTransactionManagement
@EnableConfigurationProperties({CurrencyConfig.class, MailConfig.class, AdeviceConfig.class})
public class Application extends WebMvcConfigurerAdapter {
    private static Logger logger = Logger.getLogger(Application.class);

    @Autowired
    MailConfig mailConfig;

    /**
     * 配置shiroFilter
     *
     * @return
     */
//    @Bean
//    public FilterRegistrationBean getShiroFilter() {
//        DelegatingFilterProxy shiroFilter = new DelegatingFilterProxy(); // 调用initFilterBean初始化filter, http://blog.csdn.net/yangnianbing110/article/details/19708907
//        shiroFilter.setTargetFilterLifecycle(true);
//        shiroFilter.setTargetBeanName("shiroFilter");
//        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
//        registrationBean.setFilter(shiroFilter);
//        List<String> urlPatterns = new ArrayList<>();
//        urlPatterns.add("/*");
//        registrationBean.setUrlPatterns(urlPatterns);
//        registrationBean.setOrder(1);
//        return registrationBean;
//    }
    @Bean
    public JavaMailSenderImpl javaMailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setHost(mailConfig.getSERVERHOST());
        javaMailSender.setUsername(mailConfig.getSERVERUSERNAME());
        javaMailSender.setPassword(mailConfig.getSERVERPASSWORD());
        Properties properties = new Properties();
        properties.put("mail.smtp.auth", true);
        properties.put("mail.smtp.timeout", 25000);
        javaMailSender.setJavaMailProperties(properties);
        return javaMailSender;
    }

    @Bean
    public SendEmailUtil sendEmailUtil() {
        SendEmailUtil sendEmailUtil = new SendEmailUtil();
        sendEmailUtil.setMailSender(javaMailSender());
        return sendEmailUtil;
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        logger.info("springboot start success");
    }
}
