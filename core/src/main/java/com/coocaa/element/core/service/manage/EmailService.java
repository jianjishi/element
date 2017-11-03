package com.coocaa.element.core.service.manage;

import com.coocaa.element.core.model.manage.Email;
import com.coocaa.element.core.service.Services;

import java.util.HashMap;

/**
 * Created by panwei on 16/10/17.
 */
public interface EmailService extends Services<Email> {
    boolean validateEmailParams(HashMap<String, Object> rtn, Email email);
}
