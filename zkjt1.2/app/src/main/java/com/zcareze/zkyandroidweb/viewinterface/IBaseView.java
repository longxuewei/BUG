package com.zcareze.zkyandroidweb.viewinterface;

import android.content.Context;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 10 日 18 : 41
 */

public interface IBaseView {
    /**
     * 视图层提供Context 供逻辑层使用
     *
     * @return
     */
    Context getContext();

    /**
     * 逻辑层提供提示信息同于显示
     *
     * @param message
     */
    void showMessage(String message);
}
