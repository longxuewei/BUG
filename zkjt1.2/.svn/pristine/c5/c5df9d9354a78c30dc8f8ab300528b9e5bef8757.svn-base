package com.zcareze.zkyandroidweb.base;

import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.WindowManager;

import com.zcareze.zkyandroidweb.utils.T;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 10 日 15 : 51
 * <p>
 * 所有Activity的基类, 简单的封装了一些公共方法.
 */

public abstract class BaseActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        super.onCreate(savedInstanceState);
        setContentView(getContentView());
        initView();
    }


    /**
     * 提示信息
     *
     * @param message
     */
    protected void t(String message) {
        if (TextUtils.isEmpty(message))
            return;
        T.l(this, message);
    }

    protected abstract void initView();


    /**
     * 子类返回父类界面ID
     *
     * @return
     */
    protected abstract int getContentView();


    public void closeBar() {
        try {
            // 需要root 权限
            Build.VERSION_CODES vc = new Build.VERSION_CODES();
            Build.VERSION vr = new Build.VERSION();
            String ProcID = "79";

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
                ProcID = "42"; // ICS AND NEWER
            }

            // 需要root 权限
            Process proc = Runtime.getRuntime().exec(
                    new String[] {
                            "su",
                            "-c",
                            "service call activity " + ProcID
                                    + " s16 com.android.systemui" }); // WAS
            // 79
            proc.waitFor();

        } catch (Exception ex) {
            // Toast.makeText(context, ex.getMessage(),
            // Toast.LENGTH_LONG).show();
        }
    }

}
