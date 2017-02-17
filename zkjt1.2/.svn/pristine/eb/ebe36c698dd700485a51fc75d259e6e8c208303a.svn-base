package com.zcareze.zkyandroidweb.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;

import com.zcareze.domain.regional.dictionary.MeterConnected;
import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.zkyandroidweb.utils.L;
import com.zcareze.zkyandroidweb.utils.T;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 17 : 35
 */

public class MeterConnectedDao extends BaseDao<MeterConnected> {


    private static MeterConnectedDao instance;
    private static final String TABLE_NAME = "meter_connected";
    private Context context;

    private MeterConnectedDao(Context context) {
        this.context = context;
    }

    public static MeterConnectedDao getInstance(Context context) {
        if (instance == null) {
            synchronized (MeterConnectedDao.class) {
                if (instance == null)
                    instance = new MeterConnectedDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(MeterConnected meterConnected) {
        SQLiteDatabase writableDatabase = DataBaseHelper.getInstance(context).getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("meter_code", meterConnected.getMeterCode());
        values.put("signal_kind", meterConnected.getSignalKind());
        values.put("id_code", meterConnected.getIdCode());
        try {
            writableDatabase.insert(TABLE_NAME, null, values);
        } catch (SQLiteException e) {
            T.l(context, "插入失败,该设备已被绑定,无法重复绑定!");
            e.printStackTrace();
        }
    }


    //0失败,1成功,2已绑定.
    public int bindDevice(MeterConnected meterConnected) {
        SQLiteDatabase writableDatabase = DataBaseHelper.getInstance(context).getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put("meter_code", meterConnected.getMeterCode());
        values.put("signal_kind", meterConnected.getSignalKind());
        values.put("id_code", meterConnected.getIdCode());
        try {
            long insert = writableDatabase.insert(TABLE_NAME, null, values);
            return insert <= 0 ? 0 : 1;
        } catch (SQLiteException e) {
            T.l(context, "插入失败,该类型设备已被绑定,无法重复绑定!");

            e.printStackTrace();
            return 2;
        } finally {
            writableDatabase.close();
        }
    }


    public int check(String suiteid) {
        String sql = " select meter_code from meter_connected where meter_code in (select meter_modes.meter_code from meter_modes where suite_id = '" + suiteid + "');";
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor cursor = readableDatabase.rawQuery(sql, null);
        int count = 0;
        if (cursor != null) {
            count = cursor.getCount();
        }
        L.d(count + "");
        readableDatabase.close();
        cursor.close();
        return count > 0 ? 1 : 0;
    }


    @Override
    public void add(List<MeterConnected> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MeterConnected> queryAll() {
        Cursor cursor = super.queryAll(context, TABLE_NAME);
        List<MeterConnected> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterConnected meterConnected = new MeterConnected();
                meterConnected.setMeterCode(cursor.getString(cursor.getColumnIndex("meter_code")));
                meterConnected.setSignalKind(cursor.getInt(cursor.getColumnIndex("signal_kind")));
                meterConnected.setIdCode(cursor.getString(cursor.getColumnIndex("id_code")));
                datas.add(meterConnected);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }


    /**
     * 获取所有的蓝牙设备
     *
     * @return
     */
    public List<MeterConnected> getAllBleDeviceInfo() {
        List<MeterConnected> meterConnecteds = queryAll();
        if (meterConnecteds != null) {
            for (Iterator<MeterConnected> iterator = meterConnecteds.iterator(); iterator.hasNext(); ) {
                MeterConnected next = iterator.next();
                if (next.getSignalKind() != 1)
                    iterator.remove();
            }
        } else {
            return null;
        }
        return meterConnecteds.size() <= 0 ? null : meterConnecteds;
    }

    @Override
    public MeterConnected query(String... id) {
        return null;
    }

    @Override
    public List<MeterConnected> query(String column, String value) {
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

    public List<MeterConnected> queryByParams(Map<String, String> params) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, params, null);
        List<MeterConnected> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterConnected meterConnected = new MeterConnected();
                meterConnected.setMeterCode(cursor.getString(cursor.getColumnIndex("meter_code")));
                meterConnected.setSignalKind(cursor.getInt(cursor.getColumnIndex("signal_kind")));
                meterConnected.setIdCode(cursor.getString(cursor.getColumnIndex("id_code")));
                datas.add(meterConnected);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }


    public List<MeterConnected> queryByParams(String columnName, String[] values) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, columnName, null, values);
        List<MeterConnected> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterConnected meterConnected = new MeterConnected();
                meterConnected.setMeterCode(cursor.getString(cursor.getColumnIndex("meter_code")));
                meterConnected.setSignalKind(cursor.getInt(cursor.getColumnIndex("signal_kind")));
                meterConnected.setIdCode(cursor.getString(cursor.getColumnIndex("id_code")));
                datas.add(meterConnected);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }
}
