package com.coocaa.element.core.service;

import java.util.HashMap;
import java.util.List;

/**
 * Created by Mr giraffe on 15/9/8.
 */
public interface Services<T> {

    /**
     * 插入
     *
     * @param t
     */
    Integer insert(T t);

    /**
     * 更新
     *
     * @param t
     */
    void update(T t);


    /**
     * 删除
     *
     * @param id
     */
    void delete(Integer id);

    /**
     * 计数
     *
     * @param params
     * @return
     */
    Integer countBy(HashMap<?, ?> params);

    /**
     * 查询列表
     *
     * @param params
     * @return
     */
    List<T> findBy(HashMap<?, ?> params);

    /**
     * 按id查询
     *
     * @param id
     * @return
     */
    T getEntityById(Integer id);
}
