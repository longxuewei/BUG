package com.zcareze.zkyandroidweb.bean;

import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 21 日 14 : 33
 * 手动输入 的封装类.
 */

public class InputMonitorData {

    //设备类型
    private String deviceType;
    //测量出来的值 : key 是排序根据数据库的执行组seq_no来排序.
    //              value: 是测量的数值.
    private Map<Integer, String> monitorData;
    private String monitorPart;

    @Override
    public String toString() {
        return "InputMonitorData{" +
                "deviceType='" + deviceType + '\'' +
                ", monitorData=" + monitorData +
                ", monitorPart='" + monitorPart + '\'' +
                '}';
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public Map<Integer, String> getMonitorData() {
        return monitorData;
    }

    public void setMonitorData(Map<Integer, String> monitorData) {
        this.monitorData = monitorData;
    }

    public String getMonitorPart() {
        return monitorPart;
    }

    public void setMonitorPart(String monitorPart) {
        this.monitorPart = monitorPart;
    }

    public InputMonitorData() {

    }

    public InputMonitorData(String deviceType, Map<Integer, String> monitorData, String monitorPart) {

        this.deviceType = deviceType;
        this.monitorData = monitorData;
        this.monitorPart = monitorPart;
    }
}
