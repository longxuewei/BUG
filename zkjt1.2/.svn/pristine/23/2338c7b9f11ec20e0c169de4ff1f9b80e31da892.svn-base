package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.zcareze.domain.regional.dictionary.MonitorReferences;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 15 : 55
 */

public class MonitorReferencesDao extends BaseDao<MonitorReferences> {
    private static MonitorReferencesDao instance;
    private static final String TABLE_NAME = "monitor_references";
    private Context context;

    private MonitorReferencesDao(Context context) {
        this.context = context;
    }

    public static MonitorReferencesDao getInstance(Context context) {
        if (instance == null) {
            synchronized (MonitorReferencesDao.class) {
                if (instance == null)
                    instance = new MonitorReferencesDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(MonitorReferences monitorReferences) {

    }

    @Override
    public void add(List<MonitorReferences> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MonitorReferences> queryAll() {
        return null;
    }

    @Override
    public MonitorReferences query(String... id) {
        return null;
    }

    @Override
    public List<MonitorReferences> query(String column, String value) {
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


    /**
     * 子类特有查询方法
     *
     * @param itmeId
     * @param meterCode
     * @return
     */
    public List<MonitorReferences> queryByParamsHoist(String itmeId, String meterCode) {
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor query = readableDatabase.query(TABLE_NAME, null, "item_id=? and (meter_code=? or meter_code is null or meter_code='')", new String[]{itmeId, meterCode}, null, null, "seq_no asc");
        List<MonitorReferences> data = new ArrayList<>();
        if (query.getCount() > 0) {
            while (query.moveToNext()) {
                MonitorReferences monitorReferences = new MonitorReferences();
                monitorReferences.setItemId(query.getString(query.getColumnIndex("item_id")));
                monitorReferences.setSeqNo(query.getInt(query.getColumnIndex("seq_no")));
                monitorReferences.setMeterCode(query.getString(query.getColumnIndex("meter_code")));
                monitorReferences.setDivSex(query.getString(query.getColumnIndex("div_sex")));
                monitorReferences.setDivAge(query.getString(query.getColumnIndex("div_age")));
                monitorReferences.setDivPart(query.getString(query.getColumnIndex("div_part")));
                monitorReferences.setDivSeason(query.getString(query.getColumnIndex("div_season")));
                monitorReferences.setDivTime(query.getString(query.getColumnIndex("div_time")));
                monitorReferences.setDivStatus(query.getString(query.getColumnIndex("div_status")));
                monitorReferences.setPretreat(query.getString(query.getColumnIndex("pretreat")));
                monitorReferences.setValidMin(new BigDecimal(query.getFloat(query.getColumnIndex("valid_min"))));
                monitorReferences.setValidMax(new BigDecimal(query.getFloat(query.getColumnIndex("valid_max"))));
                monitorReferences.setSubtitle(query.getString(query.getColumnIndex("subtitle")));
                monitorReferences.setValidText(query.getString(query.getColumnIndex("valid_text")));
                data.add(monitorReferences);
            }
        }
        readableDatabase.close();
        query.close();
        return data.size() <= 0 ? null : data;
    }
}
