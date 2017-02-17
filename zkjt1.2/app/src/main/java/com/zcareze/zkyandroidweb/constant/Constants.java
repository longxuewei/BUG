package com.zcareze.zkyandroidweb.constant;


import java.util.ArrayList;
import java.util.List;

public class Constants {

    /**
     * 版本升级常量
     *
     * @author chenrj by 2016年6月27日 下午4:14:36
     */
    public static class ClientVersion {
        // 升级状态 0：没有更新，1：有更新，2：强制更新,
        /**
         * ：没有更新
         */
        public static final int STATUS_0 = 0;
        /**
         * 有更新
         */
        public static final int STATUS_1 = 1;
        /**
         * 强制更新
         */
        public static final int STATUS_2 = 2;

    }

    /**
     * @Filename DataBaseMain.java
     * @Description 此常量用于定义所有数据库基本常量
     * @Version 1.0
     * @Author zjh
     * @Email zhao1426845646@gmail.com
     * @History <li>Author: zhaojinghao</li>
     * <li>Date: 2016年8月3日</li>
     * <li>Version: 1.0</li>
     * <li>Content: create</li>
     */
    public static class DataBaseMain {
        /**
         * 性别男 => 1
         */
        public static final Integer SEX_MAN = 1;
        /**
         * 性别女 => 2
         */
        public static final Integer SEX_WOMAN = 2;
        /**
         * 性别未知 => 0
         */
        public static final Integer SEX_UNKNOWN = 0;
        /**
         * 未说明的性别 => 9
         */
        public static final Integer SEX_NOTSAY = 9;
        /**
         * 是 => 1
         */
        public static final Integer YES = 1;
        /**
         * 否 => 0
         */
        public static final Integer NO = 0;
    }

    /**
     * 监测仪器枚举类1-Bluetooth;2-Zigbee
     *
     * @author chenrj by 2016年9月21日 下午5:43:30
     */
    public enum MeterListEnum {
        SIGNAL_KIND_1("1", "Bluetooth"),

        SIGNAL_KIND_2("2", "Zigbee");

        private String code;

        private String message;

