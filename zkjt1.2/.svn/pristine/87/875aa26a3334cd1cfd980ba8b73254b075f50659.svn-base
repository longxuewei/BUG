package com.zcareze.zkyandroidweb.devicepulgin;

import android.content.Context;
import android.text.TextUtils;

import com.zcareze.domain.regional.dictionary.MeterConnected;
import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.zkyandroidweb.db.MeterConnectedDao;
import com.zcareze.zkyandroidweb.db.MeterModesDao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 12 月 20 日 11 : 28
 */

public class PluginManager {
    public static PluginManager instance;
    public Map<String, BaseBlePlugin> plugins = new HashMap<>();
    private List<MeterConnected> allBleDeviceInfos;

    public static PluginManager getInstance() {
        if (instance == null) {
            synchronized (PluginManager.class) {
                if (instance == null) {
                    instance = new PluginManager();
                }
            }
        }
        return instance;
    }

    public boolean hasBindDevice() {
        if (allBleDeviceInfos != null && allBleDeviceInfos.size() > 0) {
            return true;
        } else {
            return false;
        }
    }


    public void init(Context context) {
        allBleDeviceInfos = MeterConnectedDao.getInstance(context).getAllBleDeviceInfo();
        if (allBleDeviceInfos != null) {
            for (MeterConnected allBleDeviceInfo : allBleDeviceInfos) {
                addPlugin(allBleDeviceInfo.getIdCode(), allBleDeviceInfo.getMeterCode(), context, false);
            }
        }
    }

    public BaseBlePlugin addPlugin(String mac, String meterCode, Context context, boolean temPlugin) {
        List<MeterModes> meterModes = MeterModesDao.getInstance(context).queryByParams("meter_code", new String[]{meterCode});
        BaseBlePlugin plugin = null;
        switch (meterCode) {
            case "8"://捷美血压
                plugin = new BloodPressurePlugin(context, mac, meterModes);
                break;
            case "10"://超思血氧
                plugin = new BloodOxygenPlugin(context, mac, meterModes);
                break;
            case "11"://三诺血糖.
                plugin = new SanNuoBloodGlucose(context, mac, meterModes);
                break;
            case "12"://三诺血糖.
                plugin = new BeiErKangTemperaturePlugin(context, mac, meterModes);
                break;
            case "13"://科仪皮肤
                plugin = new KeYiSkinPlugin(context, mac, meterModes);
                break;
        }
        if (temPlugin) {
            return plugin;
        }
        if (plugins.containsKey(mac)) {
            plugins.remove(mac);
        }
        plugins.put(mac, plugin);
        return plugin;
    }


    public BaseBlePlugin getPlugin(String mac) {
        if (TextUtils.isEmpty(mac)) {
            return null;
        }
        if (plugins.containsKey(mac)) {
            return plugins.get(mac);
        }
        return null;
    }


    /**
     * 绑定设备之后进行刷新.
     */
    public void refresh(Context context) {
        init(context);
    }
}
