package com.zcareze.zkyandroidweb.bean;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 17 日 15 : 17
 * <p>
 * 设备的信息, 蓝牙设备 和  ZGB都有mac地址.
 */

public class DeviceInfo {
    protected String macAddress;//设备地址,ZGB全段唯一码.BLE的地址是mac
    protected String deviceType;//设备类型,
    protected String connectMode;//连接模式1为蓝牙,2位ZGB!

    @Override
    public String toString() {
        return "DeviceInfo{" +
                "macAddress='" + macAddress + '\'' +
                ", deviceType='" + deviceType + '\'' +
                ", connectMode='" + connectMode + '\'' +
                '}';
    }

    public String getMacAddress() {
        return macAddress;
    }

    public void setMacAddress(String macAddress) {
        this.macAddress = macAddress;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getConnectMode() {
        return connectMode;
    }

    public void setConnectMode(String connectMode) {
        this.connectMode = connectMode;
    }

    public DeviceInfo() {

    }

    public DeviceInfo(String macAddress, String deviceType, String connectMode) {

        this.macAddress = macAddress;
        this.deviceType = deviceType;
        this.connectMode = connectMode;
    }
}