        MeterListEnum(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() {
            return code;
        }

        public String code() {
            return getCode();
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public static MeterListEnum getByCode(String code) {
            for (MeterListEnum _enum : values()) {
                if (_enum.getCode().equals(code)) {
                    return _enum;
                }
            }
            return null;
        }

        public List<MeterListEnum> getAllEnum() {
            List<MeterListEnum> list = new ArrayList<>();
            for (MeterListEnum _enum : values()) {
                list.add(_enum);
            }
            return list;
        }

        public List<String> getAllEnumCode() {
            List<String> list = new ArrayList<>();
            for (MeterListEnum _enum : values()) {
                list.add(_enum.code());
            }
            return list;
        }
    }

    /**
     * @Filename MonitorItemsEnum.java
     * @Description 检测指标项目枚举类
     * @Version 1.0
     * @Author zjh
     * @Email zhao1426845646@gmail.com
     * @History <li>Author: zhaojinghao</li>
     * <li>Date: 2016年9月19日</li>
     * <li>Version: 1.0</li>
     * <li>Content: create</li>
     */
    public enum MonitorItemsEnum {

        /**
         * 特殊指标的直接标记:身高 => 01
         */
        SPECIAL_01("01", "身高"),

        /**
         * 特殊指标的直接标记:体重 => 02
         */
        SPECIAL_02("02", "体重"),

        /**
         * 特殊指标的直接标记:收缩压 => 11
         */
        SPECIAL_11("11", "收缩压"),

        /**
         * 特殊指标的直接标记:舒张压 => 12
         */
        SPECIAL_12("12", "舒张压"),

        /**
         * 特殊指标的直接标记:血糖 => 13
         */
        SPECIAL_13("13", "血糖");

        private String code;

        private String message;

        MonitorItemsEnum(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() {
            return code;
        }

        public String code() {
            return getCode();
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public static MonitorItemsEnum getByCode(String code) {
            for (MonitorItemsEnum _enum : values()) {
                if (_enum.getCode().equals(code)) {
                    return _enum;
                }
            }
            return null;
        }

        public List<MonitorItemsEnum> getAllEnum() {
            List<MonitorItemsEnum> list = new ArrayList<>();
            for (MonitorItemsEnum _enum : values()) {
                list.add(_enum);
            }
            return list;
        }

        public List<String> getAllEnumCode() {
            List<String> list = new ArrayList<>();
            for (MonitorItemsEnum _enum : values()) {
                list.add(_enum.code());
            }
            return list;
        }
    }

    public enum ResidentFocusItemsEnum {

        /**
         * 指标类型:定量 => 1
         */
        ITEMTYPE_1(1, "指标类型:定量"),

        /**
         * 指标类型:定性 => 2
         */
        ITEMTYPE_2(2, "指标类型:定性"),

        /**
         * 指标类型:半定量 => 3
         */
        ITEMTYPE_3(3, "指标类型:半定量"),

        /**
         * 偏离方向：正常=> 0
         */
        ARROW_0(0, "偏离方向：正常"),

        /**
         * 偏离方向：偏低 => -1
         */
        ARROW_2(-1, "偏离方向：偏低"),

        /**
         * 偏离方向：偏高 => 1
         */
        ARROW_1(1, "偏离方向：偏高");

        private final Integer code;

        private final String value;

        ResidentFocusItemsEnum(Integer code, String value) {
            this.code = code;
            this.value = value;
        }

        public Integer getCode() {
            return code;
        }

        public String getValue() {
            return value;
        }

        public Integer code() {
            return getCode();
        }

        public String value() {
            return getValue();
        }

        public static ResidentFocusItemsEnum getItemtypeByCode(Integer code) {
            for (ResidentFocusItemsEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("ITEMTYPE")) {
                    return _enum;
                }
            }
            return null;
        }

        public static ResidentFocusItemsEnum getArrowByCode(Integer code) {
            for (ResidentFocusItemsEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("ARROW")) {
                    return _enum;
                }
            }
            return null;
        }

        public List<ResidentFocusItemsEnum> getAllEnum() {
            List<ResidentFocusItemsEnum> list = new ArrayList<>();
            for (ResidentFocusItemsEnum _enum : values()) {
                list.add(_enum);
            }
            return list;
        }

        public List<Integer> getAllEnumCode() {
            List<Integer> list = new ArrayList<>();
            for (ResidentFocusItemsEnum _enum : values()) {
                list.add(_enum.code());
            }
            return list;
        }
    }


    /**
     * @Filename OrderListEnum.java
     * @Description 干预指令目录枚举
     * @Version 1.0
     * @Author zjh
     * @Email zhao1426845646@gmail.com
     * @History <li>Author: zhaojinghao</li>
     * <li>Date: 2016年8月3日</li>
     * <li>Version: 1.0</li>
     * <li>Content: create</li>
     */
    public enum OrderListEnum {

        // 1-西药处方;2-中药处方;3-监测方案;4-干预处置;5-健康指导;6-语音指导;7-健康测评
        /**
         * kind种类
         */
        KIND_1(1, "西药处方"),

        KIND_2(2, "中药处方"),

        KIND_3(3, "监测方案"),

        KIND_4(4, "干预操作"),

        KIND_5(5, "健康指导"),

        KIND_6(6, "语音指导"),

        KIND_7(7, "健康测评"),

        // 用户前端显示区分
        KIND_0(0, "习惯任务"),
        // 用户前端显示区分
        KIND_F1(-1, "居民事务"),
        // 用户前端显示区分
        KIND_F2(-2, "事务通知"),

        // 0-草稿、1-需上级审核、2-审核退回、3-需安排确认、4-拒绝安排、5-需发送外部、6-已发送、7-可执行、8-执行中、9-已停止、10-已完成、11-已作废
        /**
         * status状态
         */
        STATUS_0(0, "草稿"),

        STATUS_1(1, "需上级审核"),

        STATUS_2(2, "审核退回"),

        STATUS_3(3, "需安排确认"),

        STATUS_4(4, "拒绝安排"),

        STATUS_5(5, "需发送外部"),

        STATUS_6(6, "已发送"),

        STATUS_7(7, "可执行"),

        STATUS_8(8, "执行中"),

        STATUS_9(9, "已停止"),

        STATUS_10(10, "已完成"),

        STATUS_11(11, "已作废"),

        //0-一次性,1-持续
        /**
         * 图表类型一次性
         */
        ICONTYPE_0(0, "一次性"),

        /**
         * 图表类型持续
         */
        ICONTYPE_1(1, "持续");

        private final Integer code;

        private final String value;

        private OrderListEnum(Integer code, String value) {
            this.code = code;
            this.value = value;
        }

        public Integer getCode() {
            return code;
        }

        public String getValue() {
            return value;
        }

        public Integer code() {
            return getCode();
        }

        public String value() {
            return getValue();
        }

        public static OrderListEnum getKindByCode(Integer code) {
            for (OrderListEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("KIND")) {
                    return _enum;
                }
            }
            return null;
        }

        public static OrderListEnum getStatusByCode(Integer code) {
            for (OrderListEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("STATUS")) {
                    return _enum;
                }
            }
            return null;
        }

