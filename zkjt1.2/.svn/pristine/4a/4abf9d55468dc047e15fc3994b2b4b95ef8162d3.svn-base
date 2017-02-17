package com.zcareze.zkyandroidweb.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.database.sqlite.SQLiteOpenHelper;


import com.zcareze.zkyandroidweb.utils.L;

import java.util.ArrayList;
import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 09 月 27 日 19 : 33
 * <p>
 * 基础字典表的初始化与插入数据
 */

public class BaseDictionaryDataHelper extends SQLiteOpenHelper {

    private static final String TABLE_NAME = "basedictionary.db";
    private static BaseDictionaryDataHelper instance;

    private BaseDictionaryDataHelper(Context context) {
        super(context, TABLE_NAME, null, 1);
        initDataBase();

    }

    private void initDataBase() {
        SQLiteDatabase writableDatabase = this.getWritableDatabase();
        writableDatabase.close();
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        initBaseTable(db);//建表
        initBaseData(db);
    }

    /**
     * 插入初始数据
     *
     * @param db
     */
    private void initBaseData(SQLiteDatabase db) {
        List<String> defTableData = getDefTableData();
        db.beginTransaction();
        try {
            for (String data : defTableData) {
                db.execSQL(data);
            }
            db.setTransactionSuccessful();
        } catch (SQLiteException e) {
            L.d(this.getClass().getSimpleName() + ": initBaseData 插入数据失败,回滚!");
        } finally {
            db.endTransaction();
        }
    }

    /**
     * 创建基础字典表
     *
     * @param db
     */
    private void initBaseTable(SQLiteDatabase db) {
        List<String> createTableCode = getCreateTableCode();
        db.beginTransaction();
        try {
            for (String tables : createTableCode) {
                db.execSQL(tables);
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
     * 建立基础字典表:
     * 1.性别.
     * 2.民族
     * 3.学历
     * 4.职业
     * 5.婚姻状态
     * 6.亲属关系
     * 7.血型
     * 8.RH血型
     * 9.支付模式
     * 10.过敏源
     * 11.既往史分类
     * 12.暴露史分类
     * 13.既往疾史项
     * 14.家族史
     * 15.残疾记录项
     *
     * @return
     */
    private List<String> getCreateTableCode() {
        List<String> tables = new ArrayList<>();
        String gender = "CREATE TABLE gender(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(5) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(gender);

        String minority = "CREATE TABLE minority(" +
                "code varchar(2) NOT NULL PRIMARY KEY," +
                "name varchar(20) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(minority);


        String education = "CREATE TABLE education(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(20) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(education);


        String occupation = "CREATE TABLE occupation(" +
                "code varchar(3) NOT NULL PRIMARY KEY," +
                "name varchar(20) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(occupation);

        String marital_status = "CREATE TABLE marital_status(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(5) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(marital_status);


        String relationship = "CREATE TABLE relationship(" +
                "code varchar(2) NOT NULL PRIMARY KEY," +
                "name varchar(30) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(relationship);

        String abo_blood = "CREATE TABLE abo_blood(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(50) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(abo_blood);

        String rh_blood = "CREATE TABLE rh_blood(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(5) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(rh_blood);

        String pay_mode = "CREATE TABLE pay_mode(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(20) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "adscript char(1) DEFAULT NULL)";

        tables.add(pay_mode);


        String allergen = "CREATE TABLE allergen(" +
                "code varchar(3) NOT NULL PRIMARY KEY," +
                "name varchar(30) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "adscript char(1) DEFAULT NULL," +
                "drug varchar(1) DEFAULT NULL)";
        tables.add(allergen);

        String pmh_kind = "CREATE TABLE pmh_kind(" +
                "code varchar(2) NOT NULL PRIMARY KEY," +
                "name varchar(30) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL)";
        tables.add(pmh_kind);


        String expose_history = "CREATE TABLE expose_history(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(5) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "adscript char(1) DEFAULT NULL)";
        tables.add(expose_history);


        String disease_history = "CREATE TABLE disease_history(" +
                "code varchar(2) NOT NULL PRIMARY KEY," +
                "name varchar(30) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "adscript char(1) DEFAULT NULL)";
        tables.add(disease_history);


        String family_history = "CREATE TABLE family_history(" +
                "code varchar(2) NOT NULL PRIMARY KEY," +
                "name varchar(30) DEFAULT NULL," +
                "short_code varchar(10) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "adscript char(1) DEFAULT NULL)";
        tables.add(family_history);


