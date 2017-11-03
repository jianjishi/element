package com.coocaa.element.elementui.controller.manage;

import com.coocaa.element.common.config.CurrencyConfig;
import com.coocaa.element.common.controller.BaseController;
import com.coocaa.element.core.model.manage.Office;
import com.coocaa.element.core.model.view.OfficeView;
import com.coocaa.element.core.service.manage.OfficeService;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 2017/6/2.
 */
@Controller
@RequestMapping("${adminPath}/manage/office")
public class OfficeController extends BaseController {
    @Autowired
    CurrencyConfig currencyConfig;
    @Autowired
    OfficeService officeService;

    private final static String templatePre = "/manage/office/";

    @RequiresPermissions("sysAdministrative:office:index")
    @RequestMapping("/index")
    public String index() {
        return getViews(templatePre, "index");
    }

    @RequiresPermissions("sysAdministrative:office:index")
    @RequestMapping("/get_offices_json")
    @ResponseBody
    public Object getOfficesJson() {
        HashMap<String, Object> rtn = new HashMap<>();
        List<OfficeView> officeTreeTable = new ArrayList<>();
        HashMap<String, Object> params = new HashMap<>();
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        List<OfficeView> allOffice = officeService.findAllOffice(params);
        officeService.getOfficeTreeTable(officeTreeTable, allOffice, 0);
        rtn.put("officeTreeTable", officeTreeTable);
        return rtn;
    }

    @RequiresPermissions("sysAdministrative:office:add")
    @RequestMapping("/addPage")
    public String addPage() {
        return getViews(templatePre, "add");
    }

    @RequiresPermissions("sysAdministrative:office:edit")
    @RequestMapping("/editPage")
    public String editPage(Integer id, ModelMap modelMap) {
        Office office = new Office();
        if (id != null) {
            office = officeService.getEntityById(id);
            Integer parentId = office.getParentId();
            if (parentId.equals(0)) {
                office.setParentName("顶级机构");
            } else {
                Office parentOffice = officeService.getEntityById(parentId);
                if (parentOffice != null) {
                    office.setParentName(parentOffice.getName());
                }
            }
        }
        modelMap.put("model", office);
        return getViews(templatePre, "edit");
    }

    @RequestMapping("/officeTreeSelect")
    public String officeTreeSelect(ModelMap modelMap) {
        return getViews(templatePre, "officeTreeSelect");
    }

    @RequestMapping("/get_office_tree_json")
    @ResponseBody
    public Object getOfficeTreeJson() {
        List<HashMap<String, Object>> officeTree;
        String officeTreeKey = currencyConfig.getOfficeTreeKey();
        if (getSessionCache(officeTreeKey) == null) {
            officeTree = officeService.getAllOffice(0);
            putSessionCache(officeTreeKey, officeTree);
        } else {
            officeTree = (List<HashMap<String, Object>>) getSessionCache(officeTreeKey);
        }
        return officeTree;
    }

    @RequiresPermissions("sysAdministrative:office:add")
    @RequestMapping("/add")
    @ResponseBody
    public Object add(Office office) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (officeService.validateOfficeParams(rtn, office)) {
            office.setCreateBy(getSessionCache("userId").toString());
            officeService.insert(office);
            Integer id = office.getId();
            Integer depth = officeService.getDepth(id);
            office.setDepth(depth);
            officeService.update(office);
            return true;
        }
        return rtn;
    }

    @RequiresPermissions("sysAdministrative:office:edit")
    @RequestMapping("/update")
    @ResponseBody
    public Object update(Office office) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (officeService.validateOfficeParams(rtn, office)) {
            office.setUpdateBy(getSessionCache("userId").toString());
            office.setUpdateDate(new Date());
            Integer depth = officeService.getDepth(office.getId());
            office.setDepth(depth);
            officeService.update(office);
            return true;
        }
        return rtn;
    }

    @RequiresPermissions("sysAdministrative:office:changeStatus")
    @RequestMapping("/changeStatus")
    @ResponseBody
    public Object changeStatus(Integer id, Integer useable) {
        Office office = officeService.getEntityById(id);
        if (office != null) {
            office.setUseable(useable);
            officeService.update(office);
        }
        return true;
    }

    @RequiresPermissions("sysAdministrative:office:del")
    @RequestMapping("/del")
    @ResponseBody
    public Object delete(Integer id) {
        if (id == null || id.equals(0)) {
            return false;
        } else {
            Office office = officeService.getEntityById(id);
            if (office != null) {
                office.setDelFlag(DeleteFlagEnum.DELETED.getCode());
                officeService.update(office);
            }
            return true;
        }
    }

}
