package com.coocaa.element.core.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

/**
 * Created by panwei on 16/10/17.
 */
@Configuration
@MapperScan("com.coocaa.element.core.dao")
public class MybatisConfig {
    @Autowired
    DataSource dataSource;

    /**
     * 创建数据源 master
     *
     * @return
     * @throws Exception
     */
//    @Bean
//    @ConfigurationProperties(prefix = "master")
//    public DataSource myMasterDataSource() throws Exception {
//        return DataSourceBuilder.create().build();
//    }

    /**
     * 创建数据源 slave1
     *
     * @return
     * @throws Exception
     */
//    @Bean
//    @ConfigurationProperties(prefix = "slave1")
//    public DataSource mySlave1DataSource() throws Exception {
//        return DataSourceBuilder.create().build();
//    }

    /**
     * 创建数据源 slave2
     *
     * @return
     * @throws Exception
     */
//    @Bean
//    @ConfigurationProperties(prefix = "slave2")
//    public DataSource mySlave2DataSource() throws Exception {
//        return DataSourceBuilder.create().build();
//    }

    /**
     * @Primary 该注解表示在同一个接口有多个实现类可以注入的时候，默认选择哪一个，而不是让@autowire注解报错
     * @Qualifier 根据名称进行注入，通常是在具有相同的多个类型的实例的一个注入（例如有多个DataSource类型的实例）
     *
     * @param myMasterDataSource
     * @param mySlave1DataSource
     * @param mySlave2DataSource
     * @return
     */
//    @Bean
//    @Primary
//    public DynamicDataSource dataSource(@Qualifier("myMasterDataSource") DataSource myMasterDataSource,
//                                        @Qualifier("mySlave1DataSource") DataSource mySlave1DataSource,
//                                        @Qualifier("mySlave2DataSource") DataSource mySlave2DataSource) {
//        Map<Object, Object> targetDataSources = new HashMap<>();
//        targetDataSources.put(DataSourceType.master, myMasterDataSource);
//        targetDataSources.put(DataSourceType.slave1, mySlave1DataSource);
//        targetDataSources.put(DataSourceType.slave2, mySlave2DataSource);
//
//        DynamicDataSource dataSource = new DynamicDataSource();
//        dataSource.setTargetDataSources(targetDataSources); // 该方法是AbstractRoutingDataSource的方法
//        dataSource.setDefaultTargetDataSource(myMasterDataSource); // 默认的datasource设置为myTestDbDataSource
//
//        return dataSource;
//    }

    /**
     * 根据数据源创建SqlSessionFactory
     *
     * @param dataSource
     * @return
     * @throws Exception
     */
    @Bean(name = "sqlSessionFactory")
    public SqlSessionFactory sqlSessionFactory() throws Exception {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource); // 指定数据源(这个必须有，否则报错)
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sqlSessionFactoryBean.setMapperLocations(resolver.getResources("classpath:/mybatis/**/*.xml"));
        return sqlSessionFactoryBean.getObject();
    }
}
