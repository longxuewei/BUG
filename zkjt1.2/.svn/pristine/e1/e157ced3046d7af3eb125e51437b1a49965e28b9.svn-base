package com.zcareze.zkyandroidweb.devicepulgin;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothProfile;
import android.content.Context;

import com.zcareze.core.Zcareze;
import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.zkyandroidweb.bean.MonitorEngine;
import com.zcareze.zkyandroidweb.bean.NewMonitorResult;
import com.zcareze.zkyandroidweb.constant.BLeStatus;
import com.zcareze.zkyandroidweb.constant.ResidentInfo;
import com.zcareze.zkyandroidweb.utils.L;
import com.zcareze.zkyandroidweb.utils.SPUtil;
import com.zcareze.zkyandroidweb.utils.TimeUtil;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 08 月 26 日 16 : 21
 * <p>
 * 此类用于最新的血氧,可测试出血氧然后提交返回
 */
public abstract class BaseBlePlugin {

    protected String macAddress;
    protected List<MeterModes> meterModes;
    private int currentConnectedStatus = BluetoothProfile.STATE_DISCONNECTED;
    protected Context context;
    protected final Object statusLock = new Object();

    /*父类的方法回调全部给子类,子类有自己的独特处理方法*/
    public abstract void onServicesDiscovered(BluetoothGatt gatt, int status);

    public abstract void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status);

    public abstract void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic);

    public abstract void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status);


    /**
     * 连接设备
     *
     * @return
     */
    public BLeStatus connect() {
        return BlueToothHelper.connect(this.macAddress, mGattCallback);
    }

    public void changeStatus(int status) {
        synchronized (statusLock) {
            currentConnectedStatus = status;
        }
    }

    public int getCurrentStatus() {
        synchronized (statusLock) {
            return currentConnectedStatus;
        }
    }

    /**
     * 所有插件的连接状态改变回调.
     */
    private BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                if (currentConnectedStatus == BluetoothProfile.STATE_CONNECTED) {
                    //防止第二次连接.的时候.多次调用前台方法.关不掉窗口!
                    return;
                }
                gatt.discoverServices();
                if (BlueToothHelper.isBind) {
                    Zcareze.javascript("onBTOnLine", null);
                }
                L.d("连接成功.");
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                gatt.close();
                if (BlueToothHelper.isBind) {
                    Zcareze.javascript("onBTOffLine", null);
                }
                L.d("断开连接.");
            }
            changeStatus(newState);
        }


        /**
         * 扫描服务的回调
         * @param gatt
         * @param status
         */
        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            BaseBlePlugin.this.onServicesDiscovered(gatt, status);
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            BaseBlePlugin.this.onCharacteristicRead(gatt, characteristic, status);
        }


        /**
         * 接受数据 的回调
         * @param gatt
         * @param characteristic
         */
        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            if (characteristic.getValue() != null) {
                System.out.println(characteristic.getStringValue(0));
            }
            BaseBlePlugin.this.onCharacteristicChanged(gatt, characteristic);
        }

        @Override
        public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
            BaseBlePlugin.this.onDescriptorWrite(gatt, descriptor, status);
        }
    };


    protected String getSuiteId() {
        if (meterModes != null && meterModes.size() == 1) {
            //170,82,77
            return meterModes.get(0).getSuiteId();
        } else if (BlueToothHelper.isBind) {
            L.d("设备字典数据初始化错误");
            Zcareze.javascript("onAnalysisFail", null);
        }
        return null;
    }


    /**
     * 子类利用自己的规则进行解析之后,传入参数,让父类统一进行测量.
     *
     * @param monitorData
     */
    protected void monitor(Map<Integer, String> monitorData, String suiteId) {
        MonitorEngine engine = new MonitorEngine(context);
        String residentId = (String) SPUtil.get(context, ResidentInfo.ID, "");
        String gender = (String) SPUtil.get(context, ResidentInfo.GENDER, "1");
        Date date = TimeUtil.paresDateByStr((String) SPUtil.get(context, ResidentInfo.BIRTHDAY, ""));
        NewMonitorResult monitorResult = engine.monitorProcessByManualdrive(suiteId, monitorData, residentId, Integer.parseInt(gender), date, null);
        if (monitorResult != null) {
            Map<String, Object> params = new HashMap<>();
            params.put("data", monitorResult);
            //验证通过并向前台提供数据
            if (BlueToothHelper.isBind) {
                Zcareze.javascript("onAnalysisDone", params);
            } else {
                Zcareze.javascript("DeviceMonitor", params);
            }
        } else {
            //数据解析失败
            L.d("数据解析失败");
            if (BlueToothHelper.isBind) {
                Zcareze.javascript("onAnalysisFail", null);
            } else {
                Zcareze.javascript("DeviceMonitor", null);
            }
        }
    }
}
