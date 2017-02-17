package com.zcareze.zkyandroidweb.utils;

import android.content.Context;

import com.tencent.bugly.crashreport.CrashReport;
import com.zcareze.zkyandroidweb.constant.AccountListInfo;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 01 月 16 日 11 : 30
 */

public class CatchUtil {
    public static void postCatch(String message, Context context) {
        String o = (String) SPUtil.get(context, AccountListInfo.MOBILE, "文件中没有查找到此用户的手机号:");
        String postMessage = "异常提示信息: " + message + "\n" + "异常用户: " + o;
        CrashReport.postCatchedException(new Throwable(postMessage));
    }
}
