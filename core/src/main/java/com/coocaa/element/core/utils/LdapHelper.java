package com.coocaa.element.core.utils;

import com.coocaa.element.core.config.LdapConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.naming.AuthenticationException;
import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import java.util.Hashtable;

@Component
public class LdapHelper {

    @Autowired
    LdapConfig ldapConfig;

    private static LdapContext ctx;
    private Hashtable env = null;

    /**
     * 连接Ldap服务器
     */
    public boolean checkUser(String account, String password) {
        env = new Hashtable();
        env.put(Context.INITIAL_CONTEXT_FACTORY, ldapConfig.getFactory());
        env.put(Context.PROVIDER_URL, "ldap://" + ldapConfig.getHost()+":"+ldapConfig.getPort()+"/"+ ldapConfig.getSearch());
        env.put(Context.SECURITY_AUTHENTICATION, "simple");
        env.put(Context.SECURITY_PRINCIPAL, account);
        env.put(Context.SECURITY_CREDENTIALS, password);
        try {
            ctx = new InitialLdapContext(env, null);
            closeLdap();
        } catch (AuthenticationException e) {
            e.printStackTrace();
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public void closeLdap(){
        if (ctx == null){
            return;
        }
        try {
            ctx.close();
        } catch (NamingException e) {
            e.printStackTrace();
        }
    }

}
