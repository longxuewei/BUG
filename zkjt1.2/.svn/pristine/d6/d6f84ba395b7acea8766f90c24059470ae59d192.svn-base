package com.zcareze.zkyandroidweb.bean;

import android.content.Context;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.zcareze.domain.core.dictionary.AgeDivisions;
import com.zcareze.domain.regional.RsdtMonitorDetail;
import com.zcareze.domain.regional.RsdtMonitorList;
import com.zcareze.domain.regional.dictionary.MeterConnected;
import com.zcareze.domain.regional.dictionary.MeterModes;
import com.zcareze.domain.regional.dictionary.MonitorCautions;
import com.zcareze.domain.regional.dictionary.MonitorItems;
import com.zcareze.domain.regional.dictionary.MonitorReferences;
import com.zcareze.domain.regional.dictionary.MonitorSuiteItems;
import com.zcareze.domain.regional.dictionary.MonitorSuites;
import com.zcareze.domain.regional.dictionary.PublicHabits;
import com.zcareze.domain.regional.dictionary.SeasonDivisions;
import com.zcareze.domain.regional.dictionary.TimeDivisions;
import com.zcareze.domain.regional.resident.ResidentFocusValue;
import com.zcareze.domain.regional.resident.ResidentHabits;
import com.zcareze.exception.MessageException;
import com.zcareze.interfaces.utils.MonitorProcessor;
import com.zcareze.interfaces.utils.StringUtil;
import com.zcareze.regional.service.param.RsdtMonitorDetailParam;
import com.zcareze.result.Result;
import com.zcareze.zkyandroidweb.R;
import com.zcareze.zkyandroidweb.constant.Constants;
import com.zcareze.zkyandroidweb.constant.ResidentInfo;
import com.zcareze.zkyandroidweb.db.AgeDivisionsDao;
import com.zcareze.zkyandroidweb.db.MeterConnectedDao;
import com.zcareze.zkyandroidweb.db.MeterModesDao;
import com.zcareze.zkyandroidweb.db.MonitorCautionsDao;
import com.zcareze.zkyandroidweb.db.MonitorItemsDao;
import com.zcareze.zkyandroidweb.db.MonitorReferencesDao;
import com.zcareze.zkyandroidweb.db.MonitorSuiteItemsDao;
import com.zcareze.zkyandroidweb.db.MonitorSuitesDao;
import com.zcareze.zkyandroidweb.db.PublicHabitsDao;
import com.zcareze.zkyandroidweb.db.ResidentFocusValueDao;
import com.zcareze.zkyandroidweb.db.ResidentHabitsDao;
import com.zcareze.zkyandroidweb.db.RsdtMonitorDetailDao;
import com.zcareze.zkyandroidweb.db.RsdtMonitorListDao;
import com.zcareze.zkyandroidweb.db.SeasonDivisionsDao;
import com.zcareze.zkyandroidweb.db.TimeDivisionsDao;
import com.zcareze.zkyandroidweb.proxy.ProxyFactoryManager;
import com.zcareze.zkyandroidweb.utils.JavaScriptUtil;
import com.zcareze.zkyandroidweb.utils.L;
import com.zcareze.zkyandroidweb.utils.SPUtil;
import com.zcareze.zkyandroidweb.utils.T;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import rx.Observable;
import rx.Subscriber;
import rx.android.schedulers.AndroidSchedulers;
import rx.schedulers.Schedulers;

/**
 * 居民监测数据业务服务类(安卓客户端用)
 *
 * @author chenrj by 2016年9月11日 下午4:06:10
 */
public class MonitorEngine {

    private Context context;
    private List<RsdtMonitorList> rsdtMonitorLists = new ArrayList<>();
    private List<List<RsdtMonitorDetail>> rsdtMonitorDetails = new ArrayList<>();
    private String[] parts;
    private String[] partAndTimes;
    private String defPart, defTime, defStatus; //默认部位

    public MonitorEngine(Context context) {
        this.context = context;
    }

