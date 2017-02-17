package com.zcareze.zkyandroidweb.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;


import com.zcareze.zkyandroidweb.activity.LoginActivity;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 10 月 11 日 12 : 08
 */

public class ActivityManagerUtil {

    private ArrayList<Activity> activitys;

    private ActivityManagerUtil() {
    }

    private static ActivityManagerUtil instance;

    public static synchronized ActivityManagerUtil getInstance() {
        if (instance == null)
            instance = new ActivityManagerUtil();
        return instance;
    }


    /**
     * 退出所有app
     */
    public void exit(Context context) {
        L.i("网络访问超时进行重启");
        Intent intent = new Intent(context, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
        try {
            Iterator<Activity> iterator = activitys.iterator();
            while (iterator.hasNext()) {
                Activity next = iterator.next();
                if (next != null) {
                    next.finish();
                }
            }
        } catch (Exception e) {
            L.e("重启,退出抛出异常");
        }
    }


    /**
     * 删除Activity
     *
     * @param activity
     */
    public void removeActivity(Activity activity) {
        Iterator<Activity> iterator = activitys.iterator();
        while (iterator.hasNext()) {
            Activity next = iterator.next();
            if (next != null && next.equals(activity)) {
                iterator.remove();
            }
        }
    }


    /**
     * Activity的栈.
     *
     * @param activity
     */
    public void addActivity(Activity activity) {
        if (activitys == null) {
            activitys = new ArrayList<>();
        }
        if (!activitys.contains(activity)) {
            activitys.add(activity);
        }
    }
}
