package com.zcareze.zkyandroidweb.devicepulgin;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.content.Context;
import android.text.TextUtils;

import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.zkyandroidweb.utils.L;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 29 日 11 : 53
 * 超思华大夫血氧仪.
 */

public class BloodOxygenPlugin extends BaseBlePlugin {

    //血氧数据可以用
    private BluetoothGattCharacteristic mCharacteristicCD01;
    private BluetoothGattCharacteristic mCharacteristicCD02;
    private BluetoothGattCharacteristic mCharacteristicCD03;
    private BluetoothGattCharacteristic mCharacteristicCD04;
    private BluetoothGattCharacteristic mCharacteristicWrite;

    private static String CLIENT_CHARACTERISTIC_CONFIG = "00002902-0000-1000-8000-00805f9b34fb";


    public BloodOxygenPlugin(Context context, String mac, List<MeterModes> meterModes) {
        this.context = context;
        this.macAddress = mac;
        this.meterModes = meterModes;
    }


    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        if (status == BluetoothGatt.GATT_SUCCESS) {
            matchDevice(gatt.getServices(),gatt);
        }
    }


    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {

    }

    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        if (characteristic != null) {
            byte[] value = characteristic.getValue();
            if (value != null && value.length > 0) {//97,77
                parseMonitorData(value,gatt);
            }//[85,-86,3,-79,0,-76],//[85,-86,3,97,77,-79]
        }
    }

    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
        UUID uuid = descriptor.getCharacteristic().getUuid();
        if (uuid.equals(UUID.fromString("0000cd01-0000-1000-8000-00805f9b34fb"))) {
            setNotification(mCharacteristicCD02, true,gatt);
        } else if (uuid.equals(UUID.fromString("0000cd02-0000-1000-8000-00805f9b34fb"))) {
            setNotification(mCharacteristicCD03, true, gatt);
        } else if (uuid.equals(UUID.fromString("0000cd03-0000-1000-8000-00805f9b34fb"))) {
            setNotification(mCharacteristicCD04, true, gatt);
        } else if (uuid.equals(UUID.fromString("0000cd04-0000-1000-8000-00805f9b34fb"))) {
            mCharacteristicWrite.setValue(getHexBytes("AA5504B10000B5"));
            writeCharacteristic(mCharacteristicWrite,gatt);
        }
    }


    private byte[] getHexBytes(String message) {
        int len = message.length() / 2;
        char[] chars = message.toCharArray();
        String[] hexStr = new String[len];
        byte[] bytes = new byte[len];
        for (int i = 0, j = 0; j < len; i += 2, j++) {
            hexStr[j] = "" + chars[i] + chars[i + 1];
            bytes[j] = (byte) Integer.parseInt(hexStr[j], 16);
        }
        return bytes;
    }


    /**
     * 跟血氧仪配对.并设置Notification监听结果上传
     *
     * @param gatt
     * @param bluetoothGatt
     */
    private void matchDevice(List<BluetoothGattService> gatt, BluetoothGatt bluetoothGatt) {
        if (gatt == null)
            return;
        for (BluetoothGattService gattService : gatt) {
            String uuid = gattService.getUuid().toString();
            // 如果是OX100血氧
            if (uuid.contains("ba11f08c-5f14-0b0d-1080")) {
                mCharacteristicCD01 = gattService
                        .getCharacteristic(UUID.fromString("0000cd01-0000-1000-8000-00805f9b34fb"));
                mCharacteristicCD02 = gattService
                        .getCharacteristic(UUID.fromString("0000cd02-0000-1000-8000-00805f9b34fb"));
                mCharacteristicCD03 = gattService
                        .getCharacteristic(UUID.fromString("0000cd03-0000-1000-8000-00805f9b34fb"));
                mCharacteristicCD04 = gattService
                        .getCharacteristic(UUID.fromString("0000cd04-0000-1000-8000-00805f9b34fb"));
                mCharacteristicWrite = gattService
                        .getCharacteristic(UUID.fromString("0000cd20-0000-1000-8000-00805f9b34fb"));
                // 开始顺序监听，第一个：CD01
                setNotification(mCharacteristicCD01, true, bluetoothGatt);
            }
        }
    }


    private void parseMonitorData(byte[] value, BluetoothGatt gatt) {
        if (value[3] == -79 && value[4] == 0) {
            L.d("密码校验成功");
            return;
        }
        //正确值
        if (value[3] != 0 && value[4] != 0) {
            String suiteId = getSuiteId();
            if (!TextUtils.isEmpty(suiteId)) {
                Map<Integer, String> monitorData = new HashMap<>();
                monitorData.put(1, value[3] + "");
                monitorData.put(2, value[4] + "");
                monitor(monitorData, suiteId);
                gatt.disconnect();//血氧回调慢!
            }
        }
    }


    /**
     * 血氧设置监听.
     *  @param characteristic
     * @param enabled
     * @param gatt
     */

    private void setNotification(BluetoothGattCharacteristic characteristic, boolean enabled, BluetoothGatt gatt) {
        if (gatt == null) {
            return;
        }
        gatt.setCharacteristicNotification(characteristic, enabled);
        BluetoothGattDescriptor descriptor = characteristic
                .getDescriptor(UUID.fromString(CLIENT_CHARACTERISTIC_CONFIG));
        if (descriptor != null) {
            descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
            gatt.writeDescriptor(descriptor);
        }
    }

    /**
     * 血氧往外写出配对信息.
     *
     * @param mCharacteristicWrite
     * @param gatt
     */
    private void writeCharacteristic(BluetoothGattCharacteristic mCharacteristicWrite, BluetoothGatt gatt) {
        if (gatt == null) {
            return;
        }
        gatt.writeCharacteristic(mCharacteristicWrite);
    }
}