    /**
     * 手动输入数据
     * <p>
     * 此方法废弃暂时不用.
     *
     * @param idCode
     * @param monitorData
     * @param residentId
     * @param gender
     * @param birthday
     * @return
     * @throws MessageException
     */
    public NewMonitorResult monitorProcessByManualdrive(String suiteId, Map<Integer, String> monitorData,
                                                        String residentId, Integer gender, Date birthday,
                                                        @Nullable String monitorPart, Integer dataSources)
            throws MessageException {


        // 0.参数组装
        Date acceptTime = new Date();
        //        Integer method = Constants.RsdtMonitorListEnum.METHOD_2.code();
        String caution = "";
        L.i("测量额数据Data: " + monitorData.toString());
        Map<String, String> specialMap = getMonitorItemSpecialValue(residentId);

        //3. 初始化调用获得监测参考值 (SDK接口)
        MonitorProcessor monitorProcessor = initMonitorProcessor();

        String divisionsTime = monitorProcessor.getDivisionsTime();

        NewMonitorResult newMonitorResult = new NewMonitorResult();


        /**
         * 用suiteId  获取 仪器运行模式
         */

        MeterModesDao meterModesDao = MeterModesDao.getInstance(context);
        Map<String, String> params = new HashMap<>();
        params.put("suite_id", suiteId);
        List<MeterModes> suiteIds = meterModesDao.queryByParams(params);

        /*去除重复元素,蓝牙设备,和zigbee检测执行组重复,只留一个,目前只能检测一组.*/
        if (suiteIds == null) {
            MeterModes meterModes = new MeterModes();
            meterModes.setSuiteId(suiteId);
            suiteIds = new ArrayList<>();
            suiteIds.add(meterModes);
        } else if (suiteIds.size() > 1) {
            MeterModes meterModes = suiteIds.get(0);
            suiteIds.clear();
            suiteIds.add(meterModes);
        }

        MeterModes meterMode = suiteIds.get(0);
        String meterCode = meterMode.getMeterCode();
        if (meterCode == null) {
            meterCode = "";
        }
        /**
         * 前后两次测量的 仪器不一样, 那么就要重新获取部位信息
         */
        partAndTimes = getPartAndTimes(newMonitorResult, suiteIds, divisionsTime, defPart);
        if (!TextUtils.isEmpty(monitorPart)) {
            if (!TextUtils.isEmpty(this.defPart)) {
                this.defPart = monitorPart;
            }
            if (!TextUtils.isEmpty(this.defTime)) {
                this.defTime = monitorPart;
            }
            if (!TextUtils.isEmpty(this.defStatus)) {
                this.defStatus = monitorPart;
            }
        }

        //测量的部位,状态,时间选择.
        if (partAndTimes != null && partAndTimes.length > 0) {
            newMonitorResult.setParts(partAndTimes);
        }


        List<MonitorValue> values = new ArrayList<>();
        values.clear();
        rsdtMonitorLists.clear();
        rsdtMonitorDetails.clear();

        // 4. 开始对监测数据进行处理
        for (MeterModes meterModes : suiteIds) {
            String sid = meterModes.getSuiteId();
            newMonitorResult.setSuiteId(sid);
            // 4.1 封装居民监测记录  手动输入的模式为
            RsdtMonitorList rsdtMonitor = buildRsdtMonitorList((String) SPUtil.get(context, ResidentInfo.NAME, ""), residentId, acceptTime, dataSources, meterModes);
            rsdtMonitor.setSelPart(TextUtils.isEmpty(defPart) ? null : defPart);
            rsdtMonitor.setSelTime(TextUtils.isEmpty(defTime) ? null : defTime);
            rsdtMonitor.setSelStatus(TextUtils.isEmpty(defStatus) ? null : defStatus);
            rsdtMonitorLists.add(rsdtMonitor);
            List<RsdtMonitorDetail> rsdtMonitorDetailList = new ArrayList<>();

            // 4.2 获取监测组指标列表monitor_suite_items
            List<MonitorSuiteItems> monitorSuiteItemsList = getMonitorSuiteItemsBySuiteId(sid);
            for (MonitorSuiteItems monitorSuiteItems : monitorSuiteItemsList) {
                String itemId = monitorSuiteItems.getItemId();

                /**
                 * 测量的中文名字.都包含在内.
                 */
                // 4.2.1 获取监测指标项目monitor_items
                MonitorItems monitorItems = getMonitorItemsByItemId(itemId);
                /**
                 * 根据SeqNo号查找到对应的测量值.
                 */
                String rawResult = monitorData.get(monitorSuiteItems.getSeqNo());

                /**
                 * 封装 显示的值
                 */
                // 4.2.2 获取监测参考值monitor_references
                List<MonitorReferences> monitorReferencesList = null;
                List<MonitorCautions> monitorCautionsList = null;
                Map<Integer, MonitorCautions> mapMonitorCautions = null;
                MonitorProcessor.MonitorProcessResult monitorProcessResult = null;
                if (monitorItems.getExempt() != null && monitorItems.getExempt().equals(Constants.DataBaseMain.NO)) {
                    monitorReferencesList = getMonitorReferencesListByItemIdAndMeterCode(itemId, meterCode);

                    // 4.2.3 获得监测提示语列表monitor_cautions
                    monitorCautionsList = getMonitorCautionsList(itemId);
                    mapMonitorCautions = buildMapMonitorCautions(monitorCautionsList);

                    // 4.2.4 调用(SDK接口)获得监测参考值
                    monitorProcessResult = monitorProcessor.monitorProcess(rawResult, itemId,
                            meterCode, gender, birthday, monitorReferencesList, defPart, defStatus, defTime);

                    //XXX 提示用户未在检测范围内!
                    if (monitorProcessResult == null) {
                        T.l(context, context.getString(R.string.exceed_monitor));
                        return null;
                    }
                }

                L.d("测量部位:" + (TextUtils.isEmpty(defPart) ? "空" : defPart) + "-----" + "测量状态:" + (TextUtils.isEmpty(defStatus) ? "空" : defStatus) + "-----" + "测量时间:" + (TextUtils.isEmpty(defTime) ? "空" : defTime));

                // 4.2.5 初始化话公共参数
                Map<String, String> exprConditionMap = buildPublicParamValue(specialMap, monitorProcessResult, rawResult);

                BigDecimal pretreatValue = null;
                String itemCaution = "";
                //11-收缩压没有提示语,所以不做处理
                if (monitorItems.getSpecial().equals(Constants.MonitorItemsEnum.SPECIAL_11.getCode())) {
                    specialMap.put(Constants.MonitorItemsEnum.SPECIAL_11.getCode(), rawResult);
                }
                //01-身高
                else if (monitorItems.getSpecial().equals(Constants.MonitorItemsEnum.SPECIAL_01.getCode())) {
                    specialMap.put(Constants.MonitorItemsEnum.SPECIAL_01.getCode(), rawResult);
                } else {
                    if (monitorProcessResult != null) {
                        // 4.2.6 计算预处理值
                        pretreatValue = calculateMonitorPretreatValue(monitorProcessResult, rawResult, exprConditionMap);

                        // 4.2.7 运算并获得提示语.提示语有多条.用;分开
                        if (mapMonitorCautions.size() > 0) {
                            itemCaution = getMonitorIndexCaution(monitorItems, mapMonitorCautions,
                                    monitorProcessResult, exprConditionMap);
                            caution += itemCaution + ";";
                        }
                    }
                }

                //如果有预处理值,将会重新进行计算趋势变化标识!
                getMonitorOtherValue(monitorProcessResult, pretreatValue);

                //将值保存到map里面返回给前台提示.
                if (monitorItems.getExempt() != null && monitorItems.getExempt().equals(Constants.DataBaseMain.NO)) {
                    values.add(new MonitorValue(rawResult, monitorItems.getUnit(), monitorItems.getcName(), monitorSuiteItems.getSeqNo(), monitorProcessResult.getArrow(), monitorProcessResult.getMonitorReferences().getValidText()));
                } else {
                    values.add(new MonitorValue(rawResult, monitorItems.getUnit(), monitorItems.getcName(), monitorSuiteItems.getSeqNo(), 0, ""));
                }

                // 4.2.7 封装居民监测数据
                RsdtMonitorDetail rsdtMonitorDetail = buildRsdtMonitorDetail(rawResult, rsdtMonitor, monitorItems,
                        monitorProcessResult, pretreatValue, itemCaution);
                rsdtMonitorDetailList.add(rsdtMonitorDetail);
            }
            rsdtMonitor.setDetailList(rsdtMonitorDetailList);
            newMonitorResult.setRsdtMonitorList(rsdtMonitor);
        }

        newMonitorResult.setHint(caution.substring(0, caution.length() - 1));
        newMonitorResult.setValues(values);
        setMonitorParams(defPart, defTime, defStatus, newMonitorResult);
        //只有测量的 是跟部位有关的, 才保存
        if (!TextUtils.isEmpty(defPart)) {
            SPUtil.put(context, ResidentInfo.LAST_MONITOR_PARAMS_PART, defPart);
        }
        L.i("测试点1", newMonitorResult.toString());
        return newMonitorResult;
    }

