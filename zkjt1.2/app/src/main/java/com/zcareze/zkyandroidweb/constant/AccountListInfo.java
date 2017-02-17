package com.zcareze.zkyandroidweb.constant;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 12 月 14 日 09 : 54
 */

public class AccountListInfo {
    /**
     * 手机号。注册时必须填写
     */
    public static final String ID = "id";
    public static final String MOBILE = "mobile";

    /**
     * 昵称。通过自注册时，自行填写；经雇员或居民建档注册，默认为姓名
     */
    public static final String NICKNAME = "nickname";

    /**
     * 密码。个人密码的加密转换码，使用sha
     */
    public static final String PASSWORD = "password";

    /**
     * 注册时间
     */
    public static final String REGTIME = "regtime";

    /**
     * 注册方式。0-用户自注册(直接同步激活)；1-雇员登记注册；2-居民登记注册
     */
    public static final String REGMODE = "regMode";

    /**
     * 注册来源。首次雇员或居民注册时，描述来源的区域云
     */
    public static final String REGSOURCE = "regSource";

    /**
     * 状态。0-未激活;1-激活;-1-禁止(从管理角度考虑将账户查封，需要管理员操作才能恢复)
     */
    public static final String STATUS = "status";

    /**
     * 区域云ID
     */
    public static final String CLOUDID = "cloudid";
}
