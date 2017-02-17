package com.zcareze.zkyandroidweb.utils;

import android.content.Context;
import android.widget.Toast;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 08 月 26 日 14 : 59
 *
 * Toast的工具类,  吐司调试信息 调用  dl或者ds 方法. 正常提示用户,调用l或者s方法.
 */
public class T {
    private static final String DEFAULT_TAG = "Debug";
    private static final boolean isDebug = true;

    /**
     * Toast 模式 长显示
     *
     * @param context
     * @param message
     */
    public static void dl(Context context, String message) {
        if (isDebug) {
            Toast.makeText(context, message, Toast.LENGTH_LONG).show();
        }
    }

    /**
     * Toast Debug 模式 短显示
     *
     * @param context
     * @param message
     */
    public static void ds(Context context, String message) {
        if (isDebug) {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * 正常模式下的 Toast 长显示
     *
     * @param context
     * @param message
     */
    public static void l(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_LONG).show();
    }

    /**
     * 正常模式下的 Toast 短显示
     *
     * @param context
     * @param message
     */
    public static void s(Context context, String message) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show();
    }

}