    private void getMonitorOtherValue(MonitorProcessor.MonitorProcessResult monitorResult, BigDecimal value) {
        if (value == null)
            return;
        Integer arrow = Integer.valueOf(0);
        BigDecimal validMin = monitorResult.getMonitorReferences().getValidMin();
        BigDecimal valitMax = monitorResult.getMonitorReferences().getValidMax();
        if (value.compareTo(valitMax) == 1) {
            arrow = Integer.valueOf(1);
        }

        if (value.compareTo(validMin) == -1) {
            arrow = Integer.valueOf(-1);
        }

        monitorResult.setArrow(arrow);
    }

    /**
     * 每次 测量 有一个 部位
     *
     * @param defPart
     * @param defTime
     * @param defStatus
     * @param displayValue
     */
    private void setMonitorParams(String defPart, String defTime, String defStatus, NewMonitorResult displayValue) {
        if (!TextUtils.isEmpty(defPart)) {
            displayValue.setCurrentParts(defPart);
            return;
        }
        if (!TextUtils.isEmpty(defTime)) {
            displayValue.setCurrentParts(defTime);
            return;
        }
        if (!TextUtils.isEmpty(defStatus)) {
            displayValue.setCurrentParts(defStatus);
        }
    }

    /**
     * 获得检测指标特殊性的原始值
     *
     * @param residentId 居民ID
     * @return
     */
    private Map<String, String> getMonitorItemSpecialValue(String residentId) {
        Map<String, String> specialMap = new HashMap<>();
        MonitorItemsDao dao = MonitorItemsDao.getInstance(context);
        List<MonitorItems> specialValue = dao.getSpecialValue();
        if (specialValue != null && specialValue.size() > 0) {
            ResidentFocusValueDao residentFocusValueDao = ResidentFocusValueDao.getInstance(context);
            for (MonitorItems item : specialValue) {
                String itemId = item.getId();
                ResidentFocusValue residentFocusValues = residentFocusValueDao.getConvertScore(itemId, residentId);
                if (residentFocusValues == null)
                    continue;
                String rawResult = residentFocusValues.getRawResult();
                specialMap.put(item.getSpecial(), rawResult);
            }
        }
        return specialMap;
    }

