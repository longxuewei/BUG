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
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 01 月 05 日 09 : 49
 */

public class ChaoSiScales extends BaseBlePlugin {

    private static final UUID SERVICE_UUID = UUID.fromString("ba11f08c-5f14-0b0d-1070-007cbe21d77c");
    private static final String DEVICE_UUID_PREFIX = "ba11f08c5f140b0d1070";
    private static final UUID CHARACTERISTIC_UUID = UUID.fromString("0000cd01-0000-1000-8000-00805f9b34fb");
    private static String CLIENT_CHARACTERISTIC_CONFIG = "00002902-0000-1000-8000-00805f9b34fb";
    private static final UUID Characteristic_UUID_CD01 = UUID
            .fromString("0000cd01-0000-1000-8000-00805f9b34fb");
    private static final UUID Characteristic_UUID_CD02 = UUID
            .fromString("0000cd02-0000-1000-8000-00805f9b34fb");
    private static final UUID Characteristic_UUID_CD03 = UUID
            .fromString("0000cd03-0000-1000-8000-00805f9b34fb");
    private static final UUID Characteristic_UUID_CD04 = UUID
            .fromString("0000cd04-0000-1000-8000-00805f9b34fb");
    private static final UUID Characteristic_UUID_CD20 = UUID
            .fromString("0000cd20-0000-1000-8000-00805f9b34fb");

    public ChaoSiScales(Context context, String mac, List<MeterModes> meterModes) {
        this.context = context;
        this.macAddress = mac;
        this.meterModes = meterModes;
    }


    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        if (status == BluetoothGatt.GATT_SUCCESS && gatt != null) {
            List<BluetoothGattService> service = gatt.getServices();
            for (BluetoothGattService service1 : service) {
                String serviceUUID = service1.getUuid().toString();
                String serviceUUID4Compare = serviceUUID.toLowerCase().replace("-", "");
                if (serviceUUID4Compare.contains(DEVICE_UUID_PREFIX)) {
                    BluetoothGattCharacteristic characteristic = service1.getCharacteristic(CHARACTERISTIC_UUID);
                    if (setCharacteristicNotification(gatt, characteristic, true)) {
                        L.d("开始监听notify1成功");
                    } else {
                        L.d("异常：开始监听Notify1失败");
                    }
                }
            }
        }
        //            BluetoothGattCharacteristic characteristic = gatt.getService(SERVICE_UUID).getCharacteristic(CHARACTERISTIC_UUID);
//            if (characteristic != null && (characteristic.getProperties() | BluetoothGattCharacteristic.PROPERTY_NOTIFY) > 0) {
//                boolean b = gatt.setCharacteristicNotification(characteristic, true);
//                if (b) {
//                    BluetoothGattDescriptor descriptor = characteristic.getDescriptor(UUID.fromString(CLIENT_CHARACTERISTIC_CONFIG));
//                    if (descriptor != null) {
//                        descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
//                        gatt.writeDescriptor(descriptor);
//                        L.d("写入特征值成功,等待上传数据");
//                    }
//                }
//            }
    }

    protected static boolean setCharacteristicNotification(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, boolean enabled) {
        if (gatt == null || characteristic == null) {
            return false;
        }
        if (!gatt.setCharacteristicNotification(characteristic, enabled)) {
            return false;
        }

        BluetoothGattDescriptor descriptor = characteristic.getDescriptor(UUID.fromString(CLIENT_CHARACTERISTIC_CONFIG));
        if (descriptor != null) {
            descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
            gatt.writeDescriptor(descriptor);
        }
        return true;
    }


    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {

    }

    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        L.d("体重数据: " + Arrays.toString(characteristic.getValue()));
        byte[] value = characteristic.getValue();
        if (value != null && value.length > 0) {
            if (value.length > 6) {
                double weight = (((value[6] & 0xff) << 8) + (value[5] & 0xff)) * 0.1;
                L.d("体重:" + weight);
            }
        }
    }

    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
        if (status != BluetoothGatt.GATT_SUCCESS) {
            return;
        }

        BluetoothGattService service = descriptor.getCharacteristic()
                .getService();
        if (descriptor.getCharacteristic().getUuid().equals(Characteristic_UUID_CD01)) {
            BluetoothGattCharacteristic characteristic = service
                    .getCharacteristic(Characteristic_UUID_CD02);
            L.d("监听notify1成功");
            if (setCharacteristicNotification(gatt, characteristic, true)) {
                L.d("监听notify2成功");
            } else {
                L.d("监听notify2失败");
            }
        } else if (descriptor.getCharacteristic().getUuid().equals(Characteristic_UUID_CD02)) {
            BluetoothGattCharacteristic characteristic = service
                    .getCharacteristic(Characteristic_UUID_CD03);
            L.d("监听notify2成功");
            if (setCharacteristicNotification(gatt, characteristic, true)) {
                L.d("监听notify3成功");
            } else {
                L.d("监听notify3失败");
            }
        } else if (descriptor.getCharacteristic().getUuid().equals(Characteristic_UUID_CD03)) {
            BluetoothGattCharacteristic characteristic = service
                    .getCharacteristic(Characteristic_UUID_CD04);

            L.d("监听notify3成功");
            if (setCharacteristicNotification(gatt, characteristic, true)) {
                L.d("监听notify4成功");
            } else {
                L.d("监听notify4失败");
            }
        } else if (descriptor.getCharacteristic().getUuid()
                .equals(Characteristic_UUID_CD04)) {
            L.d("监听notify4成功");


            List<BluetoothGattService> services = gatt.getServices();
            for (BluetoothGattService service1 : services) {
                BluetoothGattCharacteristic characteristic = service1.getCharacteristic(Characteristic_UUID_CD20);
                if (characteristic != null) {
                    byte[] bytes = cmdString2Bytes("aa5504b10000");
                    characteristic.setValue(bytes);
                    gatt.writeCharacteristic(characteristic);
                }
            }
        }
    }


    private String bytes2HexString(byte[] bytes) {
        String result = "";
        for (int i = 0; i < bytes.length; i++) {
            String hex = Integer.toHexString(bytes[i] & 0xff);
            if (hex.length() == 1) {
                hex = '0' + hex;
            }
            result += hex.toLowerCase(Locale.getDefault());
        }
        return result;
    }

    private static byte[] cmdString2Bytes(String cmd) {
        byte[] value = hexString2Bytes(cmd);
        byte verifySum = 0;
        for (int i = 2; i < value.length; i++) {
            verifySum += value[i];
        }
        byte[] values = new byte[value.length + 1];
        for (int i = 0; i < value.length; i++) {
            values[i] = value[i];
        }
        values[value.length] = verifySum;
        return values;
    }


    private static byte[] hexString2Bytes(String hexString) {
        int len = hexString.length() / 2;
        char[] chars = hexString.toCharArray();
        String[] hexStr = new String[len];
        byte[] bytes = new byte[len];
        for (int i = 0, j = 0; j < len; i += 2, j++) {
            hexStr[j] = "" + chars[i] + chars[i + 1];
            bytes[j] = (byte) Integer.parseInt(hexStr[j], 16);
        }
        return bytes;
    }

}
