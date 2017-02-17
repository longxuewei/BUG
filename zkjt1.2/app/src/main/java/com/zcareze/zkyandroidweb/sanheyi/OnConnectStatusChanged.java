package com.zcareze.zkyandroidweb.sanheyi;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;

import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 01 月 13 日 15 : 58
 */

public interface OnConnectStatusChanged {
    //成功连接
    void onConnectSuccess(BluetoothSocket socket, BluetoothDevice device);

    void onConnectFailed();

    void onDataReceive(List<Byte> data);
}