    /**
     * 运算并获得提示语
     *
     * @param //rawResult          检测值
     * @param monitorItems         检测指标实体
     * @param mapMonitorCautions   检测指标的监测提示语列表
     * @param monitorProcessResult 监测参考值
     * @param //pretreatValue      预处理值
     * @return
     * @author chenrj by 2016年9月12日 上午9:34:13
     */
    private String getMonitorIndexCaution(MonitorItems monitorItems,
                                          Map<Integer, MonitorCautions> mapMonitorCautions, MonitorProcessor.MonitorProcessResult monitorProcessResult, Map<String, String> exprConditionMap) {
        /** 提示语初始执行步骤 */
        Integer stepNo = 1;

        // 2. 执行检查器

        return checkProcess(mapMonitorCautions, stepNo, monitorItems, exprConditionMap);
    }

    /**
     * 执行检查器
     *
     * @param mapMonitorCautions 监测提示语MAP对象
     * @param stepNo             当前执行步骤
     * @param //rawResult        检测值
     * @param //monitorItems     检测指标实体`
     * @param //pretreatValue    预处理值
     * @return
     * @throws MessageException
     * @author chenrj by 2016年9月12日 上午10:25:18
     */
    private String checkProcess(Map<Integer, MonitorCautions> mapMonitorCautions, Integer stepNo,
                                MonitorItems monitorItems, Map<String, String> exprConditionMap) throws MessageException {
        String message = "";

        try {
            // 1. 根据执行步骤获取监测提示语
            MonitorCautions mc = mapMonitorCautions.get(stepNo);
            // 2. 对脚本引擎执行参数等相关初始工作
            // 2.1 替换逻辑表达式中的运算符为js运算符
            String expr = mc.getVerdict().replaceAll("and", "&&").replaceAll("or", "||");

            int i = 0;
            String exprParam = "";
            String[] exprValue = new String[exprConditionMap.size()];
            Iterator it = exprConditionMap.keySet().iterator();
            while (it.hasNext()) {
                String paramKey = it.next().toString();
                String paramVal = exprConditionMap.get(paramKey);
                exprParam += paramKey + ",";
                exprValue[i] = paramVal;

                //替换逻辑表达式中的辅助条件参数符号{}
                String param = paramKey.split("_")[1];
                expr = expr.replaceAll("\\{" + param + "\\}", paramKey);

                i++;
            }
            if (!TextUtils.isEmpty(exprParam))
                exprParam = exprParam.substring(0, exprParam.length() - 1);
            // 3. 执行脚本引擎，获取逻辑布尔返回值 .脚本引擎计算表达式的值
            Boolean result = evalExpr(expr, exprParam, exprValue);
            // true
            if (result) {
                // 如果true的下一步骤有值，则需要再递归执行
                if (mc.getTrueGoto() != null && mc.getTrueGoto() > 0) {
                    message = checkProcess(mapMonitorCautions, mc.getTrueGoto(), monitorItems, exprConditionMap);
                }
                // 下一步骤无值， 获取true的提示语
                else {
                    message = mc.getTrueWord();
                }
            }
            // false。判断下一步骤是否有值
            else {
                // 下一步骤有值，则获取false的下一步骤
                if (mc.getFalseGoto() != null && mc.getFalseGoto() > 0) {
                    message = checkProcess(mapMonitorCautions, mc.getFalseGoto(), monitorItems, exprConditionMap);
                }
            }
        } catch (Exception e) {
            throw new MessageException("执行检查器出错！监测提示语(monitor_cautions)：item_id=" + monitorItems.getId() + ";step_no="
                    + stepNo + "。原生message=" + e.getMessage());
        }

        // 4. 返回提示语
        return message;
    }

