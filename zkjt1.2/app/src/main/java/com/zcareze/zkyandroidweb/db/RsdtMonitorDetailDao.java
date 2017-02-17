package com.zcareze.zkyandroidweb.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;

import com.zcareze.domain.regional.RsdtMonitorDetail;
import com.zcareze.zkyandroidweb.utils.L;

import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 15 : 33
 */

public class RsdtMonitorDetailDao extends BaseDao<RsdtMonitorDetail> {
    private static RsdtMonitorDetailDao instance;
    private static final String TABLE_NAME = "rsdt_monitor_detail";
    private Context context;

    private RsdtMonitorDetailDao(Context context) {
        this.context = context;
    }

    public static RsdtMonitorDetailDao getInstance(Context context) {
        if (instance == null) {
            synchronized (RsdtMonitorDetailDao.class) {
                if (instance == null)
                    instance = new RsdtMonitorDetailDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(RsdtMonitorDetail rsdtMonitorDetail) {
        SQLiteDatabase writableDatabase = DataBaseHelper.getInstance(context).getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("id", rsdtMonitorDetail.getId());
        values.put("monitor_id", rsdtMonitorDetail.getMonitorId());
        values.put("item_id", rsdtMonitorDetail.getItemId());
        values.put("item_name", rsdtMonitorDetail.getItemName());
        values.put("item_type", rsdtMonitorDetail.getItemType());
        values.put("item_unit", rsdtMonitorDetail.getItemUnit());
        values.put("raw_result", rsdtMonitorDetail.getRawResult());
        values.put("pretreat_value", rsdtMonitorDetail.getPretreatValue() + "");
        values.put("caution", rsdtMonitorDetail.getCaution());
        values.put("arrow", rsdtMonitorDetail.getArrow());
        values.put("subtitle", rsdtMonitorDetail.getSubtitle());
        values.put("valid_text", rsdtMonitorDetail.getValidText());
        try {
            writableDatabase.insert(TABLE_NAME, null, values);
        } catch (SQLiteException s) {
            L.d(this.getClass().getSimpleName() + "类:   add方法抛出异常: ");
            L.d("----------异常信息----------");
            s.printStackTrace();
            L.d("-----------------------------");
        } finally {
            writableDatabase.close();
        }
        writableDatabase.close();
    }

    @Override
    public void add(List<RsdtMonitorDetail> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<RsdtMonitorDetail> queryAll() {
        return null;
    }

    @Override
    public RsdtMonitorDetail query(String... id) {
        return null;
    }

    @Override
    public List<RsdtMonitorDetail> query(String column, String value) {
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
