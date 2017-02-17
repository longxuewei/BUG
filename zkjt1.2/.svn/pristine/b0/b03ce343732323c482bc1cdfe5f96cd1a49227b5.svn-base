package com.zcareze.zkyandroidweb.devicepulgin;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.content.Context;
import android.text.TextUtils;

import com.sinocare.handler.SN_MainHandler;
import com.zcareze.core.Zcareze;
import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.zkyandroidweb.bean.MonitorEngine;
import com.zcareze.zkyandroidweb.bean.NewMonitorResult;
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
 * 时间轴: 2016 年 12 月 07 日 15 : 18
 */

public class SanNuoBloodGlucose extends BaseBlePlugin {


    public SanNuoBloodGlucose(Context context, String mac, List<MeterModes> meterModes) {
        this.context = context;
        this.macAddress = mac;
        this.meterModes = meterModes;
    }


    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        if (gatt != null) {
            List<BluetoothGattService> services = gatt.getServices();
            for (BluetoothGattService s : services) {
                List<BluetoothGattCharacteristic> characteristics = s.getCharacteristics();
                for (BluetoothGattCharacteristic characteristic : characteristics) {
                    L.d(characteristic.getUuid().toString());
                    int properties = characteristic.getProperties();
                    if ((properties | BluetoothGattCharacteristic.PROPERTY_READ) > 0) {
                        if (gatt != null) {
                            //发送测试命令
                            byte[] bytes = new byte[]{
                                    (byte) 0x53,
                                    (byte) 0x4e,
                                    (byte) 0x08,
                                    (byte) 0x00,
                                    (byte) 0x04,
                                    (byte) 0x01,
                                    (byte) 0x53,
                                    (byte) 0x49,
                                    (byte) 0x4e,
                                    (byte) 0x4f,
                                    (byte) 0x46};
                            characteristic.setValue(bytes);
                            gatt.writeCharacteristic(characteristic);

                        }
                    }

                    if ((properties | BluetoothGattCharacteristic.PROPERTY_NOTIFY) > 0) {
                        if (gatt != null)
                            gatt.setCharacteristicNotification(characteristic, true);
                    }
                }
            }
        }
    }

    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {

    }

    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        if (characteristic != null) {
            byte[] value = characteristic.getValue();
            if (value != null && value.length == 17) {
                float result = (float) value[12] / 10;//血糖值要除以10,不存在 70 变成0.7的可能.
                if (result > 0 && result < 33.3) {
                    Map<Integer, String> monitorData = new HashMap<>();
                    monitorData.put(1, result + "");
                    if (monitorData.size() > 0) {
                        if (!TextUtils.isEmpty(getSuiteId())) {
                            monitor(monitorData, getSuiteId());
                        }
                    }
                } else {
                    L.d("血糖值超出测量范围");
                    Zcareze.javascript("onAnalysisFail", null);
                }
            }
        }
    }

    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {

    }

}
