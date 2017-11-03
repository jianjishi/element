package com.coocaa.element.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Created by Mr giraffe on 16/7/6.
 * 通用配置,这里的配置会根据环境变化而变化
 */
@ConfigurationProperties(prefix = "adevice")
public class AdeviceConfig {
    private String adeviceSite;

    private String uploadPath;
    private String commonVariable;

    public String getUploadPath() {
        return uploadPath;
    }

    public void setUploadPath(String uploadPath) {
        this.uploadPath = uploadPath;
    }

    public String getAdeviceSite() {
        return adeviceSite;
    }

    public void setAdeviceSite(String adeviceSite) {
        this.adeviceSite = adeviceSite;
    }

    public String getCommonVariable() {
        return commonVariable;
    }

    public void setCommonVariable(String commonVariable) {
        this.commonVariable = commonVariable;
    }
}
