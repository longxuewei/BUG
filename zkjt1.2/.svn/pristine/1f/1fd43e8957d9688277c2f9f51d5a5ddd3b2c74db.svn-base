package com.zcareze.zkyandroidweb.bean;

import com.zcareze.domain.regional.dictionary.MeterConnected;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 12 月 19 日 16 : 00
 */

public class MeterConnectedStatus extends MeterConnected {
    /**
     * 仪器编码
     */
    private String meterCode;
    /**
     * 通讯种类
     */
    private Integer signalKind;
    /**
     * 设备识别码
     */
    private String idCode;
    //设备状态
    private boolean status;

    public MeterConnectedStatus(String meterCode, Integer signalKind, String idCode, boolean status) {
        this.meterCode = meterCode;
        this.signalKind = signalKind;
        this.idCode = idCode;
        this.status = status;
    }

    @Override
    public String toString() {
        return "MeterConnectedStatus{" +
                "meterCode='" + meterCode + '\'' +
                ", signalKind=" + signalKind +
                ", idCode='" + idCode + '\'' +
                ", status=" + status +
                '}';
    }

    @Override
    public String getMeterCode() {
        return meterCode;
    }

    @Override
    public void setMeterCode(String meterCode) {
        this.meterCode = meterCode;
    }

    @Override
    public Integer getSignalKind() {
        return signalKind;
    }

    @Override
    public void setSignalKind(Integer signalKind) {
        this.signalKind = signalKind;
    }

    @Override
    public String getIdCode() {
        return idCode;
    }

    @Override
    public void setIdCode(String idCode) {
        this.idCode = idCode;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
