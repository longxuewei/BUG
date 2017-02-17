package com.zcareze.zkyandroidweb.devicepulgin;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.content.Context;
import android.util.Log;

import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.zkyandroidweb.utils.L;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 12 月 14 日 15 : 17
 * <p>
 * 贝尔康耳温
 */

public class BeiErKangTemperaturePlugin extends BaseBlePlugin {

    private static final UUID MYUUID = UUID.fromString("0000fe18-0000-1000-8000-00805f9b34fb");
    private static final UUID CCC = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");
    private static final UUID MYCHARACTERISTIC = UUID.fromString("0000fe10-0000-1000-8000-00805f9b34fb");
    private static final UUID MYWRITECHARACTERISTIC = UUID.fromString("0000fe11-0000-1000-8000-00805f9b34fb");

    public BeiErKangTemperaturePlugin(Context context, String mac, List<MeterModes> meterModes) {
        this.context = context;
        this.macAddress = mac;
        this.meterModes = meterModes;
    }

    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        BluetoothGattCharacteristic mChara = getBluetoothGattCharacteristic(gatt);
        if (enableNotification(gatt, mChara, true)) {
            L.d("耳温计设置Notification成功...");
        }
    }

    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {

    }

    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        byte[] buffer = characteristic.getValue();
        byte[] value = new byte[6];
        for (int i = 0; i < 6; i++) {
            value[i] = buffer[3 + i];
        }
        L.d("原始数据: " + Arrays.toString(buffer));
        L.d("耳温开始: " + Arrays.toString(value));
        //进行温度解析
        float tem = (float) ((buffer[5] & 0xFF) + (buffer[6] & 0xFF) * 256) / 10;
        L.d("温度:" + tem);
        //模式不对,进行重新设置模式
        if (buffer[9] == 1 || buffer[10] == 1) {
            byte[] newMod = new byte[]{
                    (byte) 0XF5,
                    (byte) 0X11,
                    (byte) 0X02,
                    (byte) 0X00,
                    (byte) 0X00,
                    (byte) 0X01,
                    (byte) 0XFF};
            changeMonitorMod(gatt, newMod);
        }

        Map<Integer, String> monitorData = new HashMap<>();
        monitorData.put(1, tem + "");
        monitor(monitorData, getSuiteId());

    }

    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {

    }


    private BluetoothGattCharacteristic getBluetoothGattCharacteristic(BluetoothGatt gatt) {
        BluetoothGattService mService = gatt.getService(MYUUID);
        if (mService == null) {
            L.d("HRP service not found!");
            return null;
        }
        BluetoothGattCharacteristic mCharac = mService.getCharacteristic(MYCHARACTERISTIC);
        if (mCharac == null) {
            L.d("HEART RATE MEASUREMENT charateristic not found!");
            return null;
        }

        return mCharac;

    }


    private boolean enableNotification(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, boolean enable) {
        //调用以便当命令发送后返回信息可以自动返回
        if (gatt == null)
            return false;
        if (!gatt.setCharacteristicNotification(characteristic, enable))
            return false;

        BluetoothGattDescriptor clientConfig = characteristic.getDescriptor(CCC);
        if (clientConfig == null)
            return false;
        if (enable) {
            L.d("enable notification");
            clientConfig.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
        } else {
            L.d("disable notification");
            clientConfig.setValue(BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE);
        }
        return gatt.writeDescriptor(clientConfig);
    }


    /**
     * 改变测量模式,防止用户自行修改了下位机的测量模式
     *
     * @param gatt
     * @param buffer
     */
    private void changeMonitorMod(BluetoothGatt gatt, byte[] buffer) {
        if (gatt != null && gatt != null) {
            BluetoothGattService writeService = gatt.getService(MYUUID);
            if (writeService == null) {
                return;
            }

            BluetoothGattCharacteristic writeCharacteristic = writeService.getCharacteristic(MYWRITECHARACTERISTIC);
            if (writeCharacteristic == null) {
                return;
            }
            writeCharacteristic.setValue(buffer);
            gatt.writeCharacteristic(writeCharacteristic);
        }
    }
}
