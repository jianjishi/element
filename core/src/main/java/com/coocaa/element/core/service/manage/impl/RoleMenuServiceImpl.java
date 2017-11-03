package com.coocaa.element.core.service.manage.impl;

import com.coocaa.element.core.dao.manage.MenuMapper;
import com.coocaa.element.core.dao.manage.RoleMenuMapper;
import com.coocaa.element.core.model.manage.Menu;
import com.coocaa.element.core.model.manage.RoleMenu;
import com.coocaa.element.core.model.view.RoleMenuView;
import com.coocaa.element.core.service.ServicesImpl;
import com.coocaa.element.core.service.manage.RoleMenuService;
import com.coocaa.magazine.utils.enums.DeleteFlagEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by panwei on 16/10/17.
 */
@Service
public class RoleMenuServiceImpl extends ServicesImpl<RoleMenu> implements RoleMenuService {
    @Autowired
    RoleMenuMapper roleMenuMapper;
    @Autowired
    MenuMapper menuMapper;

    @Override
    public List<RoleMenuView> findViewBy(HashMap<String, Object> params) {
        return roleMenuMapper.findViewBy(params);
    }

    @Override
    public void deleteByRoleId(Integer roleId) {
        roleMenuMapper.deleteByRoleId(roleId);
    }

    /**
     * 获取主页左侧菜单
     *
     * @param parentId:父id
     * @param roleIdList:用户对用的多角色id
     * @return
     */
    @Override
    public List<HashMap<String, Object>> getMenus(Integer parentId, List<Integer> roleIdList) {
        List<HashMap<String, Object>> result = new ArrayList<>();
        HashMap<String, Object> params = new HashMap<>();
        params.put("roleIdList", roleIdList);
        params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
        params.put("isShow", 1);// 默认菜单
        if (parentId != null) {
            params.put("parentId", parentId);
        }

        List<RoleMenuView> menus = roleMenuMapper.findViewBy(params);
        for (RoleMenuView menu : menus) {
            HashMap<String, Object> item = new HashMap<>();
            item.put("id", menu.getMenuId());
            item.put("icons", menu.getIcon());
            item.put("name", menu.getName());
            item.put("url", menu.getHref());

            List<HashMap<String, Object>> child = getMenus(menu.getMenuId(), roleIdList);
            item.put("child", child);
            result.add(item);
        }

        return result;
    }

    @Override
    public void insertRoleMenu(Integer id, Integer[] menuIds) {
        if (id != null) {
            //插入选择的权限
            for (Integer menuId : menuIds) {
                RoleMenu roleMenu = new RoleMenu();
                roleMenu.setMenuId(Integer.valueOf(menuId));
                roleMenu.setRoleId(id);
                roleMenuMapper.insert(roleMenu);
            }
        }
    }

    /**
     * 通过roleId获取该角色所拥有的所有叶子菜单
     *
     * @param roleId
     * @return
     */
    @Override
    public List<Integer> getMenuIdsByRoleId(Integer roleId) {
        List<Integer> menuIds = new ArrayList<>();
        // 根据roleId取到该角色所拥有的菜单列表
        HashMap<String, Object> params = new HashMap<>();
        params.put("roleId", roleId);
        List<RoleMenu> roleMenuList = roleMenuMapper.findBy(params);
        // 取出所有的叶子菜单
        for (RoleMenu item : roleMenuList) {
            Integer menuId = item.getMenuId();
            // 查出该节点的子菜单
            params = new HashMap<>();
            params.put("delFlag", DeleteFlagEnum.NORMAL.getCode());
            params.put("parentId", menuId);
            List<Menu> menuList = menuMapper.findBy(params);
            if (menuList.size() == 0) { // 若无子菜单,表明是叶子菜单,放进menuIds中
                menuIds.add(menuId);
            }
        }
        return menuIds;
    }
}
