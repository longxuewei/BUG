package com.zcareze.zkyandroidweb.presenter;

import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothProfile;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.view.KeyEvent;

import com.alibaba.fastjson.JSON;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.callback.FileCallback;
import com.tencent.bugly.crashreport.CrashReport;
import com.zcareze.core.Zcareze;
import com.zcareze.domain.regional.dictionary.MonitorSuites;
import com.zcareze.webview.Javascript;
import com.zcareze.zkyandroidweb.R;
import com.zcareze.zkyandroidweb.bean.BLEDeviceInfo;
import com.zcareze.zkyandroidweb.bean.InputModeData;
import com.zcareze.zkyandroidweb.bean.MainDeviceItem;
import com.zcareze.zkyandroidweb.bean.MainItem;
import com.zcareze.zkyandroidweb.bean.MeasureResult;
import com.zcareze.zkyandroidweb.bean.MonitorEngine;
import com.zcareze.zkyandroidweb.bean.MonitorValue;
import com.zcareze.zkyandroidweb.bean.NewMonitorResult;
import com.zcareze.zkyandroidweb.constant.AccountListInfo;
import com.zcareze.zkyandroidweb.constant.Constants;
import com.zcareze.zkyandroidweb.constant.ResidentInfo;
import com.zcareze.zkyandroidweb.db.MeterConnectedDao;
import com.zcareze.zkyandroidweb.db.MonitorSuitesDao;
import com.zcareze.zkyandroidweb.db.QueryServiceUtil;
import com.zcareze.zkyandroidweb.devicepulgin.BaseBlePlugin;
import com.zcareze.zkyandroidweb.devicepulgin.BlueToothHelper;
import com.zcareze.zkyandroidweb.devicepulgin.PluginManager;
import com.zcareze.zkyandroidweb.devicepulgin.ZigBeePlugin;
import com.zcareze.zkyandroidweb.proxy.ProxyFactoryManager;
import com.zcareze.zkyandroidweb.utils.ActivityManagerUtil;
import com.zcareze.zkyandroidweb.utils.BarUtil;
import com.zcareze.zkyandroidweb.utils.ConnectProcessThread;
import com.zcareze.zkyandroidweb.utils.L;
import com.zcareze.zkyandroidweb.utils.SPUtil;
import com.zcareze.zkyandroidweb.utils.TimeUtil;
import com.zcareze.zkyandroidweb.utils.UpDateUtil;
import com.zcareze.zkyandroidweb.viewinterface.LoginViewImpl;
import com.zcareze.zkyandroidweb.viewinterface.MainViewImpl;

import org.xwalk.core.JavascriptInterface;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Response;


/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 12 日 11 : 15
 * MainActivity的逻辑层
 */

public class MainPresenter implements Javascript/*, SpeechSynthesizerListener*/ {
    private static MainPresenter instance;
    private MainViewImpl mainViewImpl;
    private final Object statusLock = new Object();
    private ProgressDialog dialog;
    private static final String PROTECT_PROCESS_NAME = "cn.lxw.protectprocess";
    private String ttsTempDir;
//    private SpeechSynthesizer mSpeechSynthesizer;

    private MainPresenter(MainViewImpl mainViewImpl) {
        this.mainViewImpl = mainViewImpl;
    }

    public static MainPresenter getInstance(MainViewImpl mainViewImpl) {
        if (instance == null) {
            synchronized (LoginPresenter.class) {
                if (instance == null) {
                    instance = new MainPresenter(mainViewImpl);
                }
            }
        }
        return instance;
    }

