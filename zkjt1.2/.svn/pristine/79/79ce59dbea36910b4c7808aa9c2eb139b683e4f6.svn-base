package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;

import com.zcareze.domain.regional.dictionary.TimeDivisions;

import java.util.ArrayList;
import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 17 : 00
 */

public class TimeDivisionsDao extends BaseDao<TimeDivisions> {
    private static TimeDivisionsDao instance;
    private static final String TABLE_NAME = "time_divisions";
    private Context context;

    private TimeDivisionsDao(Context context) {
        this.context = context;
    }

    public static TimeDivisionsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (TimeDivisionsDao.class) {
                if (instance == null)
                    instance = new TimeDivisionsDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(TimeDivisions timeDivisions) {

    }

    @Override
    public void add(List<TimeDivisions> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<TimeDivisions> queryAll() {
        Cursor cursor = super.queryAll(context, TABLE_NAME);
        List<TimeDivisions> data = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                TimeDivisions timeDivisions = new TimeDivisions();
                timeDivisions.setName(cursor.getString(cursor.getColumnIndex("name")));
                timeDivisions.setMinDatum(cursor.getInt(cursor.getColumnIndex("min_datum")));
                timeDivisions.setMinOffset(cursor.getInt(cursor.getColumnIndex("min_offset")));
                timeDivisions.setMaxDatum(cursor.getInt(cursor.getColumnIndex("max_datum")));
                timeDivisions.setMaxOffset(cursor.getInt(cursor.getColumnIndex("max_offset")));
                data.add(timeDivisions);
            }
        }
        super.closeSqlite();
        cursor.close();
        return data.size() <= 0 ? null : data;
    }

    @Override
    public TimeDivisions query(String... id) {
        return null;
    }

    @Override
    public List<TimeDivisions> query(String column, String value) {
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
