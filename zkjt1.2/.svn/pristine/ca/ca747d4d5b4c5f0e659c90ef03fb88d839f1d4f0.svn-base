package com.zcareze.zkyandroidweb.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import com.zcareze.zkyandroidweb.activity.LoginActivity;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 01 月 12 日 15 : 17
 */

public class LaunchReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (!TextUtils.isEmpty(action)) {
            if (action.equals(Intent.ACTION_BOOT_COMPLETED)) {
                //开机广播:
                Intent launchActivity = new Intent(context, LoginActivity.class);
                launchActivity.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                launchActivity.setAction("android.intent.action.MAIN");
                launchActivity.addCategory("android.intent.category.LAUNCHER");
                context.startActivity(launchActivity);
            }
        }

    }
}