    /**
     * 利用新的规则引擎. 算出结果
     * ZigBeePlugin---->MainActivity--->this.
     * 将数据传到该方法进行规则引擎的处理.算出提示语.
     *
     * @return
     */
    public NewMonitorResult monitorData(Context context,
                                        String macAddress,
                                        Map<Integer, String> monitorValue,
                                        @Nullable String monitorPart,
                                        String suiteId,
                                        Integer dataSources) {
        MonitorEngine service = new MonitorEngine(context);
        String residentId = (String) SPUtil.get(context, ResidentInfo.ID, "");
        String gender = (String) SPUtil.get(context, ResidentInfo.GENDER, "1");
        Date date = TimeUtil.paresDateByStr((String) SPUtil.get(context, ResidentInfo.BIRTHDAY, ""));
        NewMonitorResult monitorResult = service.monitorProcessByManualdrive(suiteId, monitorValue, residentId,
                Integer.parseInt(gender), date, monitorPart, dataSources);
        if (monitorResult != null) {
            //去除";"分号
            if (monitorResult.getHint().contains(";"))
                monitorResult.setHint(monitorResult.getHint().replace(";", ""));
            String hint = monitorResult.getHint();
            if (!TextUtils.isEmpty(hint) && !hint.endsWith("。"))
                monitorResult.setHint(monitorResult.getHint() + "。");
            monitorResult.setDeviceMac(macAddress);//加上mac地址,方便切换部位.
        } else {
            return null;
        }
        return monitorResult;
    }


    /**
     * 部位被改变,重新计算!
     * 切换部位要看是手动输入的数据, 还是自动输入的数据.
     * 他们之间区别在于有没有MeasureResult
     *
     * @param oldMonitorData
     * @return
     */
    @JavascriptInterface
    public String onPartChanged(String oldMonitorData) {
        if (TextUtils.isEmpty(oldMonitorData))
            return null;
        NewMonitorResult oldResult = JSON.parseObject(oldMonitorData, NewMonitorResult.class);
        //取出来封装成Map参数.
        List<MonitorValue> values = oldResult.getValues();
        Map<Integer, String> params = new HashMap<>();
        for (MonitorValue value : values) {
            params.put(value.getSeqNo(), value.getValue());
        }
        NewMonitorResult newResult;
        Integer datasource = Constants.RsdtMonitorListEnum.METHOD_1.code();
        //手动
        if (TextUtils.isEmpty(oldResult.getDeviceMac())) {//如果没有设备的mac说明是手动输入的
            datasource = Constants.RsdtMonitorListEnum.METHOD_2.code();
            //自动
        }
        newResult = monitorData(mainViewImpl.getContext(),
                oldResult.getDeviceMac(), params, oldResult.getCurrentParts(), oldResult.getSuiteId(),
                datasource);

        //前台将测量的设备数据修改了,导致不能重新计算;测量设备 不能识别, 或未绑定.
        if (newResult == null)
            return null;
        Map<String, Object> viewParams = new HashMap<>();
        viewParams.put("data", newResult);
        L.d("改变部位:" + JSON.toJSONString(viewParams));
        return JSON.toJSONString(viewParams);
    }

    @JavascriptInterface
    public String getDeviceInfo() {
        //一个仪器有多重运行模式,取交集!
        List<MonitorSuites> monitorSuites = MonitorSuitesDao.getInstance(mainViewImpl.getContext()).queryAll();
        if (monitorSuites != null) {

            //数据库中查询到的已绑定的蓝牙设备(4.0).
            List<MainDeviceItem> items = new ArrayList<>();
            for (MonitorSuites mainDeviceItem : monitorSuites) {
                int check = MeterConnectedDao.getInstance(mainViewImpl.getContext()).check(mainDeviceItem.getId());
                MainDeviceItem deviceItem = new MainDeviceItem(check, mainDeviceItem.getName(), mainDeviceItem.getId());
                items.add(deviceItem);
            }

            //通过查询外部的已配对的蓝牙设备(针对三合一血糖仪2.0蓝牙).
            BluetoothDevice device = BlueToothHelper.getDevice();
            if (device != null) {
                String niaoSuanSuiteId = mainViewImpl.getContext().getResources().getString(R.string.BeneCheck_NiaoSuan_SuiteID);
                String xueTangSuiteId = mainViewImpl.getContext().getResources().getString(R.string.BeneCheck_XueTang_SuiteID);
                String danGuChunSuiteId = mainViewImpl.getContext().getResources().getString(R.string.BeneCheck_DanGuChun_SuiteID);
                if (items.size() > 0) {
                    for (Iterator<MainDeviceItem> iterator = items.iterator(); iterator.hasNext(); ) {
                        MainDeviceItem next = iterator.next();
                        if (next.getSuiteId().equals(niaoSuanSuiteId) || next.getSuiteId().equals(xueTangSuiteId) || next.getSuiteId().equals(danGuChunSuiteId)) {
                            iterator.remove();
                        }
                    }
                }
                items.add(new MainDeviceItem(1, "尿酸", niaoSuanSuiteId));
                items.add(new MainDeviceItem(1, "总胆固醇", danGuChunSuiteId));
                items.add(new MainDeviceItem(1, "血糖", xueTangSuiteId));
            }

            MainItem item = new MainItem(items,
                    SPUtil.getUserInfo(mainViewImpl.getContext()),
                    (String) SPUtil.get(mainViewImpl.getContext(),
                            ResidentInfo.COOKVALUE, ""),
                    ProxyFactoryManager.URL, ProxyFactoryManager.API_VERSION, SPUtil.getAccountInfo(mainViewImpl.getContext()), (String) SPUtil.get(mainViewImpl.getContext(), AccountListInfo.CLOUDID, ""));
            return JSON.toJSONString(item);
        } else {
            CrashReport.postCatchedException(new Throwable("MonitorMode表中无数据"));
            return null;
        }
    }


