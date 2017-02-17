package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.zcareze.domain.regional.resident.ResidentFocusValue;
import com.zcareze.zkyandroidweb.utils.L;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 12 : 07
 */

public class ResidentFocusValueDao extends BaseDao<ResidentFocusValue> {

    private static ResidentFocusValueDao instance;
    private static final String TABLE_NAME = "resident_focus_value";
    private Context context;

    private ResidentFocusValueDao(Context context) {
        this.context = context;
    }

    public static ResidentFocusValueDao getInstance(Context context) {
        if (instance == null) {
            synchronized (ResidentFocusValueDao.class) {
                if (instance == null)
                    instance = new ResidentFocusValueDao(context);
            }
        }
        return instance;
    }


    @Override
    public void add(ResidentFocusValue residentFocusValue) {

    }

    @Override
    public void add(List<ResidentFocusValue> bean) {

    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<ResidentFocusValue> queryAll() {
        return null;
    }

    @Override
    public ResidentFocusValue query(String... id) {
        return null;
    }

    @Override
    public List<ResidentFocusValue> query(String column, String value) {
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
     * 子类特殊方法, 获取原始值
     *
     * @param itemId
     * @param residentID
     * @return
     */
    public ResidentFocusValue getConvertScore(String itemId, String residentID) {
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor query = readableDatabase.query(TABLE_NAME, null, "item_id =? and resident_id =?", new String[]{itemId, residentID}, null, null, null);
        if (query.getCount() <= 0)
            return null;
        ResidentFocusValue residentFocusValue = null;
        if (query.getCount() > 0) {
            while (query.moveToNext()) {
                residentFocusValue = new ResidentFocusValue();
                residentFocusValue.setId(query.getString(query.getColumnIndex("id")));
                residentFocusValue.setResidentId(query.getString(query.getColumnIndex("resident_id")));
                residentFocusValue.setItemId(query.getString(query.getColumnIndex("item_id")));
                residentFocusValue.setSubtitle(query.getString(query.getColumnIndex("subtitle")));
                residentFocusValue.setValidText(query.getString(query.getColumnIndex("valid_text")));
                residentFocusValue.setValidMin(new BigDecimal(query.getString(query.getColumnIndex("valid_min"))));
                residentFocusValue.setValidMax(new BigDecimal(query.getString(query.getColumnIndex("valid_max"))));
                residentFocusValue.setAimMin(new BigDecimal(query.getInt(query.getColumnIndex("aim_min"))));
                residentFocusValue.setAimMax(new BigDecimal(query.getInt(query.getColumnIndex("over_max"))));
                residentFocusValue.setAwayLimit(query.getInt(query.getColumnIndex("away_limit")));
                residentFocusValue.setTrendLimit(query.getInt(query.getColumnIndex("trend_limit")));
                residentFocusValue.setRawResult(query.getString(query.getColumnIndex("raw_result")));
                residentFocusValue.setPretreatValue(new BigDecimal(query.getString(query.getColumnIndex("pretreat_value"))));
                residentFocusValue.setAwayArrow(query.getInt(query.getColumnIndex("away_arrow")));
                residentFocusValue.setAwayCount(query.getInt(query.getColumnIndex("away_count")));
                residentFocusValue.setTrendArrow(query.getInt(query.getColumnIndex("trend_arrow")));
                residentFocusValue.setTrendCount(query.getInt(query.getColumnIndex("trend_count")));
                String last_time = query.getString(query.getColumnIndex("last_time"));
                try {
                    residentFocusValue.setLastTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA).parse(last_time));
                } catch (ParseException e) {
                    L.d("解析失败");
                    e.printStackTrace();

                }
            }

        }
        query.close();
        readableDatabase.close();
        return residentFocusValue;
    }
}
