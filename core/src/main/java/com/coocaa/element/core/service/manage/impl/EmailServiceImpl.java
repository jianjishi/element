package com.coocaa.element.core.service.manage.impl;

import com.coocaa.element.core.dao.manage.EmailMapper;
import com.coocaa.element.core.model.manage.Email;
import com.coocaa.element.core.service.ServicesImpl;
import com.coocaa.element.core.service.manage.EmailService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

/**
 * Created by panwei on 16/10/17.
 */
@Service
public class EmailServiceImpl extends ServicesImpl<Email> implements EmailService {
    @Autowired
    EmailMapper emailMapper;

    @Override
    public boolean validateEmailParams(HashMap<String, Object> rtn, Email email) {
        if (email != null) {
            String emailName = email.getEmailName(), remarks = email.getRemarks();
            Integer type = email.getType(), status = email.getStatus();
            if (StringUtils.isBlank(emailName) || StringUtils.isBlank(remarks)
                    || type == null || status == null) {
                rtn.put("msg", "请填写完整");
                return false;
            }
            HashMap<String, Object> params = new HashMap<>();
            params.put("emailName", emailName);
            params.put("type", type);
            List<Email> emailList = emailMapper.findBy(params);
            Integer id = email.getId();
            if (id == null) { // add
                if (emailList.size() > 0) {
                    rtn.put("msg", "该类型的邮箱已存在");
                    return false;
                }
            } else { // update
                if (emailList.size() > 0) {
                    if (!Objects.equals(id, emailList.get(0).getId())) {
                        rtn.put("msg", "该类型的邮箱已存在");
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
}
