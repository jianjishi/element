package com.coocaa.element.core.dao.manage;

import com.coocaa.element.core.dao.Mappers;
import com.coocaa.element.core.model.manage.Office;
import com.coocaa.element.core.model.view.OfficeView;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface OfficeMapper extends Mappers<Office> {
    List<OfficeView> findAllOffice(HashMap<String, Object> params);
}
