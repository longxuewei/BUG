package com.zcareze.zkyandroidweb.sanheyi;

import android.bluetooth.BluetoothDevice;
import android.content.Context;

import com.zcareze.zkyandroidweb.devicepulgin.BlueToothHelper;
import com.zcareze.zkyandroidweb.utils.L;


/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 01 月 13 日 19 : 03
 */

public class SanHeYiThread extends Thread {
    private BluetoothDevice device;
    private Context context;


    public SanHeYiThread(BluetoothDevice device, Context context) {
        this.device = device;
        this.context = context;
        this.setName("2.0蓝牙线程");

    }

    @Override
    public void run() {
        BlueToothHelper.isScanBluetooth20 = true;
        SanHeYi instance = SanHeYi.getInstance(device, context);
        int count = 0;
        while (BlueToothHelper.isMainPage&&
                BlueToothHelper.blueON&&BlueToothHelper.screenON) {
            L.d("尝试次数: " + count++);
            instance.connect();
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        BlueToothHelper.isScanBluetooth20 = false;
    }


}