    /**
     * 处理手工录入测量数据后计算提示语返回给前台
     *
     * @param json
     * @return
     */
    @JavascriptInterface
    public String inputMonitorData(String json) {
        if (TextUtils.isEmpty(json)) {
            return null;
        }
        NewMonitorResult oldResult = parseInputData(JSON.parseObject(json, InputModeData.class));

        if (oldResult != null) {
            String suiteID = oldResult.getSuiteId();
            if (!TextUtils.isEmpty(suiteID)) {
                Map<Integer, String> map = new HashMap<>();
                for (MonitorValue value : oldResult.getValues()) {
                    map.put(value.getSeqNo(), value.getValue());
                }
                MonitorEngine engine = new MonitorEngine(mainViewImpl.getContext());
                String residentId = (String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.ID, "");
                String gender = (String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.GENDER, "1");
                Date date = TimeUtil.paresDateByStr((String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.BIRTHDAY, ""));
                NewMonitorResult monitorResult = engine.monitorProcessByManualdrive(suiteID, map, residentId,
                        Integer.parseInt(gender), date, TextUtils.isEmpty(oldResult.getCurrentParts()) ? null : oldResult.getCurrentParts(),
                        Constants.RsdtMonitorListEnum.METHOD_2.code());
                return JSON.toJSONString(monitorResult);
            } else {
                L.d("suiteID 未找到!");
                CrashReport.postCatchedException(new Throwable("suiteId未找到"));
            }
        } else {
            CrashReport.postCatchedException(new Throwable("旧数据解析失败"));
        }
        return null;
    }


    /**
     * 手动输入的数据,切换部位上传回来的数据是不同的. 要解析成相同格式!
     *
     * @param inputModeData
     * @return
     */
    private NewMonitorResult parseInputData(InputModeData inputModeData) {
        NewMonitorResult oldData = new NewMonitorResult();
//        oldData.setDeviceType(inputModeData.getDeviceType());
        oldData.setSuiteId(inputModeData.getSuiteId());
        List<MonitorValue> values = new ArrayList<>();
        for (Map.Entry<String, Double> data : inputModeData.getMonitorData().entrySet()) {
            MonitorValue value = new MonitorValue();
            value.setSeqNo(Integer.parseInt(data.getKey()));
            value.setValue(data.getValue() + "");
            values.add(value);
        }
        oldData.setValues(values);
        oldData.setCurrentParts(inputModeData.getMonitorPart());
        return oldData;
    }


