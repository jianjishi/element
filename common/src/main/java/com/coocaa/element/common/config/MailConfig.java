package com.coocaa.element.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Created by panwei on 2016/6/1.
 */
@ConfigurationProperties(prefix = "EMAIL", locations = "classpath:mail.properties")
public class MailConfig {
    private String SERVERHOST;
    private String SERVERFROM;
    private String SERVERUSERNAME;
    private String SERVERPASSWORD;
    private String SUPERADMINISTRATOR;

    public String getSERVERHOST() {
        return SERVERHOST;
    }

    public void setSERVERHOST(String SERVERHOST) {
        this.SERVERHOST = SERVERHOST;
    }

    public String getSERVERFROM() {
        return SERVERFROM;
    }

    public void setSERVERFROM(String SERVERFROM) {
        this.SERVERFROM = SERVERFROM;
    }

    public String getSERVERUSERNAME() {
        return SERVERUSERNAME;
    }

    public void setSERVERUSERNAME(String SERVERUSERNAME) {
        this.SERVERUSERNAME = SERVERUSERNAME;
    }

    public String getSERVERPASSWORD() {
        return SERVERPASSWORD;
    }

    public void setSERVERPASSWORD(String SERVERPASSWORD) {
        this.SERVERPASSWORD = SERVERPASSWORD;
    }

    public String getSUPERADMINISTRATOR() {
        return SUPERADMINISTRATOR;
    }

    public void setSUPERADMINISTRATOR(String SUPERADMINISTRATOR) {
        this.SUPERADMINISTRATOR = SUPERADMINISTRATOR;
    }
}
