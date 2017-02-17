package com.zcareze.zkyandroidweb.devicepulgin;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

import com.tencent.bugly.crashreport.CrashReport;
import com.zcareze.zkyandroidweb.constant.BLeStatus;
import com.zcareze.zkyandroidweb.sanheyi.SanHeYiThread;
import com.zcareze.zkyandroidweb.utils.L;
import com.zcareze.zkyandroidweb.utils.T;

import java.util.Set;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 28 日 18 : 00
 */


@SuppressWarnings("ALL")
public class BlueToothHelper {
    private static final long SCAN_TIME_OUT = 10000;
    private static BlueToothHelper instance;
    private static Context context;
    private static BluetoothAdapter adapter;
    public static final String CONNECT_TYPE_MONITOR = "com.zcareze.zkyandroidweb.devicepulgin.BleToothHelper.monitor";
    public static final String CONNECT_TYPE_BIND = "com.zcareze.zkyandroidweb.devicepulgin.BleToothHelper.bind";
    public static boolean isBind = false;//当前是否处于绑定状态.
    public static boolean isMainPage = true;
    public static final String SANHEYI_DEVICE_ADDRESS = "00:23:01";
    public static final String SANHEYI_DEVICE_NAME = "BENECHECK";
    public static boolean isScanBluetooth20 = false;
    public static boolean blueON = true;//蓝牙是否开启
    public static boolean screenON = true;//屏幕是否开启


    public static void init(Context context) {
        adapter = getAdapter(context);
    }


    /**
     * 停止扫描
     *
     * @param callback
     */
    public static void stopScan(BluetoothAdapter.LeScanCallback callback) {
        if (adapter != null) {
            adapter.stopLeScan(callback);
            L.e("------蓝牙扫描停止!");
        }
    }


    /**
     * 连接蓝牙
     *
     * @param address
     * @param mGattCallback
     */
    public static BLeStatus connect(String address, BluetoothGattCallback mGattCallback) {

        try {
            if (adapter == null)
                return BLeStatus.NOTSUPPORT;
            if (!adapter.enable())
                return BLeStatus.NOTOPEND;
            BluetoothDevice remoteDevice = adapter.getRemoteDevice(address);
            remoteDevice.connectGatt(context, true, mGattCallback);
            return BLeStatus.NORMAL;
        } catch (Exception e) {
            L.d("连接蓝牙失败");
            CrashReport.postCatchedException(new Throwable("连接异常"));
            return BLeStatus.OUTHER;
        }
    }


    /**
     * 监测是否支持BLE设备
     *
     * @param context
     * @return
     */
    private static BluetoothAdapter getAdapter(Context context) {
        boolean isSupportBle = context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE);
        if (isSupportBle) {
            BluetoothManager mBluetoothManager = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
            return mBluetoothManager.getAdapter();
        } else {
            return null;
        }
    }


    public static void scanSanHeYi() {
        if (getDevice() == null)
            return;
        if (!BlueToothHelper.isScanBluetooth20) {
            SanHeYiThread thread = new SanHeYiThread(getDevice(), context);
            thread.start();
        }
    }


    /**
     * start scaning devices
     *
     * @param callback
     * @param isBind
     * @param hasSanheyi 是否开启三合一的蓝牙.
     * @return
     */
    public static BLeStatus scanBluetoothDevice(BluetoothAdapter.LeScanCallback callback,
                                                boolean isBind) {
        if (adapter.isEnabled()) {
            BlueToothHelper.isBind = isBind;
            if (!isBind && !PluginManager.getInstance().hasBindDevice()) {//如果没有绑定任何设备,主页不进行扫描
                return BLeStatus.OUTHER;
            }
            if (adapter == null)
                return BLeStatus.NOTSUPPORT;
            adapter.startLeScan(callback);
            L.e("------蓝牙启动扫描!");
            return BLeStatus.NORMAL;
        } else {
            return BLeStatus.NOTOPEND;
        }
    }


    public static void openBlue(Activity activity, int request) {
        boolean isSupportBle = activity.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE);
        if (isSupportBle) {
            BluetoothManager mBluetoothManager = (BluetoothManager) activity.getSystemService(Context.BLUETOOTH_SERVICE);
            BluetoothAdapter adapter = mBluetoothManager.getAdapter();
            if (!adapter.isEnabled()) {
                Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                activity.startActivityForResult(enableBtIntent, request);
            }
        } else {
            T.l(activity, "您的机器不支持BLE");
        }
    }

    public static BluetoothDevice getDevice() {
        Set<BluetoothDevice> bondedDevices = adapter.getBondedDevices();
        for (BluetoothDevice device : bondedDevices) {
            if (device.getAddress().startsWith(SANHEYI_DEVICE_ADDRESS) || device.getName().toUpperCase().equals(SANHEYI_DEVICE_NAME)) {
                return device;
            }
        }
        return null;
    }
}
