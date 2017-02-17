package com.zcareze.zkyandroidweb.bean;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 12 月 19 日 11 : 06
 * <p>
 * 设备状态信息: 当主页在扫描的时候,连接上一个设备.要将该设备进行连接.连接之后保存该设备的状态.
 * 防止下次扫描到该设备的时候重新连接
 */

public class DeviceStatusInfo {
    private String address;
    private int status; //设备状态 -1: 断开, 0:正在连接,1:已连接

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "DeviceStatusInfo{" +
                "address='" + address + '\'' +
                ", status=" + status +
                '}';
    }

    public DeviceStatusInfo() {
    }

    public DeviceStatusInfo(String address, int status) {

        this.address = address;
        this.status = status;
    }
}
