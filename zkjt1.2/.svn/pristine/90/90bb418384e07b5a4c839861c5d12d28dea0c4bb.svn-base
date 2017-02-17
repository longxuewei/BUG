package com.zcareze.zkyandroidweb.utils;

import android.bluetooth.BluetoothProfile;

import com.zcareze.zkyandroidweb.constant.BLeStatus;
import com.zcareze.zkyandroidweb.devicepulgin.BaseBlePlugin;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 12 月 22 日 17 : 05
 */

public class ConnectProcessThread extends Thread {
    private BaseBlePlugin plugin;

    public ConnectProcessThread(BaseBlePlugin plugin) {
        this.plugin = plugin;
    }

    @Override
    public void run() {
        if (plugin != null) {
            BLeStatus status = plugin.connect();
            if (status != BLeStatus.NORMAL ) {
                plugin.changeStatus(BluetoothProfile.STATE_DISCONNECTED);
            }
        }
    }
}
