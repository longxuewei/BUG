package com.zcareze.zkyandroidweb.devicepulgin;

import android.content.Context;

import com.zcareze.zkyandroidweb.viewinterface.OnMonitorDataReceiver;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 09 月 04 日 09 : 52
 * <p/>
 * 连接的公共接口.
 */
public interface IPlugin {

    /**
     * 设备连接.
     */
    boolean connectDevice();

    /**
     * 测试数据回传解析
     *
     * @param data
     */
    void parseData(String data);


    /**
     * 断开连接
     */
    void disConnectDivice();

}
