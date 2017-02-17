package com.zcareze.zkyandroidweb.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;

import com.zcareze.domain.regional.dictionary.BaseDictionaryDataDomain;
import com.zcareze.regional.service.result.BaseDictionaryDataResult;
import com.zcareze.zkyandroidweb.utils.L;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 10 日 11 : 41
 * <p>
 * 业务数据表的初始化,和需要同步的数据库的初始化
 */

public class DataBaseHelper extends SQLiteOpenHelper {

    //要更新的表
    private static final String[] e_tableName = {"season_names", "time_names", "age_divisions", "meter_list", "meter_connected", "meter_modes", "monitor_items", "monitor_references", "monitor_cautions", "monitor_suites", "monitor_suite_items", "public_habits", "season_divisions", "time_divisions", "med_way", "herb_way", "frequency_list", "intervene_list", "guidance_list", "evaluation_list"};
    private static final String[] c_tableName = {"时节命名", "时点命名", "年龄段", "监测仪器", "连接仪器", "仪器运行模式", "监测指标项目", "监测参考值", "监测提示语", "监测执行组", "监测组指标", "公众生活信息", "季节划分", "时点划分", "给药途径", "草药给药途径", "频率目录", "干预操作目录", "健康指导目录", "健康测评目录"};

    private static final String DATABASE_NAME = "zky.db";
    private static DataBaseHelper instance;

    private DataBaseHelper(Context context) {
        super(context, DATABASE_NAME, null, 1);
        initDataBase();
    }


    /**
     * 初始化数据库 这里会走
     */
    private void initDataBase() {
        SQLiteDatabase writableDatabase = this.getWritableDatabase();
        writableDatabase.close();
    }


    /**
     * 单例操作
     *
     * @param context
     * @return
     */
    public static DataBaseHelper getInstance(Context context) {
        if (instance == null) {
            synchronized (DataBaseHelper.class) {
                if (instance == null)
                    instance = new DataBaseHelper(context);
            }
        }
        return instance;
    }


    @Override
    public void onCreate(SQLiteDatabase db) {
        L.d("The DataBase is initialized");
        initBaseTable(db);
        insertUpdateTable(db);
    }

    //插入需要更新的表.
    private void insertUpdateTable(SQLiteDatabase db) {
        db.beginTransaction();
        try {
            for (int i = 0; i < e_tableName.length; i++) {
                StringBuffer sb = new StringBuffer("INSERT INTO dictionary(table_code,name,version,type,is_sync,last_edit_time) VALUES(");
                sb.append("'" + e_tableName[i] + "',");
                sb.append("'" + c_tableName[i] + "',");
                sb.append("'" + -1 + "',");
                sb.append("'" + 1 + "',");
                sb.append("'" + 1 + "',");
                sb.append("datetime(\"now\",\"localtime\"))");
                String s = sb.toString();
                db.execSQL(s);
                sb = null;
            }
            db.setTransactionSuccessful();
        } catch (SQLiteException e) {
            L.d(this.getClass().getSimpleName() + ": initBaseData 插入数据失败,回滚!");
        } finally {
            db.endTransaction();
        }
    }


    /**
     * 初始化基本的表
     *
     * @param db
     */
    private void initBaseTable(SQLiteDatabase db) {
        List<String> createTableLanguage = getCreateTableLanguage();
        db.beginTransaction();
        try {
            for (String language : createTableLanguage) {
                db.execSQL(language);
            }
            db.setTransactionSuccessful();
        } catch (SQLiteException e) {
            L.d(this.getClass().getSimpleName() + ": initBaseData 插入数据失败,回滚!");
        } finally {
            db.endTransaction();
        }
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }


