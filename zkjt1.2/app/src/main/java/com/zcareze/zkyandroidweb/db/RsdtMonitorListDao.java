package com.zcareze.zkyandroidweb.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

import com.zcareze.domain.regional.RsdtMonitorList;

import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 15 : 24
 */

public class RsdtMonitorListDao extends BaseDao<RsdtMonitorList> {
    private static RsdtMonitorListDao instance;
    private static final String TABLE_NAME = "rsdt_monitor_list";
    private Context context;

    private RsdtMonitorListDao(Context context) {
        this.context = context;
    }

    public static RsdtMonitorListDao getInstance(Context context) {
        if (instance == null) {
            synchronized (RsdtMonitorListDao.class) {
                if (instance == null)
                    instance = new RsdtMonitorListDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(RsdtMonitorList rsdtMonitorList) {
        SQLiteDatabase writableDatabase = DataBaseHelper.getInstance(context).getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("id", rsdtMonitorList.getId());
        values.put("resident_id", rsdtMonitorList.getResidentId());
        values.put("suite_id", rsdtMonitorList.getSuiteId());
        values.put("accept_time", rsdtMonitorList.getAcceptTime() + "");
        values.put("method", rsdtMonitorList.getMethod());
        values.put("meter_code", rsdtMonitorList.getMeterCode());
        values.put("staff_id", rsdtMonitorList.getStaffId());
        values.put("reporter", rsdtMonitorList.getReporter());
        values.put("sel_part", rsdtMonitorList.getSelPart());
        values.put("sel_time", rsdtMonitorList.getSelTime());
        values.put("sel_status", rsdtMonitorList.getSelStatus());
        values.put("delete_time", rsdtMonitorList.getDeleteTime() + "");
        values.put("task_id", rsdtMonitorList.getTaskId());
        values.put("upload_time", rsdtMonitorList.getUploadTime() + "");
        writableDatabase.insert(TABLE_NAME, null, values);
        writableDatabase.close();
    }

    @Override
    public void add(List<RsdtMonitorList> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<RsdtMonitorList> queryAll() {
        return null;
    }

    @Override
    public RsdtMonitorList query(String... id) {
        return null;
    }

    @Override
    public List<RsdtMonitorList> query(String column, String value) {
        return null;
    }

    @Override
    public String getTableName() {
        return null;
    }

    @Override
    public String[] getPrimaryKeyName() {
        return new String[0];
    }
}
