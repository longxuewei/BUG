package com.zcareze.zkyandroidweb.viewinterface;

import com.zcareze.zkyandroidweb.bean.MeasureResult;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 11 : 36
 */

public interface OnMonitorDataReceiver {
    void onDataReceive(MeasureResult result,String operationMode);

    void onConnectStatusChanged(boolean status);
}
