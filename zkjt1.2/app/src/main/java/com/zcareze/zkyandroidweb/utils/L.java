package com.zcareze.zkyandroidweb.utils;

import android.util.Log;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 08 月 26 日 14 : 59
 * <p/>
 * Log工具类
 */
public class L {

    private static final String DEFAULT_TAG = "--Debug--";
    private static final boolean isDebug = true;

    public static void i(String tag, String message) {
        if (isDebug) {
            Log.i(tag, message);
        }
    }

    public static void i(String message) {
        if (isDebug) {
            Log.i(DEFAULT_TAG, message);
        }
    }

    public static void d(String tag, String message) {
        if (isDebug) {
            Log.d(tag, message);
        }
    }

    public static void d(String message) {
        if (isDebug) {
            Log.d(DEFAULT_TAG, message);
        }
    }

    public static void e(String tag, String message) {
        if (isDebug) {
            Log.e(tag, message);
        }
    }

    public static void e(String message) {
        if (isDebug) {
            Log.e(DEFAULT_TAG, message);
        }
    }

    public static void v(String tag, String message) {
        if (isDebug) {
            Log.v(tag, message);
        }
    }

    public static void v(String message) {
        if (isDebug) {
            Log.v(DEFAULT_TAG, message);
        }
    }

    public static void w(String tag, String message) {
        if (isDebug) {
            Log.w(tag, message);
        }
    }

    public static void w(String message) {
        if (isDebug) {
            Log.w(DEFAULT_TAG, message);
        }
    }
}
