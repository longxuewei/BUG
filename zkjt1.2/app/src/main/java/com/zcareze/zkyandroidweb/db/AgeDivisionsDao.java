package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;


import com.zcareze.domain.core.dictionary.AgeDivisions;

import java.util.ArrayList;
import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 16 : 02
 */

public class AgeDivisionsDao extends BaseDao<AgeDivisions> {


    private static AgeDivisionsDao instance;
    private static final String TABLE_NAME = "age_divisions";
    private Context context;

    private AgeDivisionsDao(Context context) {
        this.context = context;
    }

    public static AgeDivisionsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (AgeDivisionsDao.class) {
                if (instance == null)
                    instance = new AgeDivisionsDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(AgeDivisions ageDivisions) {

    }

    @Override
    public void add(List<AgeDivisions> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<AgeDivisions> queryAll() {
        Cursor cursor = super.queryAll(context, TABLE_NAME);
        List<AgeDivisions> data = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                AgeDivisions ageDivisions = new AgeDivisions();
                ageDivisions.setName(cursor.getString(cursor.getColumnIndex("name")));
                ageDivisions.setMax(cursor.getInt(cursor.getColumnIndex("max")));
                ageDivisions.setMin(cursor.getInt(cursor.getColumnIndex("min")));
                data.add(ageDivisions);
            }

        }
        cursor.close();
        super.closeSqlite();
        return data.size() <= 0 ? null : data;
    }


    @Override
    public AgeDivisions query(String... id) {
        return null;
    }

    @Override
    public List<AgeDivisions> query(String column, String value) {
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
