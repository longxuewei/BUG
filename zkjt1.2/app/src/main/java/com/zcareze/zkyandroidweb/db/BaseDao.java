package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.zcareze.domain.regional.dictionary.MonitorCautions;
import com.zcareze.zkyandroidweb.utils.L;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 10 日 10 : 46
 * <p>
 * 此类是对表的操作的基类,子类可根据具体业务来实现
 */


public abstract class BaseDao<T> {

    private SQLiteDatabase readableDatabase;

    /**
     * 根据对象插入数据
     *
     * @param t
     */
    public abstract void add(T t);

    /**
     * 根据对象集合插入
     *
     * @param bean
     */
    public abstract void add(List<T> bean);

    /**
     * 根据ID删除
     *
     * @param id 对象ID,可能涉及联合主键所以是可变参数.
     */
    public void delete(String... id) {
        getPrimaryKeyName();

    }

    /**
     * 根据参数删除
     *
     * @param params 参数格式: Map<列名,参数值>
     */
    public void delete(Map<String, String> params) {
    }


    /**
     * 删除所有
     */
    public void deleteAll() {
    }

    /**
     * 批量修改
     *
     * @param params 参数格式:Map<列名,值>
     */
    public void update(Map<String, String> params) {
    }

    /**
     * 根据参数来更新数据
     *
     * @param column 列名
     * @param value  值
     */
    public abstract void update(String column, String value);

    /**
     * 查询所有
     *
     * @return
     */
    public Cursor queryAll(Context context, String table) {
        if (TextUtils.isEmpty(table))
            return null;
        DataBaseHelper instance = DataBaseHelper.getInstance(context);
        readableDatabase = instance.getReadableDatabase();
        return readableDatabase.query(table, null, null, null, null, null, null);
    }


    public Cursor queryAllOlderBy(Context context, String tableName, String orderByType) {
        if (TextUtils.isEmpty(tableName))
            return null;
        DataBaseHelper instance = DataBaseHelper.getInstance(context);
        readableDatabase = instance.getReadableDatabase();
        return readableDatabase.query(tableName, null, null, null, null, null, TextUtils.isEmpty(orderByType) ? null : orderByType);
    }


    public abstract List<T> queryAll();

    /**
     * 根据ID来查询
     *
     * @param id 包含联合主键ID, <这里不排除有的表没有ID的可能./>
     * @return
     */
    public abstract T query(String... id);


    /**
     * 根据参数查询数据
     *
     * @param column
     * @param value
     * @return
     */
    public abstract List<T> query(String column, String value);


    /**
     * 本方法 是用 and 查询,出现重复的columnName(列名)所以参数定义为Map
     *
     * @param context
     * @param tableName
     * @param params    参数Key为列名,不能重复(and查询). Value为查询column的值.
     * @param orderBy
     * @return
     */
    public Cursor queryByParams(Context context, @NonNull String tableName, Map<String, String> params, @Nullable String orderBy) {
        if (TextUtils.isEmpty(tableName) || params == null || params.size() == 0) {
            return null;
        }
        String selection = "";
        String selectArgs = "";
        for (Map.Entry<String, String> data : params.entrySet()) {
            selection += data.getKey() + "=? and ";
            selectArgs += data.getValue() + ",";
        }
        if (selection.endsWith("and "))
            selection = selection.substring(0, selection.length() - 4);
        String[] split = selectArgs.split(",");
        readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        return readableDatabase.query(tableName, null, selection, split, null, null, TextUtils.isEmpty(orderBy) ? null : orderBy);
    }


    /**
     * 查询相同的 列名, 不同的值, 因为 Map集合的数据结构原因不能满足所以重载查询一个方法!
     *
     * @param context
     * @param tableName
     * @param columnName
     * @param columnValue
     * @return
     */
    public Cursor queryByParams(Context context, String tableName, String columnName, @Nullable String orderBy, String[] values) {
        if (TextUtils.isEmpty(tableName) || columnName == null || values.length == 0)
            return null;
        String selection = "";
        String selectArgs = "";
        for (String value : values) {
            selection += columnName + "=? or ";
            selectArgs += value + ",";
        }
        if (selection.endsWith("or "))
            selection = selection.substring(0, selection.length() - 3);
        String[] split = selectArgs.split(",");
        readableDatabase = DataBaseHelper.getInstance(context).getReadableDatabase();
        return readableDatabase.query(tableName, null, selection, split, null, null, TextUtils.isEmpty(orderBy) ? null : orderBy);
    }


    protected void closeSqlite() {
        if (readableDatabase != null)
            readableDatabase.close();
    }

    /**
     * 获取表名
     *
     * @return
     */
    public abstract String getTableName();


    /**
     * 子类提供主键名,供父类使用.
     *
     * @return
     */
    public abstract String[] getPrimaryKeyName();
}
