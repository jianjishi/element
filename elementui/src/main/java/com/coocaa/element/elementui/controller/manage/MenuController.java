package com.coocaa.element.elementui.controller.manage;

import com.coocaa.element.common.config.CurrencyConfig;
import com.coocaa.element.common.controller.BaseController;
import com.coocaa.element.core.model.manage.Menu;
import com.coocaa.element.core.model.view.MenuView;
import com.coocaa.element.core.service.manage.MenuService;
import com.coocaa.element.core.service.manage.RoleMenuService;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;

/**
 * Created by panwei on 2017/6/2.
 */
@Controller
@RequestMapping("${adminPath}/manage/menu")
public class MenuController extends BaseController {
    @Autowired
    MenuService menuService;
    @Autowired
    RoleMenuService roleMenuService;
    @Autowired
    CurrencyConfig currencyConfig;

    private final static String templatePre = "/manage/menu/";

    @RequiresPermissions("sysSetup:menu:index")
    @RequestMapping("/index")
    public String index() {
        return getViews(templatePre, "index");
    }

    @RequiresPermissions("sysSetup:menu:index")
    @RequestMapping("/get_menus_json")
    @ResponseBody
    public Object getMenusJson() {
        HashMap<String, Object> rtn = new HashMap<>();
        List<MenuView> menuTreeTable = new ArrayList<>();
        HashMap<String, Object> params = new HashMap<>();
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        List<MenuView> allMenu = menuService.findAllMenu(params);
        menuService.getMenuTreeTable(menuTreeTable, allMenu, 0);
        rtn.put("menuTreeTable", menuTreeTable);
        return rtn;
    }

    @RequiresPermissions("sysSetup:menu:add")
    @RequestMapping("/addPage")
    public String addPage() {
        return getViews(templatePre, "add");
    }

    @RequiresPermissions("sysSetup:menu:edit")
    @RequestMapping("/editPage")
    public String editPage(Integer id, ModelMap modelMap) {
        Menu menu = new Menu();
        if (id != null) {
            menu = menuService.getEntityById(id);
            Integer parentId = menu.getParentId();
            if (parentId.equals(0)) {
                menu.setParentName("顶级菜单");
            } else {
                Menu parentMenu = menuService.getEntityById(parentId);
                if (parentMenu != null) {
                    menu.setParentName(parentMenu.getName());
                }
            }
        }
        modelMap.put("model", menu);
        return getViews(templatePre, "edit");
    }

    @RequestMapping("/menuTreeSelect")
    public String menuTreeSelect(ModelMap modelMap) {
        return getViews(templatePre, "menuTreeSelect");
    }

    @RequestMapping("/get_menu_tree_json")
    @ResponseBody
    public Object getMenuTreeJson() {
        List<HashMap<String, Object>> menuTree;
        String menuTreeKey = currencyConfig.getMenuTreeKey();
        if (getSessionCache(menuTreeKey) == null) {
            menuTree = menuService.getAllMenu(0);// 获取所有菜单(具有层次结构)
            putSessionCache(menuTreeKey, menuTree);
        } else {
            menuTree = (List<HashMap<String, Object>>) getSessionCache(menuTreeKey);
        }
        return menuTree;
    }

    @RequestMapping("/icon")
    public String icon(ModelMap modelMap, Integer id) {
        if (id == null) {
            modelMap.put("whichPage", "addPage");
        } else {
            modelMap.put("whichPage", "editPage?id=" + id);
        }
        return getViews(templatePre, "icon");
    }

    @RequiresPermissions("sysSetup:menu:add")
    @RequestMapping("/add")
    @ResponseBody
    public Object add(Menu menu) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (menuService.validateMenuParams(rtn, menu)) {
            menu.setCreateBy(getSessionCache("userId").toString());
            menuService.insert(menu);
            Integer id = menu.getId();
            Integer depth = menuService.getDepth(id);
            menu.setDepth(depth);
            menuService.update(menu);
            return true;
        }
        return rtn;
    }

    @RequiresPermissions("sysSetup:menu:edit")
    @RequestMapping("/update")
    @ResponseBody
    public Object update(Menu menu) {
        HashMap<String, Object> rtn = new HashMap<>();

        if (menuService.validateMenuParams(rtn, menu)) {
            menu.setUpdateBy(getSessionCache("userId").toString());
            menu.setUpdateDate(new Date());
            Integer depth = menuService.getDepth(menu.getId());
            menu.setDepth(depth);
            menuService.update(menu);
            return true;
        }
        return rtn;
    }

    @RequestMapping("/updateSort")
    @ResponseBody
    public Object updateSort(Integer id, Integer sort) {
        HashMap<String, Object> rtn = new HashMap<>();
        if (id != null) {
            Menu menu = new Menu();
            menu.setId(id);
            menu.setSort(sort);
            menuService.update(menu);
            return true;
        }
        rtn.put("msg", "id为空, 更新排序失败");
        return rtn;
    }

    @RequiresPermissions("sysSetup:menu:changeStatus")
    @RequestMapping("/changeStatus")
    @ResponseBody
    public Object changeStatus(Integer id, Integer isShow) {
        Menu menu = menuService.getEntityById(id);
        if (menu != null) {
            menu.setIsShow(isShow);
            menuService.update(menu);
        }
        return true;
    }

    @RequiresPermissions("sysSetup:menu:del")
    @RequestMapping("/del")
    @ResponseBody
    public Object delete(Integer id) {
        if (id == null || id.equals(0)) {
            return false;
        } else {
            Menu menu = menuService.getEntityById(id);
            if (menu != null) {
                menu.setDelFlag(DeleteFlagEnum.DELETED.getCode());
                menuService.update(menu);
            }
            return true;
        }
    }

}