    /**
     * 执行脚本引擎，获取逻辑布尔返回值
     *
     * @param expr 逻辑表达式
     * @return
     * @author chenrj by 2016年9月12日 上午10:13:46
     */
    private Boolean evalExpr(String expr, String exprParam, String[] exprValue) {
        return JavaScriptUtil.computeBoolean(expr, exprParam, exprValue);
    }

    /**
     * 逻辑表达式公共参数组装
     *
     * @param specialMap
     * @param monitorProcessResult
     * @return
     */
    private Map<String, String> buildPublicParamValue(Map<String, String> specialMap, MonitorProcessor.MonitorProcessResult monitorProcessResult, String rawResult) {
        Map<String, String> exprConditionMap = new HashMap<>();

        //1辅助条件数据
        if (monitorProcessResult != null) {
            exprConditionMap.put("P_SEX", StringUtil.getString(monitorProcessResult.getDivSex()));
            exprConditionMap.put("P_AGE", StringUtil.getString(monitorProcessResult.getDivAge()));
            exprConditionMap.put("P_PART", StringUtil.getString(monitorProcessResult.getDivPart()));
            exprConditionMap.put("P_SEASON", StringUtil.getString(monitorProcessResult.getDivSeason()));
            exprConditionMap.put("P_TIME", StringUtil.getString(monitorProcessResult.getDivTime()));
            exprConditionMap.put("P_STATUS", StringUtil.getString(monitorProcessResult.getDivStatus()));
        }

        //2特殊条件封装
        exprConditionMap.put("P_HEIGHT", StringUtil.getString(specialMap.get(Constants.MonitorItemsEnum.SPECIAL_01.getCode())));
        exprConditionMap.put("P_WEIGHT", StringUtil.getString(specialMap.get(Constants.MonitorItemsEnum.SPECIAL_02.getCode())));

        if (specialMap.get(Constants.MonitorItemsEnum.SPECIAL_11.getCode()) != null) {
            exprConditionMap.put("P_SBP", StringUtil.getString(specialMap.get(Constants.MonitorItemsEnum.SPECIAL_11.getCode())));
        }

        //3指标监测值条件的封装
        // RAW 原始值:对脚本引擎参数赋值
        exprConditionMap.put("P_RAW", rawResult);

        return exprConditionMap;
    }

    /**
     * 计算预处理值
     *
     * @param monitorProcessResult 监测参考值
     * @return
     * @author chenrj by 2016年9月11日 下午5:12:12
     */
    private BigDecimal calculateMonitorPretreatValue(MonitorProcessor.MonitorProcessResult monitorProcessResult, String rawResult, Map<String, String> exprConditionMap) {

        if (monitorProcessResult != null && !(TextUtils.isEmpty(monitorProcessResult.getMonitorReferences().getPretreat()))) {
            String expr = monitorProcessResult.getMonitorReferences().getPretreat();

            int i = 0;
            String exprParam = "";
            String[] exprValue = new String[exprConditionMap.size()];
            Iterator it = exprConditionMap.keySet().iterator();
            while (it.hasNext()) {
                String paramKey = it.next().toString();
                String paramVal = exprConditionMap.get(paramKey);
                exprParam += paramKey + ",";
                exprValue[i] = paramVal;

                //替换逻辑表达式中的辅助条件参数符号{}
                String param = paramKey.split("_")[1];
                expr = expr.replaceAll("\\{" + param + "\\}", paramKey);

                i++;
            }
            if (!exprParam.equals("") && exprParam.lastIndexOf(",") > 0) {
                exprParam = exprParam.substring(0, exprParam.length() - 1);
            }

            // 计算
            BigDecimal v = JavaScriptUtil.computeFloat(expr, exprParam, exprValue);
            if (v != null) {
                exprConditionMap.put("P_PRE", v.toString());
            }

            return v;
        } else {
            return null;
        }
    }

