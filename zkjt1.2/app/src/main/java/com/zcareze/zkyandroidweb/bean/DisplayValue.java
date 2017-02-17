package com.zcareze.zkyandroidweb.bean;

import com.zcareze.domain.regional.RsdtMonitorDetail;
import com.zcareze.domain.regional.RsdtMonitorList;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 09 月 13 日 17 : 10
 * <p/>
 * 此类是用于逻辑计算完了, 然后将测量的值和提示语封装到该类.
 */
public class DisplayValue {
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
    private String suiteId;
    private List<RsdtMonitorList> rsdtMonitorLists;//  新增 居民检测记录. 在测量的时候保存, 以便在上传的时候直接使用.
    private List<List<RsdtMonitorDetail>> rsdtMonitorDetails;//  新增 居民检测记录. 在测量的时候保存, 以便在上传的时候直接使用.
    private Map<Integer, String> monitorData;//选择部位重新测量的时候需要
    private String residentId;
    private Integer gender;
    private Date birthday;

    @Override
    public String toString() {
        return "DisplayValue{" +
                "hint='" + hint + '\'' +
                ", values=" + values +
                ", partAndTimes=" + Arrays.toString(partAndTimes) +
                ", title='" + title + '\'' +
                ", monitorParams='" + monitorParams + '\'' +
                ", suiteId='" + suiteId + '\'' +
                ", rsdtMonitorLists=" + rsdtMonitorLists +
                ", rsdtMonitorDetails=" + rsdtMonitorDetails +
                ", monitorData=" + monitorData +
                ", residentId='" + residentId + '\'' +
                ", gender=" + gender +
                ", birthday=" + birthday +
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

    public String getSuiteId() {
        return suiteId;
    }

    public void setSuiteId(String suiteId) {
        this.suiteId = suiteId;
    }

    public List<RsdtMonitorList> getRsdtMonitorLists() {
        return rsdtMonitorLists;
    }

    public void setRsdtMonitorLists(List<RsdtMonitorList> rsdtMonitorLists) {
        this.rsdtMonitorLists = rsdtMonitorLists;
    }

    public List<List<RsdtMonitorDetail>> getRsdtMonitorDetails() {
        return rsdtMonitorDetails;
    }

    public void setRsdtMonitorDetails(List<List<RsdtMonitorDetail>> rsdtMonitorDetails) {
        this.rsdtMonitorDetails = rsdtMonitorDetails;
    }

    public Map<Integer, String> getMonitorData() {
        return monitorData;
    }

    public void setMonitorData(Map<Integer, String> monitorData) {
        this.monitorData = monitorData;
    }

    public String getResidentId() {
        return residentId;
    }

    public void setResidentId(String residentId) {
        this.residentId = residentId;
    }

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public DisplayValue(String hint, Map<String, String> values, String[] partAndTimes, String title, String monitorParams, String suiteId, List<RsdtMonitorList> rsdtMonitorLists, List<List<RsdtMonitorDetail>> rsdtMonitorDetails, Map<Integer, String> monitorData, String residentId, Integer gender, Date birthday) {

        this.hint = hint;
        this.values = values;
        this.partAndTimes = partAndTimes;
        this.title = title;
        this.monitorParams = monitorParams;
        this.suiteId = suiteId;
        this.rsdtMonitorLists = rsdtMonitorLists;
        this.rsdtMonitorDetails = rsdtMonitorDetails;
        this.monitorData = monitorData;
        this.residentId = residentId;
        this.gender = gender;
        this.birthday = birthday;
    }

    public DisplayValue() {

    }
}
