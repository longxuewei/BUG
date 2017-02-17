package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;

import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.domain.regional.dictionary.MonitorSuiteItems;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 17 : 21
 */

public class MonitorSuiteItemsDao extends BaseDao<MonitorSuiteItems> {

    private static MonitorSuiteItemsDao instance;
    private static final String TABLE_NAME = "monitor_suite_items";
    private Context context;

    private MonitorSuiteItemsDao(Context context) {
        this.context = context;
    }

    public static MonitorSuiteItemsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (MonitorSuiteItemsDao.class) {
                if (instance == null)
                    instance = new MonitorSuiteItemsDao(context);
            }
        }
        return instance;
    }


    @Override
    public void add(MonitorSuiteItems monitorSuiteItems) {

    }

    @Override
    public void add(List<MonitorSuiteItems> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MonitorSuiteItems> queryAll() {
        return null;
    }

    @Override
    public MonitorSuiteItems query(String... id) {
        return null;
    }

    @Override
    public List<MonitorSuiteItems> query(String column, String value) {
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


    /**
     * 子类特有查询方法.
     *
     * @param params
     * @return
     */
    public List<MonitorSuiteItems> queryByParams(Map<String, String> params) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, params, "seq_no asc");
        List<MonitorSuiteItems> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MonitorSuiteItems monitorSuiteItems = new MonitorSuiteItems();
                monitorSuiteItems.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                monitorSuiteItems.setSuiteId(cursor.getString(cursor.getColumnIndex("suite_id")));
                monitorSuiteItems.setItemId(cursor.getString(cursor.getColumnIndex("item_id")));
                datas.add(monitorSuiteItems);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }

    public List<MonitorSuiteItems> queryByParams(String columnName, String[] values) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, columnName, "suite_id asc,seq_no asc", values);
        List<MonitorSuiteItems> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MonitorSuiteItems monitorSuiteItems = new MonitorSuiteItems();
                monitorSuiteItems.setItemId(cursor.getString(cursor.getColumnIndex("item_id")));
                monitorSuiteItems.setSuiteId(cursor.getString(cursor.getColumnIndex("suite_id")));
                monitorSuiteItems.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                datas.add(monitorSuiteItems);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }
}
