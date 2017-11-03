package com.coocaa.element.core.service;


import com.coocaa.element.core.dao.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;

/**
 * Created by Mr giraffe on 15/9/8.
 */
public class ServicesImpl<T> implements Services<T> {
    @Autowired
    public Mappers<T> mappers;

    /**
     * 插入
     *
     * @param t
     */
    public Integer insert(T t) {
        return mappers.insert(t);
    }

    /**
     * 更新
     *
     * @param t
     */
    public void update(T t) {
        mappers.update(t);
    }

    /**
     * 删除
     *
     * @param id
     */
    public void delete(Integer id) {
        mappers.delete(id);
    }

    /**
     * 计数
     *
     * @param params
     * @return
     */
    public Integer countBy(HashMap<?, ?> params) {
        return mappers.countBy(params);
    }

    /**
     * 查询列表
     *
     * @param params
     * @return
     */
    public List<T> findBy(HashMap<?, ?> params) {
        return mappers.findBy(params);
    }

    /**
     * 按id查询
     *
     * @param id
     * @return
     */
    public T getEntityById(Integer id) {
        return mappers.getEntityById(id);
    }
}