    /**
     * 建表语句;一下建表包含了:
     * 1.时季命名(season_names)
     * 2.时点命名(time_names)
     * 3.年龄划分(age_divisions)
     * 4.检测仪器(meter_list)
     * 5.连接仪器(meter_connected)
     * 6.仪器运行模式(meter_modes)
     * 7.检测指标项目(monitor_items)
     * 8.监测参考值(monitor_references)
     * 9.监测提示语(monitor_cautions)
     * 10.监测执行组(monitor_suites
     * 11.监测组指标(monitor_suite_items
     * 12.居民监测记录(rsdt_monitor_list)
     * 13.居民监测数据(rsdt_monitor_detail)
     * 14.字典表(dictionary)
     * 15.季节(season_divisions)
     * 16.时间(time_divisions)
     * 17.公民生活信息(public_habits)
     * 18.居民生活信息(resident_habits)
     * 19.居民重点指标值(resident_focus_value)
     * 20.健康测评目录(evaluation_list)
     * 21.频率目录(frequency_list)
     * 22.健康指导目录(guidance_list)
     * 23.草药给药途径(herb_way)
     * 24.干预操作目录(intervene_list)
     * 25.给药途径(med_way)
     * 26.药品目录(medicine_list)
     *
     * @return
     */
    private List<String> getCreateTableLanguage() {
        List<String> tables = new ArrayList<>();

        String season_names = "CREATE TABLE season_names(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(5) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(season_names);


        String time_names = "CREATE TABLE time_names(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(5) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(time_names);
        String age_divisions = "CREATE TABLE age_divisions(" +
                "name varchar(30) NOT NULL PRIMARY KEY," +
                "min int(3) DEFAULT NULL," +
                "max int(3) DEFAULT NULL)";
        tables.add(age_divisions);
        String meter_list = "CREATE TABLE meter_list(" +
                "code varchar(3) NOT NULL PRIMARY KEY," +
                "name varchar(30) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "producer varchar(40) DEFAULT NULL," +
                "signal_kind int(1) DEFAULT NULL," +
                "signal_flag varchar(30) DEFAULT NULL)";
        //删除id_code
        tables.add(meter_list);
        String meter_connected = "CREATE TABLE meter_connected(" +
                "meter_code varchar(3) NOT NULL," +
                "signal_kind int(1) DEFAULT NULL," +
                "id_code varchar(30) DEFAULT NULL," +
                "PRIMARY KEY (id_code))";
        tables.add(meter_connected);
        String meter_modes = "CREATE TABLE meter_modes(" +
                "meter_code varchar(3) NOT NULL," +
                "mode_code varchar(1) NOT NULL," +
                "mode_name varchar(30) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "title varchar(10) DEFAULT NULL," +
                "abbr varchar(6) DEFAULT NULL," +
                "operation varchar(600) DEFAULT NULL," +
                "attention varchar(600) DEFAULT NULL," +
                "diagram varchar(200) DEFAULT NULL," +
                "seq_no int(3) DEFAULT NULL," +
                "signal_mark varchar(30) DEFAULT NULL," +
                "suite_id char(32) DEFAULT NULL," +
                "PRIMARY KEY(meter_code,mode_code))";
        tables.add(meter_modes);
        String monitor_items = "CREATE TABLE monitor_items(" +
                "id char(32) NOT NULL PRIMARY KEY," +
                "c_name varchar(30) DEFAULT NULL," +
                "e_name varchar(30) DEFAULT NULL," +
                "abbr varchar(10) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "value_type int(1) DEFAULT NULL," +
                "unit varchar(20) DEFAULT NULL," +
                "over_min decimal(16) DEFAULT NULL," +//类型改变 2016-9-19 17:25:49
                "over_max decimal(16) DEFAULT NULL," +//类型改变
                "value_list varchar(200) DEFAULT NULL," +
                "def_result varchar(30) DEFAULT NULL," +
                "exempt int(1) DEFAULT NULL," +
                "special varchar(2) DEFAULT NULL," +
                "seq_no int(5) DEFAULT NULL," +
                "may_chart int(1) DEFAULT NULL," +
                "axis_min decimal(16) DEFAULT NULL," +
                "axis_max decimal(16) DEFAULT NULL)";
        tables.add(monitor_items);
        String monitor_references = "CREATE TABLE monitor_references (" +
                "item_id char(32) NOT NULL," +
                "seq_no int(2) NOT NULL," +
                "meter_code varchar(3) DEFAULT NULL," +
                "div_sex varchar(2) DEFAULT NULL," +
                "div_age varchar(30) DEFAULT NULL," +
                "div_part varchar(30) DEFAULT NULL," +
                "div_season varchar(30) DEFAULT NULL," +
                "div_time varchar(30) DEFAULT NULL," +
                "div_status varchar(30) DEFAULT NULL," +
                "pretreat varchar(250) DEFAULT NULL," +
                "valid_min float DEFAULT NULL," +
                "valid_max float DEFAULT NULL," +
                "subtitle varchar(10) DEFAULT NULL," +
                "valid_text varchar(30) DEFAULT NULL," +
                "PRIMARY KEY (item_id,seq_no))";
        tables.add(monitor_references);
        String monitor_cautions = "CREATE TABLE monitor_cautions(" +
                "item_id char(32) NOT NULL," +
                "step_no int(5) NOT NULL," +
                "verdict varchar(250) DEFAULT NULL," +
                "true_goto int(5) DEFAULT NULL," +
                "true_word varchar(250) DEFAULT NULL," +
                "false_goto int(5) DEFAULT NULL," +
                "false_word varchar(250) DEFAULT NULL," +
                "PRIMARY KEY (item_id,step_no))";

        tables.add(monitor_cautions);
        String monitor_suites = "CREATE TABLE monitor_suites (" +
                "id raw(16) NOT NULL PRIMARY KEY," +
                "name varchar(30) DEFAULT NULL," +
                "metered int(1) DEFAULT NULL," +
                "seq_no int(5) DEFAULT NULL, " +
                "comment varchar(200) DEFAULT NULL," +
                "div_parts varchar(90) DEFAULT NULL," +
                "div_times varchar(90) DEFAULT NULL," +
                "div_status varchar(90) DEFAULT NULL)";
        tables.add(monitor_suites);
        String monitor_suite_items = "CREATE TABLE monitor_suite_items (" +
                "suite_id char(32) NOT NULL," +
                "item_id char(32) NOT NULL," +
                "seq_no int(2) DEFAULT NULL," +
                "PRIMARY KEY (suite_id,item_id))";
        tables.add(monitor_suite_items);
        String rsdt_monitor_list = "CREATE TABLE rsdt_monitor_list (" +
                "id char(32) NOT NULL PRIMARY KEY," +
                "resident_id char(32) DEFAULT NULL," +
                "suite_id char(32) DEFAULT NULL," +
                "accept_time datetime DEFAULT NULL," +
                "method int(1) DEFAULT NULL," +
                "meter_code varchar(3) DEFAULT NULL," +
                "staff_id char(32) DEFAULT NULL," +
                "reporter varchar(30) DEFAULT NULL," +
                "sel_part varchar(30) DEFAULT NULL," +
                "sel_time varchar(30) DEFAULT NULL," +
                "sel_status varchar(30) DEFAULT NULL," +
                "delete_time datetime DEFAULT NULL," +
                "task_id char(32) DEFAULT NULL," +
                "upload_time datetime DEFAULT NULL)";
        tables.add(rsdt_monitor_list);
        String rsdt_monitor_detail = "CREATE TABLE rsdt_monitor_detail (" +
                "id char(32) NOT NULL PRIMARY KEY," +
                "monitor_id char(32) DEFAULT NULL," +
                "item_id char(32) DEFAULT NULL," +
                "item_name varchar(30) DEFAULT NULL," +
                "item_type int(1) DEFAULT NULL," +
                "item_unit varchar(20) DEFAULT NULL," +
                "raw_result varchar(30) DEFAULT NULL," +
                "pretreat_value float DEFAULT NULL," +
                "caution varchar(250) DEFAULT NULL," +
                "arrow int(1) DEFAULT NULL," +
                "subtitle varchar(10) DEFAULT NULL," +
                "valid_text varchar(30) DEFAULT NULL)";
        tables.add(rsdt_monitor_detail);


        //(new Date()).getTime() 时间戳
        String dictionary = "CREATE TABLE dictionary (" +
                "  table_code VARCHAR(50) NOT NULL PRIMARY KEY ," +
                "  name VARCHAR(50) NOT NULL ," +
                "  version BIGINT(13) NOT NULL ," +
                "  type INT(1) NOT NULL DEFAULT \"0\" ," +
                "  is_sync INT(1) NOT NULL DEFAULT \"1\" ," +
                "  last_edit_time TIMESTAMP(6) NOT NULL DEFAULT NULL)";
        tables.add(dictionary);


        //季节划分
        String season_divisions = "CREATE TABLE season_divisions (" +
                "  name VARCHAR(30) NOT NULL PRIMARY KEY ," +
                "  min DATE NOT NULL ," +
                "  max DATE NOT NULL)";
        tables.add(season_divisions);

        //时间划分
        String time_divisions = "CREATE TABLE time_divisions (" +
                "  name VARCHAR(30) NOT NULL PRIMARY KEY ," +
                "  min_datum int(1)," +
                "  min_offset int(5)," +
                "  max_datum int(1)," +
                "  max_offset int(5))";
        tables.add(time_divisions);

        //公民生活信息
        String public_habits = "CREATE TABLE public_habits (" +
                "  point_kind int(1) PRIMARY KEY ," +
                "  point_time time)";
        tables.add(public_habits);


        //居民生活信息
        String resident_habits = "CREATE TABLE resident_habits (" +
                "resident_id raw(16)," +
                "point_kind int(1)," +
                "point_time time," +
                "ring int(1)," +
                "PRIMARY KEY (resident_id,point_kind))";
        tables.add(resident_habits);


        //居民重点指标值
        String resident_focus_value = "CREATE TABLE resident_focus_value (" +
                "id raw(16) PRIMARY KEY," +
                "resident_id raw(16)," +
                "item_id raw(16)," +
                "subtitle varchar(10)," +
                "valid_text varchar(30)," +
                "valid_min decimal(12)," +
                "valid_max decimal(12)," +
                "aim_min decimal(12)," +
                "away_limit int(2)," +
                "trend_limit int(2)," +
                "raw_result varchar(30)," +
                "pretreat_value decimal(12)," +
                "away_arrow int(1)," +
                "away_count int(5)," +
                "trend_arrow int(1)," +
                "trend_count int(5)," +
                "last_time datetime)";
        tables.add(resident_focus_value);


        /**
         * 一下新增  2016-9-28 15:33:34
         */

        //健康测评目录
        String evaluation_list = "CREATE TABLE evaluation_list (id char(32) NOT NULL,code varchar(6) DEFAULT NULL,name varchar(60) DEFAULT NULL,abbr varchar(10) DEFAULT NULL , labels varchar(100) DEFAULT NULL , mode int(1) DEFAULT NULL , comment varchar(200) DEFAULT NULL , act_role_flag int(1) DEFAULT NULL , act_place_flag int(1) DEFAULT NULL ,doctor_ending int(1) DEFAULT NULL ,duty_grade varchar(1) DEFAULT NULL , task_type varchar(2) DEFAULT NULL , PRIMARY KEY (id))";
        tables.add(evaluation_list);

        //频率目录
        String frequency_list = "CREATE TABLE frequency_list (code varchar(3) NOT NULL,kind varchar(1) DEFAULT NULL,c_name varchar(20) DEFAULT NULL, e_name varchar(20) DEFAULT NULL, abbr varchar(10) DEFAULT NULL , freq_times int(3) DEFAULT NULL , cycle_length int(3) DEFAULT NULL , cycle_unit varchar(4) DEFAULT NULL , date_points varchar(20) DEFAULT NULL , time_points varchar(50) DEFAULT NULL , PRIMARY KEY (code))";
        tables.add(frequency_list);

        //健康指导目录
        String guidance_list = "CREATE TABLE guidance_list (id char(32) NOT NULL , code varchar(6) DEFAULT NULL , name varchar(60) DEFAULT NULL , abbr varchar(10) DEFAULT NULL , labels varchar(100) DEFAULT NULL , content varchar(800) DEFAULT NULL , duty_grade varchar(1) DEFAULT NULL , PRIMARY KEY (id))";
        tables.add(guidance_list);

        //草药给药途径
        String herb_way = "CREATE TABLE herb_way (code varchar(2) NOT NULL, name varchar(20) DEFAULT NULL, short_code varchar(10) DEFAULT NULL, fixed int(1) DEFAULT NULL, comment varchar(100) DEFAULT NULL, type_code varchar(2) DEFAULT NULL, PRIMARY KEY (code))";
        tables.add(herb_way);
        //干预操作目录
        String intervene_list = "CREATE TABLE intervene_list (id char(32) NOT NULL , code varchar(6) DEFAULT NULL , name varchar(60) DEFAULT NULL , unit varchar(20) DEFAULT NULL , abbr varchar(10) DEFAULT NULL , labels varchar(100) DEFAULT NULL , comment varchar(200) DEFAULT NULL , numerable int(1) DEFAULT NULL , act_freq_flag int(1) DEFAULT NULL , act_role_flag int(1) DEFAULT NULL , act_place_flag int(1) DEFAULT NULL , pay_class varchar(3) DEFAULT NULL, duty_grade varchar(1) DEFAULT NULL , task_type varchar(2) DEFAULT NULL , PRIMARY KEY (id))";
        tables.add(intervene_list);
        //给药途径
        String med_way = "CREATE TABLE med_way ( code varchar(3) NOT NULL, name varchar(20) DEFAULT NULL, short_code varchar(10) DEFAULT NULL, fixed int(1) DEFAULT NULL, comment varchar(100) DEFAULT NULL,type_code varchar(2) DEFAULT NULL, PRIMARY KEY (code))";
        tables.add(med_way);

        //药品目录
        String medicine_list = " CREATE TABLE medicine_list ( id char(32) NOT NULL, kind int(1) DEFAULT NULL, code varchar(10) DEFAULT NULL, name varchar(60) DEFAULT NULL, form varchar(20) DEFAULT NULL , spec varchar(40) DEFAULT NULL , producer varchar(40) DEFAULT NULL, dose_unit varchar(20) DEFAULT NULL , dose_ratio decimal(12,3) DEFAULT NULL, usage_unit varchar(20) DEFAULT NULL, pack_ratio int(10) DEFAULT NULL , dispense_unit varchar(20) DEFAULT NULL, skin_test int(1) DEFAULT NULL , allergen_code varchar(3) DEFAULT NULL , pay_class varchar(2) DEFAULT NULL , duty_grade varchar(1) DEFAULT NULL , PRIMARY KEY (id))";
        tables.add(medicine_list);

        return tables;
    }


