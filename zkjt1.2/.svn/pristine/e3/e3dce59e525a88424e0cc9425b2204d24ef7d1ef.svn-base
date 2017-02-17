package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.zcareze.domain.regional.dictionary.MeterConnected;
import com.zcareze.domain.regional.dictionary.MeterModes;

import java.security.cert.CertificateNotYetValidException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 17 : 29
 */

public class MeterModesDao extends BaseDao<MeterModes> {

    private static MeterModesDao instance;
    private static final String TABLE_NAME = "meter_modes";
    private Context context;

    private MeterModesDao(Context context) {
        this.context = context;
    }

    public static MeterModesDao getInstance(Context context) {
        if (instance == null) {
            synchronized (MeterModesDao.class) {
                if (instance == null)
                    instance = new MeterModesDao(context);
            }
        }
        return instance;
    }


    @Override
    public void add(MeterModes meterModes) {

    }

    @Override
    public void add(List<MeterModes> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MeterModes> queryAll() {
        Cursor cursor = super.queryAll(context, TABLE_NAME);
        List<MeterModes> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterModes meterModes = new MeterModes();
                meterModes.setMeterCode(cursor.getString(cursor.getColumnIndex("meter_code")));
                meterModes.setModeCode(cursor.getString(cursor.getColumnIndex("mode_code")));
                meterModes.setModeName(cursor.getString(cursor.getColumnIndex("mode_name")));
                meterModes.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                meterModes.setTitle(cursor.getString(cursor.getColumnIndex("title")));
                meterModes.setAbbr(cursor.getString(cursor.getColumnIndex("abbr")));
                meterModes.setOperation(cursor.getString(cursor.getColumnIndex("operation")));
                meterModes.setAttention(cursor.getString(cursor.getColumnIndex("attention")));
                meterModes.setDiagram(cursor.getString(cursor.getColumnIndex("diagram")));
                meterModes.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                meterModes.setSignalMark(cursor.getString(cursor.getColumnIndex("signal_mark")));
                meterModes.setSuiteId(cursor.getString(cursor.getColumnIndex("suite_id")));
                datas.add(meterModes);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }

    @Override
    public MeterModes query(String... id) {
        return null;
    }

    @Override
    public List<MeterModes> query(String column, String value) {
        String sql = "select * from " + TABLE_NAME + " where " + column + " = " + "'" + value + "'";
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor cursor = readableDatabase.rawQuery(sql, null);
        List<MeterModes> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterModes meterModes = new MeterModes();
                meterModes.setMeterCode(cursor.getString(cursor.getColumnIndex("meter_code")));
                meterModes.setModeCode(cursor.getString(cursor.getColumnIndex("mode_code")));
                meterModes.setModeName(cursor.getString(cursor.getColumnIndex("mode_name")));
                meterModes.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                meterModes.setTitle(cursor.getString(cursor.getColumnIndex("title")));
                meterModes.setAbbr(cursor.getString(cursor.getColumnIndex("abbr")));
                meterModes.setOperation(cursor.getString(cursor.getColumnIndex("operation")));
                meterModes.setAttention(cursor.getString(cursor.getColumnIndex("attention")));
                meterModes.setDiagram(cursor.getString(cursor.getColumnIndex("diagram")));
                meterModes.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                meterModes.setSignalMark(cursor.getString(cursor.getColumnIndex("signal_mark")));
                meterModes.setSuiteId(cursor.getString(cursor.getColumnIndex("suite_id")));
                datas.add(meterModes);
            }
        }
        readableDatabase.close();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }

    @Override
    public String getTableName() {
        return null;
    }

    @Override
    public String[] getPrimaryKeyName() {
        return new String[0];
    }

    public List<MeterModes> queryByParams(String columnName, String[] values) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, columnName, null, values);
        List<MeterModes> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterModes meterModes = new MeterModes();
                meterModes.setMeterCode(cursor.getString(cursor.getColumnIndex("meter_code")));
                meterModes.setModeCode(cursor.getString(cursor.getColumnIndex("mode_code")));
                meterModes.setModeName(cursor.getString(cursor.getColumnIndex("mode_name")));
                meterModes.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                meterModes.setTitle(cursor.getString(cursor.getColumnIndex("title")));
                meterModes.setAbbr(cursor.getString(cursor.getColumnIndex("abbr")));
                meterModes.setOperation(cursor.getString(cursor.getColumnIndex("operation")));
                meterModes.setAttention(cursor.getString(cursor.getColumnIndex("attention")));
                meterModes.setDiagram(cursor.getString(cursor.getColumnIndex("diagram")));
                meterModes.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                meterModes.setSignalMark(cursor.getString(cursor.getColumnIndex("signal_mark")));
                meterModes.setSuiteId(cursor.getString(cursor.getColumnIndex("suite_id")));
                datas.add(meterModes);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }


    public List<MeterModes> queryByParams(Map<String, String> params) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, params, null);
        List<MeterModes> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MeterModes meterModes = new MeterModes();
                meterModes.setMeterCode(cursor.getString(cursor.getColumnIndex("meter_code")));
                meterModes.setModeCode(cursor.getString(cursor.getColumnIndex("mode_code")));
                meterModes.setModeName(cursor.getString(cursor.getColumnIndex("mode_name")));
                meterModes.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                meterModes.setTitle(cursor.getString(cursor.getColumnIndex("title")));
                meterModes.setAbbr(cursor.getString(cursor.getColumnIndex("abbr")));
                meterModes.setOperation(cursor.getString(cursor.getColumnIndex("operation")));
                meterModes.setAttention(cursor.getString(cursor.getColumnIndex("attention")));
                meterModes.setDiagram(cursor.getString(cursor.getColumnIndex("diagram")));
                meterModes.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                meterModes.setSignalMark(cursor.getString(cursor.getColumnIndex("signal_mark")));
                meterModes.setSuiteId(cursor.getString(cursor.getColumnIndex("suite_id")));
                datas.add(meterModes);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }
}
