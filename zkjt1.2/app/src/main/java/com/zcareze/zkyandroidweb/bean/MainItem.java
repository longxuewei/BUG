package com.zcareze.zkyandroidweb.bean;


import com.zcareze.domain.core.AccountList;
import com.zcareze.domain.regional.resident.ResidentList;

import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 15 日 18 : 44
 * <p>
 * 此实例用于封装,提供给前台的主页面的检测项目的条目 并携带了相关居民信息和cookie
 */

public class MainItem {
    private List<MainDeviceItem> devices;
    private ResidentList residentInfo;//居民信息
    private String cookie;
    private String apiAddress;
    private String apiVersion;
    private AccountList accountList;
    private String cloudId;

    public List<MainDeviceItem> getDevices() {
        return devices;
    }

    public void setDevices(List<MainDeviceItem> devices) {
        this.devices = devices;
    }

    public ResidentList getResidentInfo() {
        return residentInfo;
    }

    public void setResidentInfo(ResidentList residentInfo) {
        this.residentInfo = residentInfo;
    }

    public String getCookie() {
        return cookie;
    }

    public void setCookie(String cookie) {
        this.cookie = cookie;
    }

    public String getApiAddress() {
        return apiAddress;
    }

    public void setApiAddress(String apiAddress) {
        this.apiAddress = apiAddress;
    }

    public String getApiVersion() {
        return apiVersion;
    }

    public void setApiVersion(String apiVersion) {
        this.apiVersion = apiVersion;
    }

    public AccountList getAccountList() {
        return accountList;
    }

    public void setAccountList(AccountList accountList) {
        this.accountList = accountList;
    }

    public String getCloudId() {
        return cloudId;
    }

    public void setCloudId(String cloudId) {
        this.cloudId = cloudId;
    }

    @Override
    public String toString() {
        return "MainItem{" +
                "devices=" + devices +
                ", residentInfo=" + residentInfo +
                ", cookie='" + cookie + '\'' +
                ", apiAddress='" + apiAddress + '\'' +
                ", apiVersion='" + apiVersion + '\'' +
                ", accountList=" + accountList +
                ", cloudId='" + cloudId + '\'' +
                '}';
    }

    public MainItem() {
    }

    public MainItem(List<MainDeviceItem> devices, ResidentList residentInfo, String cookie, String apiAddress, String apiVersion, AccountList accountList, String cloudId) {

        this.devices = devices;
        this.residentInfo = residentInfo;
        this.cookie = cookie;
        this.apiAddress = apiAddress;
        this.apiVersion = apiVersion;
        this.accountList = accountList;
        this.cloudId = cloudId;
    }
}
