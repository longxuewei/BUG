package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;

import com.zcareze.domain.regional.resident.ResidentHabits;
import com.zcareze.zkyandroidweb.utils.L;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 17 : 08
 */

public class ResidentHabitsDao extends BaseDao<ResidentHabits> {
    private static ResidentHabitsDao instance;
    private static final String TABLE_NAME = "resident_habits";
    private Context context;

    private ResidentHabitsDao(Context context) {
        this.context = context;
    }

    public static ResidentHabitsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (ResidentHabitsDao.class) {
                if (instance == null)
                    instance = new ResidentHabitsDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(ResidentHabits residentHabits) {

    }

    @Override
    public void add(List<ResidentHabits> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<ResidentHabits> queryAll() {
        Cursor cursor = super.queryAll(context, TABLE_NAME);
        List<ResidentHabits> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                ResidentHabits residentHabits = new ResidentHabits();
                residentHabits.setResidentId(cursor.getString(cursor.getColumnIndex("resident_id")));
                residentHabits.setPointKind(cursor.getInt(cursor.getColumnIndex("point_kind")));
                try {
                    residentHabits.setPointTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA).parse(cursor.getString(cursor.getColumnIndex("point_time"))));
                } catch (ParseException e) {
                    L.d(this.getClass().getSimpleName() + "类: query方法,日期解析失败");
                    L.d("----------错误信息----------");
                    e.printStackTrace();
                    L.d("---------------------------");
                }
                residentHabits.setRing(cursor.getInt(cursor.getColumnIndex("ring")));
                datas.add(residentHabits);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }

    @Override
    public ResidentHabits query(String... id) {
        return null;
    }

    @Override
    public List<ResidentHabits> query(String column, String value) {
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
