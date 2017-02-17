package com.zcareze.zkyandroidweb.bean;

import java.util.Arrays;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 14 日 10 : 51
 * <p>
 * 检测结果
 */

public class MonitorResult {
    //提示语
    private String hint;
    //测量结果;key:检测项目的名称.  如:收缩压,舒张压. value:测量结果和单位的组合  如:90mmHg(90是测量额结果,mmHg是单位)
    private Map<String, String> values;
    //检测的选项:有 部位,状态,时间,三个
    private String[] partAndTimes;
    //显示擦测量结果的 标题.
    private String title;
    //当前测量的是哪个部位,哪个时间,哪个个状态?
    private String monitorParams;
    //设备类型
    private String deviceType;

    //原始检测对象
    private MeasureResult measureResult;

    @Override
    public String toString() {
        return "MonitorResult{" +
                "hint='" + hint + '\'' +
                ", values=" + values +
                ", partAndTimes=" + Arrays.toString(partAndTimes) +
                ", title='" + title + '\'' +
                ", monitorParams='" + monitorParams + '\'' +
                ", deviceType='" + deviceType + '\'' +
                ", measureResult=" + measureResult +
                '}';
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public Map<String, String> getValues() {
        return values;
    }

    public void setValues(Map<String, String> values) {
        this.values = values;
    }

    public String[] getPartAndTimes() {
        return partAndTimes;
    }

    public void setPartAndTimes(String[] partAndTimes) {
        this.partAndTimes = partAndTimes;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMonitorParams() {
        return monitorParams;
    }

    public void setMonitorParams(String monitorParams) {
        this.monitorParams = monitorParams;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public MeasureResult getMeasureResult() {
        return measureResult;
    }

    public void setMeasureResult(MeasureResult measureResult) {
        this.measureResult = measureResult;
    }

    public MonitorResult(String hint, Map<String, String> values, String[] partAndTimes, String title, String monitorParams, String deviceType, MeasureResult measureResult) {
        this.hint = hint;
        this.values = values;
        this.partAndTimes = partAndTimes;
        this.title = title;
        this.monitorParams = monitorParams;
        this.deviceType = deviceType;
        this.measureResult = measureResult;
    }

    public MonitorResult() {

    }
}
