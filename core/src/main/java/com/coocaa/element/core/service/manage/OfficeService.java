package com.coocaa.element.core.service.manage;

import com.coocaa.element.core.model.manage.Office;
import com.coocaa.element.core.model.view.OfficeView;
import com.coocaa.element.core.service.Services;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface OfficeService extends Services<Office> {
    List<OfficeView> findAllOffice(HashMap<String, Object> params);
    void getOfficeTreeTable(List<OfficeView> officeTreeTable, List<OfficeView> allOffice, Integer officeRootId);

    List<HashMap<String, Object>> getAllOffice(Integer parentId);

    boolean validateOfficeParams(HashMap<String, Object> rtn, Office office);

    Integer getDepth(Integer officeId);
}
