package com.zcareze.zkyandroidweb.utils;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.os.Handler;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 12 月 16 日 14 : 32
 */

public class ScanUtil extends Thread {

    private final BluetoothAdapter adapter;

    public ScanUtil(Context context) {
        BluetoothManager mBluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        adapter = mBluetoothManager.getAdapter();
    }

    @Override
    public void run() {
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                adapter.stopLeScan(callback);
                start();
            }
        }, 10000);
        adapter.startLeScan(callback);
    }

    private BluetoothAdapter.LeScanCallback callback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) {
            if (device != null) {

            }
        }
    };
}
