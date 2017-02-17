package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.text.TextUtils;

import com.zcareze.zkyandroidweb.bean.MainDeviceItem;
import com.zcareze.zkyandroidweb.bean.MainItem;
import com.zcareze.zkyandroidweb.constant.ResidentInfo;
import com.zcareze.zkyandroidweb.proxy.ProxyFactoryManager;
import com.zcareze.zkyandroidweb.utils.SPUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 18 日 16 : 03
 * 一些特殊查询的操作,放在这里
 */

public class QueryServiceUtil {

    private static QueryServiceUtil instance;


    private QueryServiceUtil() {
    }

    public static QueryServiceUtil getInstance() {
        if (instance == null) {
            synchronized (QueryServiceUtil.class) {
                if (instance == null)
                    instance = new QueryServiceUtil();
            }
        }
        return instance;
    }


    /**
     * 手动输入 根据设备类型,获取suite_id;
     *
     * @param context
     * @param deviceType
     * @return
     */
    public String querySuiteIDByDeviceType(Context context, String deviceType) {
        if (TextUtils.isEmpty(deviceType))
            return null;
        String sql = "select  meter_modes.suite_id from meter_modes where meter_modes.meter_code in (select meter_list.code from meter_list where signal_flag = '" + deviceType + "');";
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor cursor = readableDatabase.rawQuery(sql, null);
        String suiteId = null;
        if (cursor.getCount() > 0) {
//            cursor.moveToFirst();
            while (cursor.moveToNext()) {
                suiteId = cursor.getString(cursor.getColumnIndex("suite_id"));
            }
        }
        cursor.close();
        readableDatabase.close();
        return TextUtils.isEmpty(suiteId) ? null : suiteId;
    }


    /**
     * 用户点击"绑定"按钮的时候确认绑定,传入设备的唯一码,进行获取metercode用于插入neterconnected表
     *
     * @param signalFlag
     * @return
     */
    public String getMeterCodeBySignalFlag(String signalFlag) {
        return null;
    }
}
