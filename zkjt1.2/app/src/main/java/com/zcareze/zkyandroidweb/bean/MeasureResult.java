package com.zcareze.zkyandroidweb.bean;

import android.util.SparseArray;

import java.util.Map;

/**
 * 检测结果的封装
 * measureID:对应 monitor_suite_list 表.
 * measureValue对应 health_metrics表:
 */

public class MeasureResult {

    //测量组ID 前两位
    private String measureID;
    //测量设备编码 包括前两位 总共10位
    private String measureCoding;
    private String suiteId;//手动输入添加的 suiteid

    public MeasureResult(String measureID, String measureCoding, String suiteId, Map<Integer,String> measureValue) {
        this.measureID = measureID;
        this.measureCoding = measureCoding;
        this.suiteId = suiteId;
        this.measureValue = measureValue;
    }

    public String getSuiteId() {

        return suiteId;
    }

    public void setSuiteId(String suiteId) {
        this.suiteId = suiteId;
    }

    //测量值
    private Map<Integer,String> measureValue;

    public MeasureResult() {
    }

    public MeasureResult(String measureCoding, Map<Integer,String> measureValue, String measureID) {
        this.measureCoding = measureCoding;
        this.measureValue = measureValue;
        this.measureID = measureID;
    }

    public String getMeasureCoding() {
        return measureCoding;
    }

    public void setMeasureCoding(String measureCoding) {
        this.measureCoding = measureCoding;
    }

    public String getMeasureID() {
        return measureID;
    }

    public void setMeasureID(String measureID) {
        this.measureID = measureID;
    }

    public Map<Integer,String> getMeasureValue() {
        return measureValue;
    }

    public void setMeasureValue(Map<Integer,String> measureValue) {
        this.measureValue = measureValue;
    }

    @Override
    public String toString() {
        return "MeasureResult{" +
                "measureID='" + measureID + '\'' +
                ", measureCoding='" + measureCoding + '\'' +
                ", suiteId='" + suiteId + '\'' +
                ", measureValue=" + measureValue +
                '}';
    }
}
