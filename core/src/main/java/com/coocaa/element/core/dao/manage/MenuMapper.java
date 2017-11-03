package com.coocaa.element.core.dao.manage;

import com.coocaa.element.core.dao.Mappers;
import com.coocaa.element.core.model.manage.Menu;
import com.coocaa.element.core.model.view.MenuView;

import java.util.HashMap;
import java.util.List;

/**
 * Created by panwei on 16/10/17.
 */
public interface MenuMapper extends Mappers<Menu> {
    List<MenuView> findAllMenu(HashMap<String, Object> params);
}
