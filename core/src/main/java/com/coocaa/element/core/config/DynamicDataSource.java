package com.coocaa.element.core.config;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

/**
 * Created by panwei on 16/10/31.
 */

/**
 动态数据源（需要继承AbstractRoutingDataSource）
 作用：使用DatabaseContextHolder获取当前线程的DatabaseType
*/
public class DynamicDataSource extends AbstractRoutingDataSource {

    @Override
    protected Object determineCurrentLookupKey() {
        return DynamicDataSourceContextHolder.getDataSourceType();
    }
}
