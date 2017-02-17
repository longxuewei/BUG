package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.text.TextUtils;

import com.zcareze.domain.regional.dictionary.MeterList;

import java.util.ArrayList;
import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 15 日 18 : 23
 */

public class MeterListDao extends BaseDao<MeterList> {


    private static MeterListDao instance;
    private static final String TABLE_NAME = "meter_list";
    private Context context;

    private MeterListDao(Context context) {
        this.context = context;
    }

    public static MeterListDao getInstance(Context context) {
        if (instance == null) {
            synchronized (MeterListDao.class) {
                if (instance == null)
                    instance = new MeterListDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(MeterList meterList) {

    }

    @Override
    public void add(List<MeterList> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MeterList> queryAll() {
        return null;
    }

    @Override
    public MeterList query(String... id) {
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor cursor = readableDatabase.query(TABLE_NAME, null, "cursor=?", id, null, null, null);
        MeterList meterList = new MeterList();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                meterList.setCode(cursor.getString(cursor.getColumnIndex("cursor")));
                meterList.setName(cursor.getString(cursor.getColumnIndex("name")));
                meterList.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                meterList.setProducer(cursor.getString(cursor.getColumnIndex("producer")));
                meterList.setSignalKind(cursor.getInt(cursor.getColumnIndex("signal_kind")));
                meterList.setSignalFlag(cursor.getString(cursor.getColumnIndex("signal_flag")));
            }
        }
        cursor.close();
        if (TextUtils.isEmpty(meterList.getCode())) {
            return null;
        } else {
            return meterList;
        }
    }

    @Override
    public List<MeterList> query(String column, String value) {
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

    public List<MeterList> queryByParams(String column, String[] value) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, column, null, value);
        List<MeterList> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterList meterList = new MeterList();
                meterList.setCode(cursor.getString(cursor.getColumnIndex("code")));
                meterList.setName(cursor.getString(cursor.getColumnIndex("name")));
                meterList.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                meterList.setProducer(cursor.getString(cursor.getColumnIndex("producer")));
                meterList.setSignalKind(cursor.getInt(cursor.getColumnIndex("signal_kind")));
                meterList.setSignalFlag(cursor.getString(cursor.getColumnIndex("signal_flag")));
                datas.add(meterList);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }


    /**
     * 绑定设备的时候,根据设备类型,获取metercode 插入connected表
     *
     * @param signalFlag BLE才有!
     * @return
     */
    public String queryMeterCodeBySignalFlag(String signalFlag) {
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        String sql = "select * from " + TABLE_NAME + " where signal_flag=" + "'" + signalFlag + "';";
        Cursor cursor = readableDatabase.rawQuery(sql, null);
        String code = null;
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                code = cursor.getString(cursor.getColumnIndex("code"));
            }
            readableDatabase.close();
            cursor.close();
            return code;
        }
        readableDatabase.close();
        cursor.close();
        return null;
    }
}
