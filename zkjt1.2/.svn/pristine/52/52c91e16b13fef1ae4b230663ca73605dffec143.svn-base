package com.zcareze.zkyandroidweb.activity;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Rect;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.Spinner;

import com.zcareze.result.Result;
import com.zcareze.rpc.util.HttpClientUtil;
import com.zcareze.zkyandroidweb.R;
import com.zcareze.zkyandroidweb.base.BaseActivity;
import com.zcareze.zkyandroidweb.base.BaseApplication;
import com.zcareze.zkyandroidweb.constant.ResidentInfo;
import com.zcareze.zkyandroidweb.presenter.LoginPresenter;
import com.zcareze.zkyandroidweb.proxy.ProxyFactoryManager;
import com.zcareze.zkyandroidweb.utils.L;
import com.zcareze.zkyandroidweb.utils.SPUtil;
import com.zcareze.zkyandroidweb.utils.T;
import com.zcareze.zkyandroidweb.viewinterface.LoginViewImpl;

import java.util.ArrayList;
import java.util.List;

import rx.Subscriber;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 11 月 10 日 16 : 37
 */

public class LoginActivity extends BaseActivity implements LoginViewImpl {


    private EditText et_account;
    private EditText et_password;
    private Button bt_login;
    private ProgressDialog progressDialog;
    private RelativeLayout main;
    private Spinner sp_apiAddress;
    private List<String> apis;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        controlKeyboardLayout(main, bt_login);
//        closeBar();
//        Intent intent = getIntent();
//
//
//        //重新登陆
//        if (intent != null) {
//            String action = intent.getAction();
//            if (RELOGIN.equals(action)) {
//                Bundle extras = intent.getExtras();
//                String userName = extras.getString(ResidentInfo.USERNAME, "");
//                String passWorld = extras.getString(ResidentInfo.PASSWORD, "");
//                startLogin(userName, passWorld);
//            }
//        }


    }

    private void controlKeyboardLayout(final View root, final View scrollToView) {
        root.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Rect rect = new Rect();
                //获取root在窗体的可视区域
                root.getWindowVisibleDisplayFrame(rect);
                //获取root在窗体的不可视区域高度(被其他View遮挡的区域高度)
                int rootInvisibleHeight = root.getRootView().getHeight() - rect.bottom;
                //若不可视区域高度大于100，则键盘显示
                if (rootInvisibleHeight > 100) {
                    int[] location = new int[2];
                    //获取scrollToView在窗体的坐标
                    scrollToView.getLocationInWindow(location);
                    //计算root滚动高度，使scrollToView在可见区域
                    int srollHeight = (location[1] + scrollToView.getHeight()) - rect.bottom;
                    root.scrollTo(0, srollHeight);
                } else {
                    //键盘隐藏
                    root.scrollTo(0, 0);
                }
            }
        });
    }


    @Override
    protected void initView() {
        ProxyFactoryManager.release();
        main = (RelativeLayout) findViewById(R.id.activity_main);
        et_account = (EditText) findViewById(R.id.et_account);
        et_password = (EditText) findViewById(R.id.et_password);
        bt_login = (Button) findViewById(R.id.bt_login);
        bt_login.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                bt_login.setEnabled(false);
                final String account = et_account.getText().toString();
                final String password = et_password.getText().toString();

                if (TextUtils.isEmpty(account) || TextUtils.isEmpty(password)) {
                    showMessage(getString(R.string.accountOrpassord_Error_hint));
                    bt_login.setEnabled(true);
                    return;
                }
                progressDialog = new ProgressDialog(LoginActivity.this);
                progressDialog.setMessage("正在初始化,请稍候...");
                progressDialog.setCancelable(false);
                progressDialog.setCanceledOnTouchOutside(false);
                progressDialog.show();
                startLogin(account, password);
            }


        });


        et_account.setText((String) SPUtil.get(this, ResidentInfo.USERNAME, ""));
        sp_apiAddress = (Spinner) findViewById(R.id.sp_apiAddress);
        showAddress(false);
    }

    private void showAddress(boolean enable) {
        if (enable) {
            sp_apiAddress.setVisibility(View.VISIBLE);
            apis = new ArrayList<>();
            apis.add("http://api.test.zcareze.com");//线上测试地址
            apis.add("http://192.168.0.124:82");//开发地址
            apis.add("http://192.168.0.124:8080");//开发测试地址
            ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, apis);
            sp_apiAddress.setAdapter(arrayAdapter);
            sp_apiAddress.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
                @Override
                public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                    ProxyFactoryManager.changeApiAddress(apis.get(position));
                }

                @Override
                public void onNothingSelected(AdapterView<?> parent) {

                }
            });
        } else {
            sp_apiAddress.setVisibility(View.GONE);
        }

    }

    private void startLogin(final String account, final String password) {
        HttpClientUtil.cookieValue = null;
        LoginPresenter.getInstance(LoginActivity.this).login(account, password, new Subscriber<Result>() {
            @Override
            public void onCompleted() {
                this.unsubscribe();
                bt_login.setEnabled(true);
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
            }


            @Override
            public void onError(Throwable e) {
                T.s(LoginActivity.this, e.getMessage());
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                    bt_login.setEnabled(true);
                }
            }

            @Override
            public void onNext(Result result) {
                if (progressDialog != null && progressDialog.isShowing()) {
                    progressDialog.dismiss();
                }
                bt_login.setEnabled(true);
                if (result.getCode() == 1) {
                    SPUtil.put(LoginActivity.this  , ResidentInfo.USERNAME, account);
                    loginSuccess();
                }

            }
        });
    }

    private void loginSuccess() {
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }


    @Override
    protected int getContentView() {
        return R.layout.activity_login;
    }

    @Override
    public Context getContext() {
        return this;
    }

    @Override
    public void showMessage(String message) {
        super.t(message);
    }
}
