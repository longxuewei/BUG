package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.domain.regional.dictionary.MonitorItems;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 11 : 57
 */

public class MonitorItemsDao extends BaseDao<MonitorItems> {

    private static MonitorItemsDao instance;
    private static final String TABLE_NAME = "monitor_items";
    private Context context;

    private MonitorItemsDao(Context context) {
        this.context = context;
    }

    public static MonitorItemsDao getInstance(Context context) {
        if (instance == null) {
            synchronized (DictionaryDao.class) {
                if (instance == null)
                    instance = new MonitorItemsDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(MonitorItems monitorItems) {

    }

    @Override
    public void add(List<MonitorItems> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<MonitorItems> queryAll() {
        return null;
    }

    @Override
    public MonitorItems query(String... id) {
        return null;
    }

    @Override
    public List<MonitorItems> query(String column, String value) {
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
     * 子类特有方法:
     * 查询部位,时间节点.用于测量!
     *
     * @return
     */
    public List<MonitorItems> getSpecialValue() {
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor query = readableDatabase.query(TABLE_NAME, null, "special=? or special =?", new String[]{"01", "02"}, null, null, null);
        if (query.getCount() > 0) {
            List<MonitorItems> data = new ArrayList<>();
            while (query.moveToNext()) {
                MonitorItems monitorItems = new MonitorItems();
                monitorItems.setId(query.getString(query.getColumnIndex("id")));
                monitorItems.setcName(query.getString(query.getColumnIndex("c_name")));
                monitorItems.seteName(query.getString(query.getColumnIndex("e_name")));
                monitorItems.setAbbr(query.getString(query.getColumnIndex("abbr")));
                monitorItems.setComment(query.getString(query.getColumnIndex("comment")));
                monitorItems.setValueType(query.getInt(query.getColumnIndex("value_type")));
                monitorItems.setUnit(query.getString(query.getColumnIndex("unit")));
                monitorItems.setOverMin(new BigDecimal(query.getInt(query.getColumnIndex("over_min"))));
                monitorItems.setOverMax(new BigDecimal(query.getInt(query.getColumnIndex("over_max"))));
                monitorItems.setValueList(query.getString(query.getColumnIndex("value_list")));
                monitorItems.setDefResult(query.getString(query.getColumnIndex("def_result")));
                monitorItems.setSpecial(query.getString(query.getColumnIndex("special")));
                monitorItems.setSeqNo(query.getInt(query.getColumnIndex("seq_no")));
                monitorItems.setMayChart(query.getInt(query.getColumnIndex("may_chart")));
                monitorItems.setAxisMin(new BigDecimal(query.getFloat(query.getColumnIndex("axis_min"))));
                monitorItems.setAxisMax(new BigDecimal(query.getFloat(query.getColumnIndex("axis_max"))));
                data.add(monitorItems);
            }
            query.close();
            return data;
        } else {
            query.close();
            readableDatabase.close();
            return null;
        }
    }

    public List<MonitorItems> queryByParams(Map<String, String> params) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, params, null);
        List<MonitorItems> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MonitorItems monitorItems = new MonitorItems();
                monitorItems.setId(cursor.getString(cursor.getColumnIndex("id")));
                monitorItems.setcName(cursor.getString(cursor.getColumnIndex("c_name")));
                monitorItems.seteName(cursor.getString(cursor.getColumnIndex("e_name")));
                monitorItems.setAbbr(cursor.getString(cursor.getColumnIndex("abbr")));
                monitorItems.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                monitorItems.setValueType(cursor.getInt(cursor.getColumnIndex("value_type")));
                monitorItems.setUnit(cursor.getString(cursor.getColumnIndex("unit")));
                monitorItems.setOverMin(new BigDecimal(cursor.getInt(cursor.getColumnIndex("over_min"))));
                monitorItems.setOverMax(new BigDecimal(cursor.getInt(cursor.getColumnIndex("over_max"))));
                monitorItems.setValueList(cursor.getString(cursor.getColumnIndex("value_list")));
                monitorItems.setDefResult(cursor.getString(cursor.getColumnIndex("def_result")));
                monitorItems.setSpecial(cursor.getString(cursor.getColumnIndex("special")));
                monitorItems.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                monitorItems.setMayChart(cursor.getInt(cursor.getColumnIndex("may_chart")));
                monitorItems.setAxisMin(new BigDecimal(cursor.getFloat(cursor.getColumnIndex("axis_min"))));
                monitorItems.setAxisMax(new BigDecimal(cursor.getFloat(cursor.getColumnIndex("axis_max"))));
                datas.add(monitorItems);
            }
        }

        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;

    }


    public List<MonitorItems> queryByParams(String columnName, String[] values) {
        Cursor cursor = super.queryByParams(context, TABLE_NAME, columnName, null, values);
        List<MonitorItems> datas = new ArrayList<>();
        if (cursor.getCount() > 0) {
            while (cursor.moveToNext()) {
                MonitorItems meterModes = new MonitorItems();
                meterModes.setId(cursor.getString(cursor.getColumnIndex("id")));
                meterModes.setcName(cursor.getString(cursor.getColumnIndex("c_name")));
                meterModes.seteName(cursor.getString(cursor.getColumnIndex("e_name")));
                meterModes.setAbbr(cursor.getString(cursor.getColumnIndex("abbr")));
                meterModes.setComment(cursor.getString(cursor.getColumnIndex("comment")));
                meterModes.setValueType(cursor.getInt(cursor.getColumnIndex("value_type")));
                meterModes.setUnit(cursor.getString(cursor.getColumnIndex("unit")));
                meterModes.setOverMin(new BigDecimal(cursor.getInt(cursor.getColumnIndex("over_min"))));
                meterModes.setOverMax(new BigDecimal(cursor.getInt(cursor.getColumnIndex("over_max"))));
                meterModes.setValueList(cursor.getString(cursor.getColumnIndex("value_list")));
                meterModes.setDefResult(cursor.getString(cursor.getColumnIndex("def_result")));
                meterModes.setSpecial(cursor.getString(cursor.getColumnIndex("special")));
                meterModes.setSeqNo(cursor.getInt(cursor.getColumnIndex("seq_no")));
                meterModes.setMayChart(cursor.getInt(cursor.getColumnIndex("may_chart")));
                meterModes.setAxisMin(new BigDecimal(cursor.getInt(cursor.getColumnIndex("axis_min"))));
                meterModes.setAxisMax(new BigDecimal(cursor.getInt(cursor.getColumnIndex("axis_max"))));
                datas.add(meterModes);
            }
        }
        super.closeSqlite();
        cursor.close();
        return datas.size() <= 0 ? null : datas;
    }


}
