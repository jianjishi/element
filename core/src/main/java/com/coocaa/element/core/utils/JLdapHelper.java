package com.coocaa.element.core.utils;

import com.coocaa.element.core.config.LdapConfig;
import com.novell.ldap.LDAPConnection;
import com.novell.ldap.LDAPEntry;
import com.novell.ldap.LDAPException;
import com.novell.ldap.LDAPSearchResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JLdapHelper {

    @Autowired
    LdapConfig ldapConfig;

    public LDAPEntry getUserInfo(String loginName, String password){
        LDAPEntry nextEntry = null;
        LDAPConnection lc = new LDAPConnection();
        try {
            lc.connect(ldapConfig.getHost(),ldapConfig.getPort());
            lc.bind(LDAPConnection.LDAP_V3,loginName,password.getBytes());
            String attrs[] = new String[]{"cn","mail","name","mobile","homePhone","userPrincipalName"};
            LDAPSearchResults result = lc.search(ldapConfig.getSearch(),LDAPConnection.SCOPE_SUB,
                    "(&(objectClass=*)(userPrincipalName="+loginName+"))",attrs,false);
            while (result.hasMore()){
                nextEntry = result.next();
            }
        } catch (LDAPException e) {
            e.printStackTrace();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            return nextEntry;
        }
    }

}