    /**
     * 组装监测提示语成MAP对象。主要是便于后面执行时获取
     *
     * @param monitorCautionList 分析组监测提示语
     * @param //suiteId          检测组ID
     * @throws MessageException
     * @author chenrj by 2016年7月27日 上午12:36:08
     */
    private Map<Integer, MonitorCautions> buildMapMonitorCautions(List<MonitorCautions> monitorCautionList)
            throws MessageException {
        Map<Integer, MonitorCautions> mapMonitorCautions = new HashMap<>();
        if (monitorCautionList != null && monitorCautionList.size() > 0) {
            for (MonitorCautions mc : monitorCautionList) {
                mapMonitorCautions.put(mc.getStepNo(), mc);
            }
        }
        return mapMonitorCautions;
    }

    /**
     * 获得监测提示语列表monitor_cautions
     *
     * @param itemId 指标项目ID
     * @return
     * @author chenrj by 2016年9月12日 上午9:17:12
     */
    private List<MonitorCautions> getMonitorCautionsList(String itemId) {
        MonitorCautionsDao dao = MonitorCautionsDao.getInstance(context);
        Map<String, String> params = new HashMap<>();
        params.put("item_id", itemId);
        return dao.queryByParams(params);
    }


    /**
     * 保存居民监测数据到本地数据库
     *
     * @param 、、rsdtMonitorList       居民监测记录
     * @param 、、monitorSuiteItemsList 居民监测数据
     * @author chenrj by 2016年9月11日 下午5:28:13
     */
    public void saveRsdtMonitorData(List<RsdtMonitorList> rsdtMonitorLists, List<List<RsdtMonitorDetail>> rsdtMonitorDetails) {
        if (rsdtMonitorLists.size() <= 0)
            return;
        if (rsdtMonitorDetails.size() <= 0)
            return;

        RsdtMonitorListDao dao = RsdtMonitorListDao.getInstance(context);
        for (RsdtMonitorList rsdtMonitorList : rsdtMonitorLists) {
            dao.add(rsdtMonitorList);
        }

        RsdtMonitorDetailDao rsdtMonitorDetailDao = RsdtMonitorDetailDao.getInstance(context);
        for (List<RsdtMonitorDetail> monitorSuiteItem : rsdtMonitorDetails) {
            for (RsdtMonitorDetail monitorSuiteItems : monitorSuiteItem) {
                rsdtMonitorDetailDao.add(monitorSuiteItems);
            }
        }
        uploadRsdtMonitorData();
    }


    /**
     * 保存之后上传数据到 服务器中心.
     */
    private void uploadRsdtMonitorData() {
        if (rsdtMonitorLists.size() <= 0)
            return;
        if (rsdtMonitorDetails.size() <= 0)
            return;

        Observable.create(new Observable.OnSubscribe<Result>() {
            @Override
            public void call(Subscriber<? super Result> subscriber) {
                for (int x = 0; x < rsdtMonitorLists.size(); x++) {
                    RsdtMonitorList rsdtMonitorList = rsdtMonitorLists.get(x);
                    List<RsdtMonitorDetail> monitorSuiteItemses = rsdtMonitorDetails.get(x);
                    RsdtMonitorDetailParam param = new RsdtMonitorDetailParam();
                    param.setLists(monitorSuiteItemses);
                    try {
                        Result result = ProxyFactoryManager.getResidentHealthService().addRsdtMonitor(rsdtMonitorList, param);
                        if (result.getCode() == 1) {
                            subscriber.onNext(new Result("已上传 " + x + " 条记录!"));
                        } else {
                            subscriber.onNext(new Result("上传出错,请检查网络!"));
                            subscriber.onCompleted();
                        }
                    } catch (MessageException e) {
                        subscriber.onError(new Throwable("上传错误,请检查网络!"));
                        subscriber.onCompleted();
                    }
                    subscriber.onNext(new Result("上传完成!"));
                    subscriber.onCompleted();
                }
            }
        }).subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(new Subscriber<Result>() {
                    @Override
                    public void onCompleted() {
                        this.unsubscribe();
                    }

                    @Override
                    public void onError(Throwable e) {
                        T.l(context, e.getMessage());
                    }

                    @Override
                    public void onNext(Result result) {
                        T.s(context, result.getMessage());
                    }
                });
    }

