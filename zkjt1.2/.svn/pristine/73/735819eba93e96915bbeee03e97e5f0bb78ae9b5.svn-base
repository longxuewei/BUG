package com.zcareze.zkyandroidweb.bean;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 22 日 18 : 38
 */

public class BLEDeviceInfo extends DeviceInfo {

    private int rssi;//蓝牙设备特征 信号强度!
    private String bleName;
    public BLEDeviceInfo(String macAddress, String deviceType, String connectMode, int rssi, String bleName) {
        super(macAddress, deviceType, connectMode);
        this.rssi = rssi;
        this.bleName = bleName;
    }

    @Override
    public String toString() {
        return "BLEDeviceInfo{" +
                "rssi=" + rssi +
                ", bleName='" + bleName + '\'' +
                '}';
    }

    public int getRssi() {
        return rssi;
    }

    public void setRssi(int rssi) {
        this.rssi = rssi;
    }

    public String getBleName() {
        return bleName;
    }

    public void setBleName(String bleName) {
        this.bleName = bleName;
    }
}
