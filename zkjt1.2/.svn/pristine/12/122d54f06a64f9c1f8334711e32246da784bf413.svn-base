package com.zcareze.zkyandroidweb.proxy;

import com.zcareze.core.service.CoreService;
import com.zcareze.regional.service.BaseDictionaryService;
import com.zcareze.regional.service.HealthOrderService;
import com.zcareze.regional.service.ResidentContractService;
import com.zcareze.regional.service.ResidentHealthService;
import com.zcareze.regional.service.ResidentService;
import com.zcareze.rpc.ProxyFactory;
import com.zcareze.rpc.util.HttpClientUtil;
import com.zcareze.zkyandroidweb.utils.L;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 08 月 30 日 15 : 39
 */
public class ProxyFactoryManager {
    //    public static final String URL = "http://api.test.zcareze.com";//外网地址
    public static String URL;//外网地址
    //    public static String URL = "http://192.168.0.124:82";   //内网地址
    public static final String API_VERSION = "v1_0";
    //    private static String API_ADDRESS = URL + "/" + API_VERSION;
    private static ProxyFactory instance;

    private ProxyFactoryManager() {
    }


    public static ProxyFactory getInstance() {
        if (instance == null) {
            synchronized (ProxyFactoryManager.class) {
                if (instance == null) {
                    instance = new ProxyFactory(URL + "/" + API_VERSION);
                }
            }
        }
        return instance;
    }


    public static void release() {
        HttpClientUtil.cookieValue = null;
        instance = null;
    }


    /**
     * 获取 基础字典更新服务.常用的是用于更新数据库中的表.
     * 1.获取版本号.
     * 2.获取数据等等.
     *
     * @return
     */
    public static BaseDictionaryService getBaseDictionaryServiceInstance() {
        return getInstance().getInstance(BaseDictionaryService.class);
    }

    public static ResidentHealthService getResidentHealthService() {
        return getInstance().getInstance(ResidentHealthService.class);
    }

    public static ResidentService getResidentServiceInstance() {
        return getInstance().getInstance(ResidentService.class);
    }

    public static ResidentContractService getResidentContractServiceInstance() {
        return getInstance().getInstance(ResidentContractService.class);

    }

    public static ResidentHealthService getResidentHealthServiceInstance() {
        return getInstance().getInstance(ResidentHealthService.class);
    }

    public static CoreService getCoreServiceInstance() {
        return getInstance().getInstance(CoreService.class);
    }

    public static HealthOrderService getHealthOrderService() {
        return getInstance().getInstance(HealthOrderService.class);
    }

    public static void changeApiAddress(String apiAddress) {
        URL = apiAddress;
        L.d(URL);

    }
}
