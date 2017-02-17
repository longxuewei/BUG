package com.zcareze.zkyandroidweb.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.zcareze.domain.regional.dictionary.Dictionary;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 11 日 10 : 55
 */

public class DictionaryDao extends BaseDao<Dictionary> {

    private static DictionaryDao instance;
    public static final String TABLE_NAME = "dictionary";
    private Context context;

    private DictionaryDao(Context context) {
        this.context = context;
    }

    public static DictionaryDao getInstance(Context context) {
        if (instance == null) {
            synchronized (DictionaryDao.class) {
                if (instance == null)
                    instance = new DictionaryDao(context);
            }
        }
        return instance;
    }

    @Override
    public void add(Dictionary dictionary) {
        ContentValues values = new ContentValues();
        values.put("table_code", dictionary.getTableCode());
        values.put("name", dictionary.getName());
        values.put("version", dictionary.getVersion());
        values.put("type", dictionary.getType());
        values.put("is_sync", dictionary.getIsSync());
        values.put("last_edit_time", dictionary.getLastEditTime().toString());
    }

    @Override
    public void add(List<Dictionary> bean) {
        for (Dictionary dictionary : bean) {
            ContentValues values = new ContentValues();
            values.put("table_code", dictionary.getTableCode());
            values.put("name", dictionary.getName());
            values.put("version", dictionary.getVersion());
            values.put("type", dictionary.getType());
            values.put("is_sync", dictionary.getIsSync());
            values.put("last_edit_time", dictionary.getLastEditTime().toString());
            SQLiteDatabase writableDatabase = DataBaseHelper.getInstance(context).getWritableDatabase();
            writableDatabase.insert(TABLE_NAME, null, values);
            writableDatabase.close();
        }
    }

    @Override
    public void update(String column, String value) {

    }

    @Override
    public List<Dictionary> queryAll() {
        SQLiteDatabase readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        Cursor query = readableDatabase.query(TABLE_NAME, null, null, null, null, null, null);
        if (query != null && query.getCount() > 0) {
            List<Dictionary> datas = new ArrayList<>();
            while (query.moveToNext()) {
                Dictionary dictionary = new Dictionary();
                dictionary.setName(query.getString(query.getColumnIndex("name")));
                dictionary.setTableCode(query.getString(query.getColumnIndex("table_code")));
                dictionary.setVersion(query.getLong(query.getColumnIndex("version")));
                dictionary.setType(query.getInt(query.getColumnIndex("type")));
                dictionary.setIsSync(query.getInt(query.getColumnIndex("is_sync")));
                String last_edit_time = query.getString(query.getColumnIndex("last_edit_time"));
                try {
                    Date parse = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA).parse(last_edit_time);
                    dictionary.setLastEditTime(parse);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
                datas.add(dictionary);
            }
            readableDatabase.close();
            return datas;
        }
        if(query!=null)
            query.close();
        readableDatabase.close();
        return null;
    }

    @Override
    public Dictionary query(String... id) {
        return null;
    }

    @Override
    public List<Dictionary> query(String column, String value) {
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