    /**
     * 封装居民监测数据
     *
     * @param rawResult
     * @param rsdtMonitorList
     * @param //itemId
     * @param monitorItems
     * @param monitorProcessResult
     * @param pretreatValue
     * @param caution
     * @author chenrj by 2016年9月11日 下午5:19:14
     */
    private RsdtMonitorDetail buildRsdtMonitorDetail(String rawResult, RsdtMonitorList rsdtMonitorList,
                                                     MonitorItems monitorItems, MonitorProcessor.MonitorProcessResult monitorProcessResult, BigDecimal pretreatValue, String caution) {
        RsdtMonitorDetail rsdtMonitorDetail = new RsdtMonitorDetail(rsdtMonitorList.getId(), monitorItems.getId(),
                monitorItems.getcName(), monitorItems.getValueType(), monitorItems.getUnit(), rawResult, pretreatValue,
                caution, monitorProcessResult != null ? monitorProcessResult.getArrow() : 0, monitorProcessResult != null ? monitorProcessResult.getSubtitle() : "",
                monitorProcessResult != null ? monitorProcessResult.getValidText() : "");
        rsdtMonitorDetail.setId(StringUtil.getUUID());

        return rsdtMonitorDetail;
    }

    /**
     * 获取监测参考值。
     * <p/>
     * XXX 用seq_no升序返回
     *
     * @param itemId    指标项目ID
     * @param meterCode 仪器编码
     * @return
     * @author chenrj by 2016年9月11日 下午5:03:42
     */
    private List<MonitorReferences> getMonitorReferencesListByItemIdAndMeterCode(String itemId, String meterCode) {
        MonitorReferencesDao dao = MonitorReferencesDao.getInstance(context);
        return dao.queryByParamsHoist(itemId, meterCode);
    }

    /**
     * 初始化调用获得监测参考值 (SDK接口)
     * <p/>
     *
     * @author chenrj by 2016年9月11日 下午4:56:00
     */
    private MonitorProcessor initMonitorProcessor() {
        /** 年龄段。字典表实体所有数据*/
        List<AgeDivisions> ageDivisionsList = AgeDivisionsDao.getInstance(context).queryAll();

        /** 时节划分。字典表实体所有数据 */
        List<SeasonDivisions> seasonDivisionsList = SeasonDivisionsDao.getInstance(context).queryAll();

        /** 时点划分。字典表实体所有数据 */
        List<TimeDivisions> timeDivisionsList = TimeDivisionsDao.getInstance(context).queryAll();

        /** 大众生活习惯。字典表实体所有数据 */
        List<PublicHabits> publicHabitsList = PublicHabitsDao.getInstance(context).queryAll();

        /** 居民生活习惯。字典表实体所有数据 */
        List<ResidentHabits> residentHabitsList = ResidentHabitsDao.getInstance(context).queryAll();

        return new MonitorProcessor(ageDivisionsList, seasonDivisionsList, timeDivisionsList, publicHabitsList, residentHabitsList);
    }

    /**
     * 获取监测指标项目
     *
     * @param itemId 指标项目ID
     * @return
     * @author chenrj by 2016年9月11日 下午4:51:22
     */
    private MonitorItems getMonitorItemsByItemId(String itemId) {
        MonitorItemsDao dao = MonitorItemsDao.getInstance(context);
        Map<String, String> params = new HashMap<>();
        params.put("id", itemId);
        List<MonitorItems> monitorItemses = dao.queryByParams(params);

        return monitorItemses == null || monitorItemses.size() <= 0 ? null : monitorItemses.get(0);
    }

    /**
     * 获取监测组指标列表
     *
     * @param suiteId 执行组ID
     * @return
     * @author chenrj by 2016年9月11日 下午4:48:24
     */
    private List<MonitorSuiteItems> getMonitorSuiteItemsBySuiteId(String suiteId) {
        MonitorSuiteItemsDao dao = MonitorSuiteItemsDao.getInstance(context);
        Map<String, String> params = new HashMap<>();
        params.put("suite_id", suiteId);
        return dao.queryByParams(params);
    }

