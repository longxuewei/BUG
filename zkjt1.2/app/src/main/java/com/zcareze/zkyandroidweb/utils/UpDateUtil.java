package com.zcareze.zkyandroidweb.utils;

import android.content.Context;
import android.content.Intent;
import android.content.res.AssetManager;
import android.os.Environment;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.blankj.utilcode.utils.AppUtils;
import com.blankj.utilcode.utils.FileUtils;
import com.blankj.utilcode.utils.ShellUtils;
import com.blankj.utilcode.utils.Utils;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.Charset;

import static com.blankj.utilcode.utils.AppUtils.isSystemApp;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 01 月 19 日 15 : 14
 */

public class UpDateUtil {

    private static final String FILENAME = "ProtectProcess.apk";
    private static final String TAG = "UpDateUtil";


    private static UpDateUtil instance;

    public static UpDateUtil getInstance() {
        if (instance == null) {
            synchronized (UpDateUtil.class) {
                if (instance == null)
                    instance = new UpDateUtil();
            }
        }
        return instance;
    }


    /**
     * 检测是否安装了守护程序
     *
     * @param context     上下文
     * @param packageName 包名
     * @return 是否存在
     */
    public boolean checkProtectProcess(Context context, String packageName) {
        if (context == null || TextUtils.isEmpty(packageName))
            return false;
        Intent launchIntentForPackage = context.getPackageManager().getLaunchIntentForPackage(packageName);
        return launchIntentForPackage != null;
    }


    /**
     * 启动守护程序
     *
     * @param context     上下文
     * @param packageName 包名
     */
    public void launcherProtectProcess(Context context, String packageName) {
        if (TextUtils.isEmpty(packageName))
            return;
        Intent intent = context.getPackageManager().getLaunchIntentForPackage(packageName);
        if (intent != null) {
            intent.putExtra("PACKAGENAME", AppUtils.getAppPackageName(context));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        } else {
            L.i("intent为空");
        }
        L.i("包名是: " + packageName);
        context.startActivity(intent);
    }


    /**
     * 静默安装APK:
     * 1: 主程序将 "守护程序" 释放的SD卡上面.然后启动静默安装!
     * 2: 主程序启动了守护程序,然后进行安装新的主程序. 也是调用这里.(更新)!
     * <uses-permission android:name="android.permission.INSTALL_PACKAGES" />
     */
    @Deprecated
    public boolean installUpDate(String filePath) {
        File file = FileUtils.getFileByPath(filePath);
        if (!FileUtils.isFileExists(file))
            return false;
        String command = "LD_LIBRARY_PATH=/vendor/lib:/system/lib pm install -r " + filePath;
        Log.i(TAG, command);
        ShellUtils.CommandResult commandResult = ShellUtils.execCmd(command, !isSystemApp(Utils.getContext()), true);
        return commandResult.successMsg != null && commandResult.successMsg.toLowerCase().contains("success");
    }


    /**
     * 以root方式,静默安装apk!
     *
     * @param apkPath apk路径
     * @return 是否成功
     */
    public boolean install(String apkPath) {
        Log.i(TAG, "安装包路径: " + apkPath);
        boolean result = false;
        DataOutputStream dataOutputStream = null;
        BufferedReader errorStream = null;
        try {
            // 申请su权限
            Process process = Runtime.getRuntime().exec("su");
            dataOutputStream = new DataOutputStream(process.getOutputStream());
            // 执行pm install命令
            String command = "pm install -r " + apkPath + "\n";
            dataOutputStream.write(command.getBytes(Charset.forName("utf-8")));
            dataOutputStream.flush();
            dataOutputStream.writeBytes("exit\n");
            dataOutputStream.flush();
            process.waitFor();
            errorStream = new BufferedReader(new InputStreamReader(process.getErrorStream()));
            String msg = "";
            String line;
            // 读取命令的执行结果
            while ((line = errorStream.readLine()) != null) {
                msg += line;
            }
            Log.d("TAG", "install msg is " + msg);
            // 如果执行结果中包含Failure字样就认为是安装失败，否则就认为安装成功
            if (!msg.contains("Failure")) {
                result = true;
            }
        } catch (Exception e) {
            Log.e("TAG", e.getMessage(), e);
        } finally {
            try {
                if (dataOutputStream != null) {
                    dataOutputStream.close();
                }
                if (errorStream != null) {
                    errorStream.close();
                }
            } catch (IOException e) {
                Log.e("TAG", e.getMessage(), e);
            }
        }
        return result;
    }


    /**
     * 将守护程序释放到SD卡
     *
     * @param context 上下文
     */
    public File releaseProtectProcessToSdcard(Context context) {
        AssetManager assets = context.getAssets();
        InputStream open = null;
        OutputStream outputStream = null;
        File file = null;
        try {
            open = assets.open(FILENAME);
            String absoluteFile = Environment.getExternalStorageDirectory().getAbsolutePath();


            //创建临时目录用于存放守护程序的apk
            absoluteFile = absoluteFile + "/" + "TempInstall";
            File tempFile = new File(absoluteFile);
            if (!tempFile.exists())
                tempFile.mkdirs();


            file = new File(tempFile.getAbsolutePath(), FILENAME);
            outputStream = new FileOutputStream(file);
            byte[] bytes = new byte[1024];
            int len;
            while ((len = open.read(bytes, 0, 1024)) >= 0) {
                outputStream.write(bytes, 0, len);
            }
            open.close();
            outputStream.close();
            return file;
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(context, "释放守护时程序出错", Toast.LENGTH_LONG).show();
        } finally {
            if (open != null) {
                try {
                    open.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                    Toast.makeText(context, "关流错误_Open", Toast.LENGTH_LONG).show();
                }
            }
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                    Toast.makeText(context, "关流错误_Close", Toast.LENGTH_LONG).show();
                }
            }
        }
        return file;
    }
}
