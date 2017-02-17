package com.zcareze.zkyandroidweb.base;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.view.View;
import android.view.WindowManager;

import com.zcareze.zkyandroidweb.utils.BarUtil;
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
//        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
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

}
