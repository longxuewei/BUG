package com.zcareze.zkyandroidweb.devicepulgin;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;

import com.zcareze.core.Zcareze;
import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.zkyandroidweb.bean.MonitorEngine;
import com.zcareze.zkyandroidweb.bean.NewMonitorResult;
import com.zcareze.zkyandroidweb.constant.ResidentInfo;
import com.zcareze.zkyandroidweb.utils.L;
import com.zcareze.zkyandroidweb.utils.SPUtil;
import com.zcareze.zkyandroidweb.utils.TimeUtil;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 28 日 17 : 19
 */

public class BloodPressurePlugin extends BaseBlePlugin {
    private final static String TAG = BloodPressurePlugin.class.getSimpleName();
    private final static UUID UUID_HEART_RATE_MEASUREMENT = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb");
    private ArrayList<List<BluetoothGattCharacteristic>> mGattCharacteristics = new ArrayList<>();

    public BloodPressurePlugin(Context context, String mac, List<MeterModes> meterModes) {
        this.context = context;
        this.macAddress = mac;
        this.meterModes = meterModes;
    }


    /**
     * 筛选数据匹配的的通道
     *
     * @param serviceUUID
     * @param characteristicUUID
     * @param gatt
     */
    private void open(String serviceUUID,//蓝牙端口的UUID
                      String characteristicUUID,//数据通道的UUID
                      BluetoothGatt gatt) {
        //蓝牙端口
        if (mGattCharacteristics != null) {
            //供的筛选数据通道
            BluetoothGattCharacteristic characteristic = null;
            //获取蓝牙服务数
            int serviceCount = mGattCharacteristics.size();
            for (int i = 0; i < serviceCount; i++) {
                //蓝牙数据端口列表
                List<BluetoothGattCharacteristic> listBluetoothGattCharacteristic = mGattCharacteristics.get(i);
                int countCharacteristic = listBluetoothGattCharacteristic.size();
                for (int j = 0; j < countCharacteristic; j++) {
                    BluetoothGattCharacteristic tmpCharacteristic = listBluetoothGattCharacteristic.get(j);
                    // 当前服务的UUID
                    UUID uuidService = tmpCharacteristic.getService().getUuid();
                    String sService = uuidService.toString();
                    // 数据端口的UUID
                    UUID uuidCharacteristic = tmpCharacteristic.getUuid();
                    String sCharacteristic = uuidCharacteristic.toString();

                    //筛选数据通道
                    if (uuidService != null && null != uuidCharacteristic) {
                        if (sService.equalsIgnoreCase(serviceUUID) //服务UUID符合
                                && sCharacteristic.equalsIgnoreCase(characteristicUUID)//数据通道UUID符合
                                ) {
                            //将符合条件的数据通道提取出来
                            characteristic = tmpCharacteristic;
                        }
                    }
                }
            }

            if (null != characteristic) {
                // 获取通道的属性
                final int charaProp = characteristic.getProperties();
                //打开数据通道
                if ((charaProp | BluetoothGattCharacteristic.PROPERTY_NOTIFY) > 0) {
                    setCharacteristicNotification(characteristic, true, gatt);
                }
            } else {
                L.d("BLE", "无对应蓝牙数据端口，请与厂商确认!");
            }
        } else {
            L.d("BLE", "无蓝牙服务列表为空，请联机!");
        }
    }


    /**
     * 开启数据通道.
     *
     * @param characteristic
     * @param enabled
     * @param gatt
     */
    public void setCharacteristicNotification(BluetoothGattCharacteristic characteristic, boolean enabled, BluetoothGatt gatt) {
        gatt.setCharacteristicNotification(characteristic, enabled);
        UUID uuid = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb");
        if (uuid.equals(characteristic.getUuid())) {
            BluetoothGattDescriptor descriptor = characteristic.getDescriptor(UUID.fromString("00002902-0000-1000-8000-00805f9b34fb"));
            descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
            gatt.writeDescriptor(descriptor);
        }
    }


    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        if (gatt != null) {
            List<BluetoothGattService> services = gatt.getServices();
            List<BluetoothGattCharacteristic> character = new ArrayList<>();
            for (BluetoothGattService service : services) {
                List<BluetoothGattCharacteristic> characteristics = service.getCharacteristics();
                if (characteristics != null && characteristics.size() > 0) {
                    for (BluetoothGattCharacteristic bc : characteristics) {
                        character.add(bc);
                    }
                }
            }
            mGattCharacteristics.add(character);
            if (mGattCharacteristics.size() > 0) {
                open("000018f0-0000-1000-8000-00805f9b34fb", "00002af0-0000-1000-8000-00805f9b34fb", gatt);
            }
        }
    }

    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {

    }

    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        //血压发送数据的方式不同
        parseData(characteristic, gatt);
    }

    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {

    }


    /**
     * 血压测试发送出去的广播不同, 覆盖父类额方法.
     *
     * @param characteristic
     * @param gatt
     */

    private void parseData(BluetoothGattCharacteristic characteristic, BluetoothGatt gatt) {
        String result = "";
        if (UUID_HEART_RATE_MEASUREMENT.equals(characteristic.getUuid())) {
            int flag = characteristic.getProperties();
            int format = -1;

            if ((flag & 0x01) != 0) {
                format = BluetoothGattCharacteristic.FORMAT_UINT16;
            } else {
                format = BluetoothGattCharacteristic.FORMAT_UINT8;
            }
            final int heartRate = characteristic.getIntValue(format, 1);
            result = String.valueOf(heartRate);
        } else {
            final byte[] data = characteristic.getValue();
            if (data != null && data.length > 0) {
                final StringBuilder stringBuilder = new StringBuilder(data.length);
                for (byte byteChar : data)
                    stringBuilder.append(String.format("%02X ", byteChar));
                result = new String(data) + "\n" + stringBuilder.toString();
            }
        }

        if (!TextUtils.isEmpty(result)) {
            if (result.length() > 34) {
                Map<Integer, String> monitorData = new HashMap<>();
                String byte1a = result.substring(18, 20);
                String byte2a = result.substring(21, 23);
                String byte3a = result.substring(24, 26);
                String byte4a = result.substring(30, 32);
                boolean bPreusreCondition1a = "02".equalsIgnoreCase(byte1a);
                boolean bPreusreCondition2a = "40".equalsIgnoreCase(byte2a);
                boolean bPreusreCondition3a = "DD".equalsIgnoreCase(byte3a);
                boolean bPreusreCondition4a = "1C".equalsIgnoreCase(byte4a);
                if (bPreusreCondition1a && bPreusreCondition2a && bPreusreCondition3a && bPreusreCondition4a) {
                    try {
                        String ssyValue = result.substring(36, 38);
                        int dSsyValue = Integer.parseInt(ssyValue, 16);
                        monitorData.put(1, dSsyValue + "");
                        String szyValue = result.substring(42, 44);
                        int dSzyValue = Integer.parseInt(szyValue, 16);
                        monitorData.put(2, dSzyValue + "");
                        String mbzValue = result.substring(54, 56);
                        int dMbzValue = Integer.parseInt(mbzValue, 16);
                        monitorData.put(3, dMbzValue + "");
                    } catch (Exception ex) {

                    }
                }

                //进行规制运算
                if (monitorData.size() > 0) {
                    if (!TextUtils.isEmpty(getSuiteId())) {
                        monitor(monitorData, getSuiteId());
                    }
                }
            }
        }
    }
}