    /**
     * 设备绑定,在进行规制逻辑引擎计算的时候,是查不到数据库的记录的,所以以手动模式!
     *
     * @param result
     * @return
     */
    public NewMonitorResult onAddDeviceDataReceive(MeasureResult result) {
        String suiteID = QueryServiceUtil.getInstance().querySuiteIDByDeviceType(mainViewImpl.getContext(), result.getMeasureID());
        MonitorEngine engine = new MonitorEngine(mainViewImpl.getContext());
        String residentId = (String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.ID, "");
        String gender = (String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.GENDER, "1");
        Date date = TimeUtil.paresDateByStr((String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.BIRTHDAY, ""));
        NewMonitorResult monitorResult = engine.monitorProcessByManualdrive(suiteID, result.getMeasureValue(), residentId, Integer.parseInt(gender), date, null, Constants.RsdtMonitorListEnum.METHOD_1.code());
        monitorResult.setDeviceMac(result.getMeasureCoding());
        return monitorResult;
    }


    /**
     * 所有扫描的回调
     */
    public BluetoothAdapter.LeScanCallback scanCallBack = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(BluetoothDevice device, int rssi, byte[] scanRecord) {

//            if (device == null) {    什么时候加的???
//                BlueToothHelper.scanBluetoothDevice(scanCallBack, false, true, receive);
//                return;
//            }
            L.e("蓝牙扫描回调: " + device.getAddress());
            if (BlueToothHelper.isBind) {
                Map<String, Object> devices = new HashMap<>();
                BLEDeviceInfo deviceInfo = new BLEDeviceInfo(device.getAddress(), "BLE", "1", rssi, TextUtils.isEmpty(device.getName()) ? "未知设备" : device.getName());//第三个参数是 通讯模式
                devices.put("data", deviceInfo);
                Zcareze.javascript("onBTDeviceList", devices);
            } else {
                String newDeviceAddress = device.getAddress();
                if (!TextUtils.isEmpty(newDeviceAddress)) {
                    BaseBlePlugin plugin = PluginManager.getInstance().getPlugin(newDeviceAddress);
                    synchronized (statusLock) {
                        if (plugin == null || plugin.getCurrentStatus() != BluetoothProfile.STATE_DISCONNECTED) {
                            return;
                        }
                        plugin.changeStatus(BluetoothProfile.STATE_CONNECTING);
                    }
                    L.d("扫描到,开始连接,状态:" + plugin.getCurrentStatus() + "-----" + plugin.getClass().getSimpleName());
                    new ConnectProcessThread(plugin).start();
                }
            }
        }
    };


    /**
     * 注册监听屏幕锁定的广播
     */
    public void registBroad() {
        BroadcastReceiver receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) {
                    BlueToothHelper.stopScan(MainPresenter.this.scanCallBack);
                    BlueToothHelper.screenON = false;
                } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) {
                    //监听屏幕打开,需要在主页.
                    BlueToothHelper.screenON = true;
                    if (BlueToothHelper.isMainPage) {
                        BlueToothHelper.scanBluetoothDevice(mainViewImpl.getPresenter().scanCallBack, false);
                        BlueToothHelper.scanSanHeYi();
                    }
                } else if (intent.getAction().equals(BluetoothAdapter.ACTION_STATE_CHANGED)) {//监听蓝牙开关.
                    int intExtra = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, BluetoothAdapter.ERROR);
                    switch (intExtra) {
                        case BluetoothAdapter.STATE_OFF:
                            BlueToothHelper.stopScan(MainPresenter.this.scanCallBack);
                            BlueToothHelper.isScanBluetooth20 = false;
                            BlueToothHelper.blueON = false;
                            break;
                        case BluetoothAdapter.STATE_ON:
                            BlueToothHelper.blueON = true;
                            if (BlueToothHelper.isMainPage) {
                                BlueToothHelper.scanBluetoothDevice(MainPresenter.this.scanCallBack, false);
                                BlueToothHelper.scanSanHeYi();
                            }
                            break;
                    }
                }
            }
        };
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Intent.ACTION_SCREEN_ON);
        filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);

        mainViewImpl.getContext().registerReceiver(receiver, filter);
    }


    /**
     * 前台调用该方法改变所在的页面,进行蓝牙停止
     *
     * @param status 1:主页,0非主页.
     */
    @JavascriptInterface
    public void changeCurrentPage(String status) {
        boolean result = "1".equals(status);
        BlueToothHelper.isMainPage = result;
        if (result) {
            ZigBeePlugin.isBind = false;
        }
        if (result) {
            BlueToothHelper.scanBluetoothDevice(mainViewImpl.getPresenter().scanCallBack, false);
            BlueToothHelper.scanSanHeYi();
        } else {
            BlueToothHelper.stopScan(MainPresenter.this.scanCallBack);
        }
    }


    /**
     * 注销
     */
    @JavascriptInterface
    public void logout() {
        ActivityManagerUtil.getInstance().exit(mainViewImpl.getContext());
    }


    /**
     * 切换家庭成员
     *
     * @param residentId 成员ID
     */
    @JavascriptInterface
    public void changeFamily(final String residentId) {
        LoginPresenter instance = LoginPresenter.getInstance(new LoginViewImpl() {
            @Override
            public Context getContext() {
                return mainViewImpl.getContext();
            }

            @Override
            public void showMessage(String message) {
                mainViewImpl.showMessage(message);
            }
        });
        instance.changeFamily(residentId);
    }


    /**
     * 静默登陆
     */
    @JavascriptInterface
    public void reLogin() {

        LoginPresenter instance = LoginPresenter.getInstance(new LoginViewImpl() {
            @Override
            public Context getContext() {
                return mainViewImpl.getContext();
            }

            @Override
            public void showMessage(String message) {
                mainViewImpl.showMessage(message);
            }
        });
        instance.reLogin();
    }


    /**
     * 此方法除了三合一血糖仪,没有其他的ble调用此方法.
     *
     * @param monitorData
     * @param suiteId
     */
    protected void monitor(Map<Integer, String> monitorData, String suiteId) {
        MonitorEngine engine = new MonitorEngine(mainViewImpl.getContext());
        String residentId = (String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.ID, "");
        String gender = (String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.GENDER, "1");
        Date date = TimeUtil.paresDateByStr((String) SPUtil.get(mainViewImpl.getContext(), ResidentInfo.BIRTHDAY, ""));
        NewMonitorResult monitorResult = engine.monitorProcessByManualdrive(suiteId, monitorData, residentId, Integer.parseInt(gender), date, null, Constants.RsdtMonitorListEnum.METHOD_1.code());
        if (monitorResult != null) {
            Map<String, Object> params = new HashMap<>();
            params.put("data", monitorResult);
            Zcareze.javascript("DeviceMonitor", params);
        } else {
            Zcareze.javascript("DeviceMonitor", null);
        }
    }

    @JavascriptInterface
    public void goBack() {
        try {
            Runtime runtime = Runtime.getRuntime();
            runtime.exec("input keyevent " + KeyEvent.KEYCODE_BACK);
            BarUtil.openBar();
        } catch (IOException e) {
            e.printStackTrace();
            CrashReport.postCatchedException(new Throwable("模拟按键失败!"));
        }
    }


    /**
     * 前端调用,进行下载apk 进行安装更新!
     *
     * @param url apk 下载地址
     */
    @JavascriptInterface
    public void setDownloadUrl(String url) {
        if (TextUtils.isEmpty(url))
            return;

        if (dialog == null) {
            dialog = new ProgressDialog(mainViewImpl.getContext());
            dialog.setCancelable(false);
            dialog.setCanceledOnTouchOutside(false);
            dialog.setMessage("正在下载文件...");
            dialog.setMax(100);
            dialog.setTitle("软件更新");
        }
        dialog.show();

        OkGo.get(url)//
                .tag(this)//
                .execute(new FileCallback() {  //文件下载时，可以指定下载的文件目录和文件名
                    @Override
                    public void onSuccess(File file, Call call, Response response) {
                        // file 即为文件数据，文件保存在指定目录
                        L.i("成功: ");
                        if (dialog != null && dialog.isShowing())
                            dialog.dismiss();
                        startUpdate(file);
                    }

                    @Override
                    public void downloadProgress(long currentSize, long totalSize, float progress, long networkSpeed) {
                        //这里回调下载进度(该回调在主线程,可以直接更新ui)
                        dialog.setMessage("正在下载文件......" + (int) (progress * 100) + "%");
                    }

                    @Override
                    public void onError(Call call, Response response, Exception e) {
                        super.onError(call, response, e);
                        L.i("失败: ");
                        if (dialog != null && dialog.isShowing())
                            dialog.dismiss();
                    }
                });
    }


    /**
     * 文件下载完毕开始更新
     *
     * @param file 新文件
     */
    public void startUpdate(File file) {
        UpDateUtil instance = UpDateUtil.getInstance();

        //1是否安装了守护程序
        boolean isAdded = instance.checkProtectProcess(mainViewImpl.getContext(), PROTECT_PROCESS_NAME);

        //2如果没安装,就静默安装守护程序!
        if (!isAdded) {
            File protectApk = instance.releaseProtectProcessToSdcard(mainViewImpl.getContext());
            instance.install(protectApk.getAbsolutePath());
        }

        //3启动守护程序
        instance.launcherProtectProcess(mainViewImpl.getContext(), PROTECT_PROCESS_NAME);

        //4安装下载文件
        instance.install(file.getAbsolutePath());

    }