        public static OrderListEnum getIconTypeByCode(Integer code) {
            for (OrderListEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("ICONTYPE")) {
                    return _enum;
                }
            }
            return null;
        }

        public List<OrderListEnum> getAllEnum() {
            List<OrderListEnum> list = new ArrayList<>();
            for (OrderListEnum _enum : values()) {
                list.add(_enum);
            }
            return list;
        }

        public List<Integer> getAllEnumCode() {
            List<Integer> list = new ArrayList<>();
            for (OrderListEnum _enum : values()) {
                list.add(_enum.code());
            }
            return list;
        }
    }

    /**
     * @Filename OrdInterveneEnum.java
     * @Description 指令干预操作枚举
     * @Version 1.0
     * @Author zjh
     * @Email zhao1426845646@gmail.com
     * @History <li>Author: zhaojinghao</li>
     * <li>Date: 2016年8月3日</li>
     * <li>Version: 1.0</li>
     * <li>Content: create</li>
     */
    public enum OrdInterveneEnum {

        /**
         * 执行角色标记:不跟踪 => 0
         */
        ACT_ROLE_FLAG_0(0, "不跟踪"),

        /**
         * 执行角色标记:居民 => 1
         */
        ACT_ROLE_FLAG_1(1, "居民"),

        /**
         * 执行角色标记:健康助理 => 2
         */
        ACT_ROLE_FLAG_2(2, "健康助理"),

        /**
         * 执行角色标记:家庭医生 => 3
         */
        ACT_ROLE_FLAG_3(3, "家庭医生"),

        /**
         * 执行角色标记:外部 => 4
         */
        ACT_ROLE_FLAG_4(4, "外部"),

        /**
         * 执行地点标记:无 => 0
         */
        ACT_ADDR_FLAG_0(0, "无"),

        /**
         * 执行地点标记:家庭 => 1
         */
        ACT_ADDR_FLAG_1(1, "家庭"),

        /**
         * 执行地点标记:机构 => 2
         */
        ACT_ADDR_FLAG_2(2, "机构");

        private final Integer code;

        private final String value;

        private OrdInterveneEnum(Integer code, String value) {
            this.code = code;
            this.value = value;
        }

        public Integer getCode() {
            return code;
        }

        public String getValue() {
            return value;
        }

        public Integer code() {
            return getCode();
        }

        public String value() {
            return getValue();
        }

        /**
         * 执行角色标记
         */
        public static OrdInterveneEnum getActRoleFlagByCode(Integer code) {
            for (OrdInterveneEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("ACT_ROLE_FLAG")) {
                    return _enum;
                }
            }
            return null;
        }

        /**
         * 执行地点标记
         */
        public static OrdInterveneEnum getActAddrFlagByCode(Integer code) {
            for (OrdInterveneEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("ACT_ADDR_FLAG")) {
                    return _enum;
                }
            }
            return null;
        }

        public List<OrdInterveneEnum> getAllEnum() {
            List<OrdInterveneEnum> list = new ArrayList<>();
            for (OrdInterveneEnum _enum : values()) {
                list.add(_enum);
            }
            return list;
        }

        public List<Integer> getAllEnumCode() {
            List<Integer> list = new ArrayList<>();
            for (OrdInterveneEnum _enum : values()) {
                list.add(_enum.code());
            }
            return list;
        }
    }

    /**
     * @Filename OrdTaskEnum.java
     * @Description 干预指令任务枚举
     * @Version 1.0
     * @Author zjh
     * @Email zhao1426845646@gmail.com
     * @History <li>Author: zhaojinghao</li>
     * <li>Date: 2016年8月3日</li>
     * <li>Version: 1.0</li>
     * <li>Content: create</li>
     */
    public enum OrdTaskEnum {

        /**
         * 执行角色标记:居民 => 1
         */
        ACT_ROLE_FLAG_1(1, "居民"),

        /**
         * 执行角色标记:健康助理 => 2
         */
        ACT_ROLE_FLAG_2(2, "健康助理"),

        /**
         * 执行角色标记:家庭医生 => 3
         */
        ACT_ROLE_FLAG_3(3, "家庭医生"),

        /**
         * 执行角色标记:外部 => 4
         */
        ACT_ROLE_FLAG_4(4, "外部"),

        /**
         * 执行地点标记:线上 => 1
         */
        ACT_ADDR_FLAG_1(1, "线上"),

        /**
         * 执行地点标记:家庭 => 2
         */
        ACT_ADDR_FLAG_2(2, "家庭"),

        /**
         * 执行地点标记:服务机构=> 3
         */
        ACT_ADDR_FLAG_3(3, "服务机构"),

        /**
         * 开启提醒
         */
        STOP_ALARM_START(1, "开启提醒"),

        /**
         * 停止提醒
         */
        STOP_ALARM_END(0, "停止提醒"),

        /**
         * 中药煎煮法或者其它
         */
        HERB_DECOCT_JZ_QT(1, "中药煎煮法或者其它"),

        /**
         * 中药服法
         */
        HERB_DECOCT_FF(2, "中药服法");

        private final Integer code;

        private final String value;

        private OrdTaskEnum(Integer code, String value) {
            this.code = code;
            this.value = value;
        }

        public Integer getCode() {
            return code;
        }

        public String getValue() {
            return value;
        }

        public Integer code() {
            return getCode();
        }

        public String value() {
            return getValue();
        }

        public static OrdTaskEnum getActRoleFlagByCode(String code) {
            for (OrdTaskEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("ACT_ROLE_FLAG")) {
                    return _enum;
                }
            }
            return null;
        }

        public static OrdTaskEnum getActAddrFlagByCode(String code) {
            for (OrdTaskEnum _enum : values()) {
                if (_enum.getCode().equals(code) && _enum.name().contains("ACT_ADDR_FLAG")) {
                    return _enum;
                }
            }
            return null;
        }

        public List<OrdTaskEnum> getAllEnum() {
            List<OrdTaskEnum> list = new ArrayList<>();
            for (OrdTaskEnum _enum : values()) {
                list.add(_enum);
            }
            return list;
        }

        public List<Integer> getAllEnumCode() {
            List<Integer> list = new ArrayList<>();
            for (OrdTaskEnum _enum : values()) {
                list.add(_enum.code());
            }
            return list;
        }

    }

    /**
     * 居民监测记录
     *
     * @author chenrj by 2016年10月31日 上午10:45:45
     */
    public enum RsdtMonitorListEnum {
        /**
         * 采集方式:居家终端监测
         */
        METHOD_1(1, "居家终端监测"),
        /**
         * 采集方式:居家手工监测
         */
        METHOD_2(2, "居家手工监测");
        /**
         * 采集方式:服务机构监测
         */

        private final Integer code;

        private final String value;

        private RsdtMonitorListEnum(Integer code, String value) {
            this.code = code;
            this.value = value;
        }

        public Integer getCode() {
            return code;
        }

        public String getValue() {
            return value;
        }

        public Integer code() {
            return getCode();
        }

        public String value() {
            return getValue();
        }

        public static RsdtMonitorListEnum getByCode(String code) {
            for (RsdtMonitorListEnum _enum : values()) {
                if (_enum.getCode().equals(code)) {
                    return _enum;
                }
            }
            return null;
        }

        public List<RsdtMonitorListEnum> getAllEnum() {
            List<RsdtMonitorListEnum> list = new ArrayList<RsdtMonitorListEnum>();
            for (RsdtMonitorListEnum _enum : values()) {
                list.add(_enum);
            }
            return list;
        }

        public List<Integer> getAllEnumCode() {
            List<Integer> list = new ArrayList<Integer>();
            for (RsdtMonitorListEnum _enum : values()) {
                list.add(_enum.code());
            }
            return list;
        }
    }

}