    /**
     * 每次登陆之后获取服务器最小数据进行刷新本地数据.
     *
     * @param bd
     */
    public void updateTableData(BaseDictionaryDataResult bd) {
        long start = System.currentTimeMillis();
        if (bd != null && bd.getLists() != null && bd.getLists().size() > 0) {
            List<BaseDictionaryDataDomain> lists = bd.getLists();
            List<String> tableNames = new ArrayList<>();
            for (BaseDictionaryDataDomain bddr : lists) {
                tableNames.add(bddr.getTableCode());
            }
            cleanTableData(tableNames);//按照表名把旧数据清理掉.
            for (BaseDictionaryDataDomain bddr : lists) {
                ContentValues tableVersion = new ContentValues();
                SQLiteDatabase writableDatabase = getWritableDatabase();
                writableDatabase.beginTransaction();//开启事物
                try {
                    List<Map<String, Object>> rowData = bddr.getRowData();//一张表的所有数据!
                    for (Map<String, Object> row : rowData) {//一张表的一条数据
                        ContentValues tableData = new ContentValues();
                        for (Map.Entry<String, Object> entry : row.entrySet()) {
                            Object value = entry.getValue();
                            if (value == null || entry.getValue().toString().equals("")) {
                                tableData.put(entry.getKey(), "");
                            } else {
                                tableData.put(entry.getKey(), value.toString());
                            }
                        }
                        writableDatabase.insert(bddr.getTableCode(), null, tableData);//单条数据插入
                    }
                    tableVersion.put("version", bddr.getVersion());
                    writableDatabase.update(DictionaryDao.TABLE_NAME, tableVersion, "table_code=?", new String[]{bddr.getTableCode()});//更新字典表中的版本号.
                    writableDatabase.setTransactionSuccessful();
                } catch (SQLiteException e) {
                    e.printStackTrace();
                    L.d("更新数据失败");
                } finally {
                    writableDatabase.endTransaction();
                    writableDatabase.close();
                }
            }
        }
        long end = System.currentTimeMillis();
        L.d(this.getClass().getSimpleName() + ": updateTableData() 耗时:" + (end - start));

    }


    /**
     * 清理老数据
     *
     * @param tableNames
     */
    private void cleanTableData(List<String> tableNames) {
        SQLiteDatabase writableDatabase = getWritableDatabase();
        writableDatabase.beginTransaction();
        try {
            for (int i = 0; i < tableNames.size(); i++) {
                writableDatabase.execSQL("delete from " + tableNames.get(i));
            }
            writableDatabase.setTransactionSuccessful();
        } catch (SQLiteException e) {
            L.d("清理数据库失败");
        } finally {
            writableDatabase.endTransaction();
            writableDatabase.close();
        }
    }
}