    /**
     * 封装居民监测记录
     *
     * @param residName
     * @param residentId
     * @param acceptTime
     * @param method
     * @param meterModes
     * @author chenrj by 2016年9月11日 下午4:41:21
     */
    private RsdtMonitorList buildRsdtMonitorList(String residName, String residentId, Date acceptTime, Integer method,
                                                 MeterModes meterModes) {
        RsdtMonitorList rsdtMonitorList = new RsdtMonitorList();
        rsdtMonitorList.setId(StringUtil.getUUID());
        rsdtMonitorList.setResidentId(residentId);
        rsdtMonitorList.setSuiteId(meterModes.getSuiteId());
        rsdtMonitorList.setAcceptTime(acceptTime);
        rsdtMonitorList.setMethod(method);
        rsdtMonitorList.setMeterCode(meterModes.getMeterCode());
        rsdtMonitorList.setReporter(residName);
        return rsdtMonitorList;
    }

    /**
     * 获取仪器运行模式列表
     *
     * @param meterCode 仪器编码
     * @return
     * @author chenrj by 2016年9月11日 下午4:25:32
     */
    private List<MeterModes> getMeterModesListByMeterCode(String meterCode) {
        MeterModesDao dao = MeterModesDao.getInstance(context);
        Map<String, String> params = new HashMap<>();
        params.put("meter_code", meterCode);
        return dao.queryByParams(params);
    }

    /**
     * 获取连接仪器数据
     *
     * @param idCode 设备识别码
     * @author chenrj by 2016年9月11日 下午4:12:23
     */
    private MeterConnected getMeterConnected(String idCode) {
        // 1. 从本地数据库获取连接仪器
        MeterConnectedDao dao = MeterConnectedDao.getInstance(context);
        Map<String, String> params = new HashMap<>();
        params.put("id_code", idCode);
        List<MeterConnected> meterConnected = dao.queryByParams(params);
        // 2. 如果没有则属于还未配对
        return meterConnected == null || meterConnected.size() == 0 ? null : meterConnected.get(0);
    }


    private String[] getPartAndTimes(NewMonitorResult newMonitorResult, List<MeterModes> idCode, String divisionsTime, @Nullable String monitorPart) {
        MonitorSuitesDao dao = MonitorSuitesDao.getInstance(context);
        for (MeterModes meterMode : idCode) {
            newMonitorResult.setTitle(meterMode.getTitle());
            MonitorSuites suites = dao.query(meterMode.getSuiteId());
            String divParts = suites.getDivParts();
            String divTimes = suites.getDivTimes();
            String divStatus = suites.getDivStatus();

            //目前 业务逻辑不可能出现 三 种选项同时出现, 所以只取第一个.  居民习惯于测试哪个部位,保存起来. 重新测量的时候,还是以最后一次测量为基准
            if (!TextUtils.isEmpty(divParts)) {
                parts = divParts.split(";");
                //如果指定了 测量部位
                if (TextUtils.isEmpty(monitorPart)) {
                    String last_part = (String) SPUtil.get(context, ResidentInfo.LAST_MONITOR_PARAMS_PART, "");
                    if (TextUtils.isEmpty(last_part)) {
                        defPart = parts[0];
                    } else {
                        defPart = last_part;
                    }
                } else {
                    defPart = monitorPart;
                }
                return parts;
            }

            if (!TextUtils.isEmpty(divTimes)) {
                String[] times = divTimes.split(";");
                defTime = divisionsTime;
                return times;
            }

            if (!TextUtils.isEmpty(divStatus)) {
                String[] status = divStatus.split(";");
                defStatus = status[0];
                return status;
            }
        }
        return null;
    }


//    /**
//     * 当用户重新 选择 部位,时间, 或者状态的时候重新计算
//     *
//     * @param params
//     */
//    @Deprecated
//    public void changeMonitorParams(DisplayValue value, String params) {
//        if (!TextUtils.isEmpty(defPart)) {
//            defPart = params;
//            monitorProcessByManualdrive(value.getSuiteId(), value.getMonitorData(), value.getResidentId(), value.getGender(), value.getBirthday());
//            return;
//        }
//        if (!TextUtils.isEmpty(defTime)) {
//            defTime = params;
//            monitorProcessByManualdrive(value.getSuiteId(), value.getMonitorData(), value.getResidentId(), value.getGender(), value.getBirthday());
//            return;
//        }
//        if (!TextUtils.isEmpty(defStatus)) {
//            defStatus = params;
//            monitorProcessByManualdrive(value.getSuiteId(), value.getMonitorData(), value.getResidentId(), value.getGender(), value.getBirthday());
//        }
//    }


}
