package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;

import com.zcareze.domain.regional.dictionary.PublicHabits;
import com.zcareze.zkyandroidweb.utils.L;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 17 : 03
 */

public class PublicHabitsDao extends BaseDao<PublicHabits> {

    private static PublicHabitsDao instance;
    private static final String TABLE_NAME = "public_habits";
    private Context context;

    private PublicHabitsDao(Context context) {
        this.context = context;
    }

    public static PublicHabitsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (PublicHabitsDao.class) {
                if (instance == null)
                    instance = new PublicHabitsDao(context);
            }
        }
        return instance;
    }


    @Override
    public void add(PublicHabits publicHabits) {

    }

    @Override
    public void add(List<PublicHabits> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<PublicHabits> queryAll() {
        Cursor cursor = super.queryAll(context, TABLE_NAME);
        List<PublicHabits> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                PublicHabits publicHabits = new PublicHabits();
                publicHabits.setPointKind(cursor.getInt(cursor.getColumnIndex("point_kind")));
                try {
                    publicHabits.setPointTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA).parse(cursor.getString(cursor.getColumnIndex("point_time"))));
                } catch (ParseException e) {
                    L.d(this.getClass().getSimpleName() + "类: query方法,日期解析失败");
                    L.d("----------错误信息----------");
                    e.printStackTrace();
                    L.d("---------------------------");
                }
                datas.add(publicHabits);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }

    @Override
    public PublicHabits query(String... id) {
        return null;
    }

    @Override
    public List<PublicHabits> query(String column, String value) {
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
