package com.zcareze.zkyandroidweb.devicepulgin;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.content.Context;

import com.tencent.bugly.crashreport.CrashReport;
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
 * 时间轴: 2016 年 12 月 28 日 16 : 03
 */

public class KeYiSkinPlugin extends BaseBlePlugin {

    private UUID SERVICE_SKIN_UUID = UUID.fromString("0000fff0-0000-1000-8000-00805f9b34fb");//皮肤测试服务
    private UUID CHARACTERISTIC_SKIN_UUID = UUID.fromString("0000fff7-0000-1000-8000-00805f9b34fb");//皮肤测试通讯通道

    public KeYiSkinPlugin(Context context, String mac, List<MeterModes> meterModes) {
        this.context = context;
        this.macAddress = mac;
        this.meterModes = meterModes;
    }


    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
        L.d("onServicesDiscovered");
        if (status == BluetoothGatt.GATT_SUCCESS) {
            BluetoothGattService service = gatt.getService(SERVICE_SKIN_UUID);
            if (service != null) {
                BluetoothGattCharacteristic characteristic = service.getCharacteristic(CHARACTERISTIC_SKIN_UUID);
                if (characteristic != null &&
                        (characteristic.getProperties() | BluetoothGattCharacteristic.PROPERTY_NOTIFY) > 0) {
                    gatt.setCharacteristicNotification(characteristic, true);
                }
            }
        }
    }

    @Override
    public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
        L.d("onCharacteristicRead");
    }

    @Override
    public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
        byte[] value = characteristic.getValue();
        L.d("水分数据:" + Arrays.toString(value));
        if (value[2] == 0x1) {//校验有效位
            float moistrue = (float) ((value[4] & 0xFF) + (value[3] & 0xFF) * 256) / 10;
            float oil = (float) ((value[6] & 0xFF) + (value[5] & 0xFF) * 256) / 10;
            if (moistrue > 100 || oil > 100) {
                CrashReport.postCatchedException(new Exception("测量错误: " + Arrays.toString(value)));
                return;
            }
            Map<Integer, String> monitorData = new HashMap<>();
            monitorData.put(1, moistrue + "");
            monitorData.put(2, oil + "");
            monitor(monitorData, getSuiteId());
            //如果是绑定状态,测量完成之后立即断开,因为防止绑定下一个设备的时候,扫描不到上次绑定的那个设备,因为他还连接着.
            if(BlueToothHelper.isBind){
                gatt.disconnect();
            }
        }
    }

    @Override
    public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
        L.d("onServicesDiscovered");
    }
}
