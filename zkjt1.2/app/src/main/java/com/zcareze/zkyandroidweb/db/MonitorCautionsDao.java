package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;

import com.zcareze.domain.regional.dictionary.MonitorCautions;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 14 : 22
 */

public class MonitorCautionsDao extends BaseDao<MonitorCautions> {
    private static MonitorCautionsDao instance;
    private static final String TABLE_NAME = "monitor_cautions";
    private Context context;

    private MonitorCautionsDao(Context context) {
        this.context = context;
    }

    public static MonitorCautionsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (MonitorCautionsDao.class) {
                if (instance == null)
                    instance = new MonitorCautionsDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(MonitorCautions monitorCautions) {

    }

    @Override
    public void add(List<MonitorCautions> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MonitorCautions> queryAll() {
        return null;
    }

    @Override
    public MonitorCautions query(String... id) {
        return null;
    }

    @Override
    public List<MonitorCautions> query(String column, String value) {
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
     * 根据参数查询
     *
     * @param params
     * @return
     */
    public List<MonitorCautions> queryByParams(Map<String, String> params) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, params, "step_no asc");
        List<MonitorCautions> data = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MonitorCautions monitorSuiteItems = new MonitorCautions();
                monitorSuiteItems.setItemId(cursor.getString(cursor.getColumnIndex("item_id")));
                monitorSuiteItems.setStepNo(cursor.getInt(cursor.getColumnIndex("step_no")));
                monitorSuiteItems.setVerdict(cursor.getString(cursor.getColumnIndex("verdict")));
                monitorSuiteItems.setTrueGoto(cursor.getInt(cursor.getColumnIndex("true_goto")));
                monitorSuiteItems.setTrueWord(cursor.getString(cursor.getColumnIndex("true_word")));
                monitorSuiteItems.setFalseGoto(cursor.getInt(cursor.getColumnIndex("false_goto")));
                monitorSuiteItems.setFalseWord(cursor.getString(cursor.getColumnIndex("false_word")));
                data.add(monitorSuiteItems);
            }
        }
        cursor.close();
        super.closeSqlite();
        return data.size() <= 0 ? null : data;
    }

}
