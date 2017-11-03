package com.coocaa.element.core.service.manage;

import com.coocaa.element.core.model.manage.Menu;
import com.coocaa.element.core.model.view.MenuView;
import com.coocaa.element.core.service.Services;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface MenuService extends Services<Menu> {
    List<MenuView> findAllMenu(HashMap<String, Object> params);
    void getMenuTreeTable(List<MenuView> menuTreeTable, List<MenuView> allMenu, Integer menuRootId);

    List<HashMap<String, Object>> getAllMenu(Integer parentId);

    boolean validateMenuParams(HashMap<String, Object> rtn, Menu menu);

    Integer getDepth(Integer menuId);
}
