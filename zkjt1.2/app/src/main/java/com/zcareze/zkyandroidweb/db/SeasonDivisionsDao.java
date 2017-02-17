package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;

import com.zcareze.domain.regional.dictionary.SeasonDivisions;
import com.zcareze.zkyandroidweb.utils.L;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 16 : 49
 */

public class SeasonDivisionsDao extends BaseDao<SeasonDivisions> {
    private static SeasonDivisionsDao instance;
    private static final String TABLE_NAME = "season_divisions";
    private Context context;

    private SeasonDivisionsDao(Context context) {
        this.context = context;
    }

    public static SeasonDivisionsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (SeasonDivisionsDao.class) {
                if (instance == null)
                    instance = new SeasonDivisionsDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(SeasonDivisions seasonDivisions) {

    }

    @Override
    public void add(List<SeasonDivisions> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<SeasonDivisions> queryAll() {
        Cursor cursor = super.queryAll(context, TABLE_NAME);
        List<SeasonDivisions> data = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                SeasonDivisions seasonDivisions = new SeasonDivisions();
                seasonDivisions.setName(cursor.getString(cursor.getColumnIndex("name")));
                try {
                    seasonDivisions.setMin(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA).parse(cursor.getString(cursor.getColumnIndex("min"))));
                    seasonDivisions.setMax(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA).parse(cursor.getString(cursor.getColumnIndex("max"))));
                } catch (ParseException e) {
                    L.d(this.getClass().getSimpleName() + "类: query方法,日期解析失败");
                    L.d("----------错误信息----------");
                    e.printStackTrace();
                    L.d("---------------------------");
                }
                data.add(seasonDivisions);
            }
        }
        super.closeSqlite();
        cursor.close();
        return data.size() <= 0 ? null : data;
    }

    @Override
    public SeasonDivisions query(String... id) {
        return null;
    }

    @Override
    public List<SeasonDivisions> query(String column, String value) {
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
