package com.coocaa.element.core.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ConfigurationProperties(prefix = "ldap")
@PropertySource("classpath:ldap.properties")
public class LdapConfig {

    private String host;
    private int port;
    private String search;
    private String factory;

    public void setHost(String host){
        this.host = host;
    }

    public String getHost(){
        return this.host;
    }

    public void setPort(int port){
        this.port = port;
    }

    public int getPort(){
        return this.port;
    }

    public void setSearch(String search){
        this.search = search;
    }

    public String getSearch(){
        return this.search;
    }

    public void setFactory(String factory){
        this.factory = factory;
    }

    public String getFactory(){
        return this.factory;
    }

}
