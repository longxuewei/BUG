package com.zcareze.webview;

import org.xwalk.core.JavascriptInterface;
import org.xwalk.core.XWalkCookieManager;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Handler;

import com.zcareze.core.Zcareze;

public class BaseInterface implements Javascript{
	
	private Application context;
	
	private XWalkCookieManager xwalkcookie;
	
	public void init(Application context, Handler handler, Activity activity) {
    	this.context = context;
    	this.xwalkcookie = new XWalkCookieManager();
    	Zcareze.setmXWalkView(context, handler, activity);
	}
    
    @JavascriptInterface
	public void doDownLoadRelease(String fileUrl, String version) {
    	Zcareze.doDownLoadRelease(fileUrl, version);
	}
    
    @JavascriptInterface
	public String getVersion() {
    	return Zcareze.getVersion();
	}
    
    @JavascriptInterface
	public void callBack(String params) {
    	Zcareze.callBack(params);
	}
    
    @JavascriptInterface
	public void setCookie(String url, String cookieStr) {
    	xwalkcookie.setCookie(url, cookieStr);
	}
    
    @JavascriptInterface
	public String getCookie(String url) {
    	return xwalkcookie.getCookie(url);
	}
    
    @JavascriptInterface
    public void restart(){
        Zcareze.restart();
    }
    
    @JavascriptInterface
    public boolean isNetworkConnected() {    
        if (context != null) {    
            ConnectivityManager mConnectivityManager = (ConnectivityManager) context    
                    .getSystemService(Context.CONNECTIVITY_SERVICE);    
            NetworkInfo mNetworkInfo = mConnectivityManager.getActiveNetworkInfo();    
            if (mNetworkInfo != null) {    
                return mNetworkInfo.isAvailable(); 
            }    
        }
        return false;
    }
    
    @JavascriptInterface
    public String getAppVersion(){
    	return Zcareze.getAppVersion();
    }

}