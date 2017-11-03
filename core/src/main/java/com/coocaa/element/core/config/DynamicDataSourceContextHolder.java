package com.coocaa.element.core.config;

/**
 * Created by panwei on 16/10/31.
 */
import com.coocaa.element.core.enums.DataSourceType;

/**
 * 作用：
 * 1、保存一个线程安全的DatabaseType容器
 */
public class DynamicDataSourceContextHolder {
    private static final ThreadLocal<DataSourceType> contextHolder = new ThreadLocal<>();

    public static void setDataSourceType(DataSourceType type) {
        contextHolder.set(type);
    }

    public static DataSourceType getDataSourceType() {
        return contextHolder.get();
    }

}