//    /**
//     * 播放语音
//     *
//     * @param json 文字集
//     */
//    @JavascriptInterface
//    public void speak(String json) {
//        if (TextUtils.isEmpty(json))
//            return;
//        initTTS();
//        SpeakText speakText = JSON.parseObject(json, SpeakText.class);
//        if (speakText == null || speakText.getTexts().size() <= 0)
//            return;
//
//
//        List<SpeechSynthesizeBag> texts = new ArrayList<>();
//        for (String str : speakText.getTexts()) {
//            SpeechSynthesizeBag mSpeechSynthesizeBag = new SpeechSynthesizeBag();
//            mSpeechSynthesizeBag.setText(str);
//            texts.add(mSpeechSynthesizeBag);
//        }
//        if (mSpeechSynthesizer != null)
//            mSpeechSynthesizer.stop();
//        if (texts.size() <= 0)
//            return;
//        mSpeechSynthesizer.batchSpeak(texts);
//
//    }
//
//
//    /**
//     * 当 播放停止时调用.
//     */
//    @JavascriptInterface
//    public void onSpeakStop() {
//        if (mSpeechSynthesizer != null)
//            mSpeechSynthesizer.stop();
//    }
//
//
//    /**
//     * 初始化tts的临时文件以及监听回调
//     */
//    private void initTTS() {
//        initTempFile();
//
//        //将文件复制到本地SD卡
//        copyFileToSD(BaiDuTTSConstant.CN_FEMALE_FILE_NAME, BaiDuTTSConstant.CN_FEMALE_FILE_NAME);
//        copyFileToSD(BaiDuTTSConstant.CN_MALE_FILE_NAME, BaiDuTTSConstant.CN_MALE_FILE_NAME);
//        copyFileToSD(BaiDuTTSConstant.CN_TEXT_FILE_NAME, BaiDuTTSConstant.CN_TEXT_FILE_NAME);
//        copyFileToSD(BaiDuTTSConstant.EN_FEMALE_FILE_NAME, "english/" + BaiDuTTSConstant.EN_FEMALE_FILE_NAME);
//        copyFileToSD(BaiDuTTSConstant.EN_MALE_FILE_NAME, "english/" + BaiDuTTSConstant.EN_MALE_FILE_NAME);
//        copyFileToSD(BaiDuTTSConstant.EN_TEXT_FILE_NAME, "english/" + BaiDuTTSConstant.EN_TEXT_FILE_NAME);
//
//
//        //加载一次 百度语音的 初始化工作
//        if (mSpeechSynthesizer == null) {
//            mSpeechSynthesizer = SpeechSynthesizer.getInstance();
//            mSpeechSynthesizer.setContext(mainViewImpl.getContext());
//            mSpeechSynthesizer.setSpeechSynthesizerListener(this);
//            //设置离线文本模型文件.(离线)
//            mSpeechSynthesizer.setParam(SpeechSynthesizer.PARAM_TTS_TEXT_MODEL_FILE, ttsTempDir + "/" + BaiDuTTSConstant.CN_TEXT_FILE_NAME);
//            //设置声学模型文件.(离线)
//            mSpeechSynthesizer.setParam(SpeechSynthesizer.PARAM_TTS_SPEECH_MODEL_FILE, ttsTempDir + "/" + BaiDuTTSConstant.CN_FEMALE_FILE_NAME);
//
//            mSpeechSynthesizer.setAppId(BaiDuTTSConstant.APP_ID);
//            mSpeechSynthesizer.setApiKey(BaiDuTTSConstant.API_KEY, BaiDuTTSConstant.APP_SECRET_KEY);
//
//            //设置发音人 (在线) 0--普通女声，1--普通男声，2--特别男声，3--情感男声
//            mSpeechSynthesizer.setParam(SpeechSynthesizer.PARAM_SPEAKER, "0");
//
//            // 设置Mix模式的合成策略
//            mSpeechSynthesizer.setParam(SpeechSynthesizer.PARAM_MIX_MODE, SpeechSynthesizer.MIX_MODE_DEFAULT);
//
//            //检测是否申请了授权!
//            AuthInfo authInfo = this.mSpeechSynthesizer.auth(TtsMode.MIX);
//
//            if (!authInfo.isSuccess()) {
//                CrashReport.postCatchedException(new Throwable("百度语音授权失败"));
//            }
//            mSpeechSynthesizer.initTts(TtsMode.MIX);
//            //加载离线英文资源(提供离线英文合成功能);
//            int i = mSpeechSynthesizer.loadEnglishModel(ttsTempDir + "/" + BaiDuTTSConstant.EN_TEXT_FILE_NAME, ttsTempDir + "/" + BaiDuTTSConstant.EN_FEMALE_FILE_NAME);
//            L.i("加载离线英文资源结果: " + i);
//        }
//    }
//
//
//    /**
//     * 创建临时文件
//     */
//    private void initTempFile() {
//        if (TextUtils.isEmpty(ttsTempDir)) {
//            String s = Environment.getExternalStorageDirectory().toString();
//            ttsTempDir = s + "/" + "BaiDuTTS";
//        }
//        File file = new File(ttsTempDir);
//        if (!file.exists()) {
//            file.mkdirs();
//        }
//    }
//
//
//    /**
//     * 复制文字模型,声学文件到SD卡目录!
//     *
//     * @param fileName
//     * @param path
//     */
//    private void copyFileToSD(String fileName, String path) {
//        File file = new File(ttsTempDir, fileName);
//        if (!file.exists()) {
//            InputStream in = null;
//            OutputStream out = null;
//            try {
//                in = mainViewImpl.getContext().getAssets().open(path);
//                out = new FileOutputStream(file);
//                byte[] b = new byte[1024];
//                int len;
//                while ((len = in.read(b, 0, 1024)) >= 0) {
//                    out.write(b, 0, len);
//                }
//            } catch (IOException e) {
//                e.printStackTrace();
//            } finally {
//                if (in != null) {
//                    try {
//                        in.close();
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//                }
//                if (out != null) {
//                    try {
//                        out.close();
//                    } catch (IOException e) {
//                        e.printStackTrace();
//                    }
//                }
//            }
//        }
//    }
//
//
//    @Override
//    public void onSynthesizeStart(String s) {
//
//    }
//
//
//    @Override
//    public void onSynthesizeDataArrived(String s, byte[] bytes, int i) {
//
//    }
//
//
//    @Override
//    public void onSynthesizeFinish(String s) {
//
//    }
//
//    @Override
//    public void onSpeechStart(String s) {
//
//    }
//
//    @Override
//    public void onSpeechProgressChanged(String s, int i) {
//
//    }
//
//    @Override
//    public void onSpeechFinish(String s) {
//
//    }
//
//    @Override
//    public void onError(String s, SpeechError speechError) {
//        CrashReport.postCatchedException(new Throwable("百度语音合成出错: " + s + "..." + speechError.toString()));
//    }
}
