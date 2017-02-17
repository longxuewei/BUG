package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.zcareze.domain.regional.dictionary.MonitorSuites;

import java.util.ArrayList;
import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 17 : 40
 */

public class MonitorSuitesDao extends BaseDao<MonitorSuites> {


    private static MonitorSuitesDao instance;
    private static final String TABLE_NAME = "monitor_suites";
    private Context context;

    private MonitorSuitesDao(Context context) {
        this.context = context;
    }

    public static MonitorSuitesDao getInstance(Context context) {
        if (instance == null) {
            synchronized (MonitorSuitesDao.class) {
                if (instance == null)
                    instance = new MonitorSuitesDao(context);
            }
        }
        return instance;
    }


    @Override
    public void add(MonitorSuites monitorSuites) {

    }

    @Override
    public void add(List<MonitorSuites> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MonitorSuites> queryAll() {
        Cursor cursor = super.queryAllOlderBy(context, TABLE_NAME, "seq_no");
        List<MonitorSuites> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MonitorSuites suites = new MonitorSuites();
                suites.setId(cursor.getString(cursor.getColumnIndex("id")));
                suites.setName(cursor.getString(cursor.getColumnIndex("name")));
                suites.setMetered(cursor.getInt(cursor.getColumnIndex("metered")));
                suites.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                suites.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                suites.setDivParts(cursor.getString(cursor.getColumnIndex("div_parts")));
                suites.setDivTimes(cursor.getString(cursor.getColumnIndex("div_times")));
                suites.setDivStatus(cursor.getString(cursor.getColumnIndex("div_status")));
                datas.add(suites);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }

    @Override
    public MonitorSuites query(String... ids) {
        MonitorSuites suites = null;
        for (String id : ids) {
            SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
            Cursor query = readableDatabase.query(TABLE_NAME, null, "id" + "=?", new String[]{id}, null, null, null);
            if (query.getCount() > 0) {
                while (query.moveToNext()) {
                    suites = new MonitorSuites();
                    suites.setId(query.getString(query.getColumnIndex("id")));
                    suites.setName(query.getString(query.getColumnIndex("name")));
                    suites.setMetered(query.getInt(query.getColumnIndex("metered")));
                    suites.setSeqNo(query.getInt(query.getColumnIndex("seq_no")));
                    suites.setComment(query.getString(query.getColumnIndex("comment")));
                    suites.setDivParts(query.getString(query.getColumnIndex("div_parts")));
                    suites.setDivTimes(query.getString(query.getColumnIndex("div_times")));
                    suites.setDivStatus(query.getString(query.getColumnIndex("div_status")));
                }
            }
            readableDatabase.close();
            query.close();
        }
        return suites;
    }

    @Override
    public List<MonitorSuites> query(String column, String value) {
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