        String handicap_history = "CREATE TABLE handicap_history(" +
                "code varchar(1) NOT NULL PRIMARY KEY," +
                "name varchar(10) DEFAULT NULL," +
                "short_code varchar(5) DEFAULT NULL," +
                "fixed int(1) DEFAULT NULL," +
                "comment varchar(100) DEFAULT NULL," +
                "adscript char(1) DEFAULT NULL)";
        tables.add(handicap_history);


        return tables;
    }


    /**
     * 初始化 基础字典表的 数据
     */


    /**
     * 获取插入语句
     *
     * @return
     */
    private List<String> getDefTableData() {

        List<String> defDatas = new ArrayList<>();
        //性别
        String gender = "insert into gender('code','name','short_code','fixed','comment') " +
                "VALUES ('0', '未知', 'WZ', '0', '')," +
                "('1', '男', 'N', '0', '')," +
                "('2', '女', 'N', '0', '')," +
                "('9', '未说明', 'WSM', '0', '')";
        defDatas.add(gender);

        //民族
        String minority = "insert into minority('code','name','short_code','fixed','comment') " +
                "VALUES ('01', '汉族', 'HZ', '0', '')," +
                " ('02', '蒙古族', 'MGZ', '0', '')," +
                " ('03', '回族', 'HZ', '0', '')," +
                " ('04', '藏族', 'CZ', '0', '')," +
                " ('05', '维吾尔族', 'WWEZ', '0', '')," +
                " ('06', '苗族', 'MZ', '0', '')," +
                " ('07', '彝族', 'YZ', '0', '')," +
                " ('08', '壮族', 'ZZ', '0', '')," +
                " ('09', '布依族', 'BYZ', '0', '')," +
                " ('10', '朝鲜族', 'CXZ', '0', '')," +
                " ('11', '满族', 'MZ', '0', '')," +
                " ('12', '侗族', 'DZ', '0', '')," +
                " ('13', '瑶族', 'YZ', '0', '')," +
                " ('14', '白族', 'BZ', '0', '')," +
                " ('15', '土家族', 'TJZ', '0', '')," +
                " ('16', '哈尼族', 'HNZ', '0', '')," +
                " ('17', '哈萨克族', 'HSKZ', '0', '')," +
                " ('18', '傣族', 'DZ', '0', '')," +
                " ('19', '黎族', 'LZ', '0', '')," +
                " ('20', '傈僳族', 'LSZ', '0', '')," +
                " ('21', '佤族', 'WZ', '0', '')," +
                " ('22', '畲族', 'SZ', '0', '')," +
                " ('23', '高山族', 'GSZ', '0', '')," +
                " ('24', '拉祜族', 'LHZ', '0', '')," +
                " ('25', '水族', 'SZ', '0', '')," +
                " ('26', '东乡族', 'DXZ', '0', '')," +
                " ('27', '纳西族', 'NXZ', '0', '')," +
                " ('28', '景颇族', 'JPZ', '0', '')," +
                " ('29', '柯尔克孜族', 'KEKZZ', '0', '')," +
                " ('30', '土族', 'TZ', '0', '')," +
                " ('31', '达斡尔族', 'DWEZ', '0', '')," +
                " ('32', '仫佬族', 'MLZ', '0', '')," +
                " ('33', '羌族', 'QZ', '0', '')," +
                " ('34', '布朗族', 'BLZ', '0', '')," +
                " ('35', '撒拉族', 'SLZ', '0', '')," +
                " ('36', '毛难族', 'MNZ', '0', '')," +
                " ('37', '仡佬族', 'YLZ', '0', '')," +
                " ('38', '锡伯族', 'XBZ', '0', '')," +
                " ('39', '阿昌族', 'ACZ', '0', '')," +
                " ('40', '普米族', 'PMZ', '0', '')," +
                " ('41', '塔吉克族', 'TJKZ', '0', '')," +
                " ('42', '怒族', 'NZ', '0', '')," +
                " ('43', '乌孜别克族', 'WZBKZ', '0', '')," +
                " ('44', '俄罗斯族', 'ELSZ', '0', '')," +
                " ('45', '鄂温克族', 'EWKZ', '0', '')," +
                " ('46', '德昂族', 'DAZ', '0', '')," +
                " ('47', '保安族', 'BAZ', '0', '')," +
                " ('48', '裕固族', 'YGZ', '0', '')," +
                " ('49', '京族', 'JZ', '0', '')," +
                " ('50', '塔塔尔族', 'TTEZ', '0', '')," +
                " ('51', '独龙族', 'DLZ', '0', '')," +
                " ('52', '鄂伦春族', 'ELCZ', '0', '')," +
                " ('53', '赫哲族', 'HZZ', '0', '')," +
                " ('54', '门巴族', 'MBZ', '0', '')," +
                " ('55', '珞巴族', 'LBZ', '0', '')," +
                " ('56', '基诺族', 'JNZ', '0', '')";
        defDatas.add(minority);
        //学历
        String education = "insert into education('code','name','short_code','fixed','comment') " +
                "VALUES ('1', '文盲及半文盲', 'WMJBWM', '0', '')," +
                " ('2', '小学', 'XX', '0', '')," +
                " ('3', '初中', 'CZ', '0', '')," +
                " ('4', '高中/技校/中专', 'GZJXZZ', '0', '')," +
                " ('5', '大学专科及以上', 'DDXZKJYS', '0', '')," +
                " ('6', '不详', 'BX', '0', '')";
        defDatas.add(education);

        String occupation = "insert into occupation('code','name','short_code','fixed','comment') " +
                "VALUES ('0', '国家机关、党群组织、企业、事业单位负责人', 'GJJGDQZZQY', '0', '')," +
                "  ('1', '专业技术人员', 'ZYJSRY', '0', '')," +
                "  ('11', '国家公务员', 'GJGWY', '0', '')," +
                "  ('17', '职员', 'ZY', '0', '')," +
                "  ('21', '企业管理人员', 'QYGLRY', '0', '')," +
                "  ('24', '工人', 'GR', '0', '')," +
                "  ('27', '农民', 'NM', '0', '')," +
                "  ('3', '办事人员和有关人员', 'BSRYHYGRY', '0', '')," +
                "  ('31', '学生', 'XS', '0', '')," +
                "  ('37', '现役军人', 'XYJR', '0', '')," +
                "  ('4', '商业、服务业人员', 'SYFWYRY', '0', '')," +
                "  ('5', '农、林、牧、渔、水利业生产人员', 'NLMYSLYSCR', '0', '')," +
                "  ('51', '自由职业者', 'ZYZYZ', '0', '')," +
                "  ('54', '个人经营者', 'GRJYZ', '0', '')," +
                "  ('6', '生产、运输设备操作人员及有关人员', 'SCYSSBCZRY', '0', '')," +
                "  ('70', '无业人员', 'WYRY', '0', '')," +
                "  ('80', '退(离)休人员', 'TLXRY', '0', '')," +
                "  ('90', '其他', 'QT', '0', '')," +
                "  ('X', '军人', 'JR', '0', '')," +
                "  ('Y', '不便分类的其他从业人员', 'BBFLDQTCYR', '0', '')";

        defDatas.add(occupation);
        //婚姻状况
        String marital_status = "insert into marital_status('code','name','short_code','fixed','comment') " +
                "VALUES ('1', '未婚', 'WH', '0', '')," +
                "  ('2', '已婚', 'YH', '0', '')," +
                "  ('3', '丧偶', 'SO', '0', '')," +
                "  ('4', '离婚', 'LH', '0', '')," +
                "  ('9', '其他', 'QT', '0', '')";

        defDatas.add(marital_status);
        //社会关系
        String relationship = "insert into relationship('code','name','short_code','fixed','comment') " +
                "VALUES ('0', '本人或户主', 'BRHFZ', '0', '')," +
                "  ('1', '配偶', 'BO', '0', '')," +
                "  ('2', '子', 'Z', '0', '')," +
                "  ('22', '女婿', 'NX', '0', '')," +
                "  ('3', '女', 'Y', '0', '')," +
                "  ('32', '儿媳', 'EX', '0', '')," +
                "  ('4', '孙子、孙女或外孙子、外孙女', 'SZSYQSZ', '0', '')," +
                "  ('5', '父母', 'FM', '0', '')," +
                "  ('6', '祖父母或外祖父母', 'ZFM', '0', '')," +
                "  ('7', '兄、弟、姊、妹', 'XDZM', '0', '')," +
                "  ('8', '其他', 'QT', '0', '')";
        defDatas.add(relationship);

        //普通abo血型
        String abo_blood = "insert into abo_blood('code','name','short_code','fixed','comment') " +
                "VALUES ('1', 'A型', 'A', '0', '')," +
                "  ('2', 'B型', 'B', '0', '')," +
                "  ('3', 'AB型', 'AB', '0', '')," +
                "  ('4', 'O型', 'O', '0', '')," +
                "  ('5', '不详', 'BX', '0', '')";
        defDatas.add(abo_blood);

        //熊猫血
        String rh_blood = "insert into rh_blood('code','name','short_code','fixed','comment') " +
                "VALUES ('0', 'Rh阳性', '+', '0', '')," +
                "  ('1', 'Rh阴性', '-', '0', '')," +
                "  ('2', '不详', '', '0', '')";
        defDatas.add(rh_blood);
        //支付方式------------
        String pay_mode = "insert into pay_mode('code','name','short_code','fixed','comment','adscript') " +
                "VALUES ('1', '城镇职业基本医疗保险', 'CZZYJBYLBX', '0', '', null)," +
                "  ('2', '城镇居民基本医疗保险', 'CZJMJBYLBX', '0', '', null)," +
                "  ('3', '新型农村合作医疗保险', 'XXLCHZYLBX', '0', '', null)," +
                "  ('4', '贫困求助', 'PKQZ', '0', '', null)," +
                "  ('5', '商业医疗保险', 'SYYLBX', '0', '', null)," +
                "  ('6', '全公费', 'QGF', '0', '', null)," +
                "  ('7', '全自费', 'QZF', '0', '', null)," +
                "  ('8', '其他', 'QT', '0', '', null)";

        defDatas.add(pay_mode);
        //过敏源-----------------------------------
        String allergen = "insert into allergen('code','name','short_code','fixed','comment','adscript','drug') " +
                "VALUES ('01', '镇静麻醉剂过敏', 'ZJMZJGM', '0', '', null, '1')," +
                "  ('02', '动物毛发过敏', 'DWMFGM', '0', '', null, '0')," +
                "  ('03', '抗生素过敏', 'KSSGM', '0', '', null, '1')," +
                "  ('031', '青霉素过敏', 'QMSGM', '0', '', null, '1')," +
                "  ('032', '链霉素过敏', 'LMSGM', '0', '', null, '1')," +
                "  ('033', '磺胺过敏', 'HAGM', '0', '', null, '1')," +
                "  ('04', '柑橘类水果过敏', 'GJLSGGM', '0', '', null, '0')," +
                "  ('05', '室内灰尘过敏', 'SNHCGM', '0', '', null, '0')," +
                "  ('06', '鸡蛋过敏', 'JDGM', '0', '', null, '0')," +
                "  ('07', '鱼及贝壳类食物过敏', 'YJBKLSWGM', '0', '', null, '0')," +
                "  ('08', '碘过敏', 'IGM', '0', '', null, '1')," +
                "  ('09', '牛奶过敏', 'NNGM', '0', '', null, '0')," +
                "  ('10', '带壳的果仁过敏', 'DKDGRGM', '0', '', null, '0')," +
                "  ('11', '花粉过敏', 'HFGM', '0', '', null, '0')," +
                "  ('99', '其他过敏', 'QTGM', '0', '', null, '0')";
        defDatas.add(allergen);
        //既往史分类
        String pmh_kind = "insert into pmh_kind('code','name','short_code','fixed','comment') " +
                "VALUES ('1', '疾病', 'JB', '0', '')," +
                "  ('2', '手术', 'SS', '0', '')," +
                "  ('3', '输血', 'SX', '0', '')," +
                "  ('4', '家族', 'JZ', '0', '')," +
                "  ('5', '残疾', 'CJ', '0', '')," +
                "  ('6', '暴露史', 'BLS', '0', '')";
        defDatas.add(pmh_kind);

        //暴露史分类
        String expose_history = "insert into expose_history('code','name','short_code','fixed','comment','adscript') " +
                "VALUES ('1', '化学品', 'HXP', '0', '', '')," +
                "  ('2', '毒物', 'DW', '0', '', '')," +
                "  ('3', '射线', 'SX', '0', '', '')";
        defDatas.add(expose_history);

        String disease_history = "insert into disease_history('code','name','short_code','fixed','comment','adscript') " +
                "VALUES ('01', '高血压', 'GXY', '0', '', '0')," +
                "  ('02', '糖尿病', 'TLB', '0', '', '0')," +
                "  ('03', '冠心病', 'GXB', '0', '', '0')," +
                "  ('04', '慢性阻塞性肺疾病', 'MXZSXGJB', '0', '', '0')," +
                "  ('05', '恶性肿瘤', 'EXZL', '0', '', '1')," +
                "  ('06', '脑卒中', 'NZZ', '0', '', '0')," +
                "  ('07', '重性精神疾病', 'ZXJSB', '0', '', '0')," +
                "  ('08', '结核病', 'JHB', '0', '', '0')," +
                "  ('09', '肝炎', 'GY', '0', '', '0')," +
                "  ('10', '其他法定传染病', 'QTFDCRB', '0', '', '0')," +
                "  ('11', '职业病', 'ZYB', '0', '', '1')," +
                "  ('13', '其他', 'QT', '0', '', '1')";

        defDatas.add(disease_history);
        //家族史
        String family_history = "insert into family_history('code','name','short_code','fixed','comment','adscript') " +
                "VALUES ('01', '高血压', 'GXY', '0', '', '0')," +
                "  ('02', '糖尿病', 'TLB', '0', '', '0')," +
                "  ('03', '冠心病', 'GXB', '0', '', '0')," +
                "  ('04', '慢性阻塞性肺疾病', 'MXZSXFJB', '0', '', '0')," +
                "  ('05', '恶性肿瘤', 'EXZL', '0', '', '1')," +
                "  ('06', '脑卒中', 'NZZ', '0', '', '0')," +
                "  ('07', '重性精神疾病', 'ZXJSJB', '0', '', '0')," +
                "  ('08', '结核病', 'JFB', '0', '', '0')," +
                "  ('09', '肝炎', 'GY', '0', '', '0')," +
                "  ('10', '其他法定传染病', 'QTFDCRB', '0', '', '0')," +
                "  ('11', '职业病', 'ZYB', '0', '', '1')," +
                "  ('12', '其他', 'QT', '0', '', '1')";

        defDatas.add(family_history);
        //残疾记录项
        String handicap_history = "insert into handicap_history('code','name','short_code','fixed','comment','adscript') " +
                "VALUES ('1', '视力残疾', 'SLCJ', '0', '', '0')," +
                "  ('2', '听力残疾', 'TLCJ', '0', '', '0')," +
                "  ('3', '言语残疾', 'YYCJ', '0', '', '0')," +
                "  ('4', '肢体残疾', 'ZTCJ', '0', '', '0')," +
                "  ('5', '智力残疾', 'ZLCJ', '0', '', '0')," +
                "  ('6', '精神残疾', 'JCCJ', '0', '', '0')," +
                "  ('7', '其他残疾', 'QTCJ', '0', '', '1')";
        defDatas.add(handicap_history);


        return defDatas;
    }


    public static BaseDictionaryDataHelper getInstance(Context context) {
        L.d("数据库开始初始化数据");
        if (instance == null) {
            synchronized (BaseDictionaryDataHelper.class) {
                if (instance == null) {
                    instance = new BaseDictionaryDataHelper(context);
                }
            }
        }
        return instance;
    }

}
