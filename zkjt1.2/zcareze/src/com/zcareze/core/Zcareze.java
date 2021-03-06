package com.zcareze.core;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import android.app.Activity;
import android.app.Application;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.zcareze.R;


public class Zcareze extends BroadcastReceiver{
	
	public static String ROOT_DIR;
	
	private static Context context;
	
	private static Handler handler;
	
	private static Activity activity;
	
	public static final String SETUPCOMPLETE = "SetupComplete";
	
	public static final String UNZIPRELEASE = "UnZipRelease";
	
	public static final String UNZIPRELEASEPROGRESS = "UnZipReleaseProgress";
	
	public static final String READYUPDATERELEASE = "ReadyUpdateRelease";
	
	public static final String UPDATERELEASEPROGRESS = "UpdateReleaseProgress";
	
	public static final String JAVASCRIPT = "window.ZcarezeApp.ExecuteJsAPI";
	
	public static final String NAME = "javascript";
	
	private static CacheClass cache = new CacheClass();
	
	private ConnectivityManager connectivityManager;
	
	private NetworkInfo netWorkInfo;
	
	
	/**
	 * 检测存储问题
	 * @return
	 */
    static boolean mopo(String version) {
		String status = Environment.getExternalStorageState();
		//测试是否有存储可用
		if (status.equals(Environment.MEDIA_MOUNTED)) {
			File destDir = new File(Zcareze.ROOT_DIR);
			if (!destDir.exists()) {
				destDir.mkdirs();
			}
			return true;
		} else {
			//无可用存储设备
		}
		return false;
	}

	/**
	 * 解压下载的文件
	 * @param fileName
	 */
    public static void doZipExtractorWork(String fileName, String version){
		ZipExtractorTask task = new ZipExtractorTask(Zcareze.ROOT_DIR + "/" + fileName, Zcareze.ROOT_DIR,  version, true);
		task.execute();
	}
	
	/**
	 * 下载最新的程序文件
	 * @param fileUrl 
	 * @param fileName
	 */
    public static void doDownLoadRelease(String fileUrl, String version){
		DownLoaderTask task = new DownLoaderTask(fileUrl, Zcareze.ROOT_DIR, version);
		task.execute();
	}
	
	/**
	 * 获取版本号
	 * @return
	 */
	public static String getVersion(){
		try {  
            FileInputStream inputStream = Zcareze.context.openFileInput(context.getResources().getString(R.string.version));
            byte[] bytes = new byte[1024];  
            ByteArrayOutputStream arrayOutputStream = new ByteArrayOutputStream();  
            while (inputStream.read(bytes) != -1) {  
                arrayOutputStream.write(bytes, 0, bytes.length);  
            }
            arrayOutputStream.flush();
            inputStream.close();  
            arrayOutputStream.close();  
            String version = new String(arrayOutputStream.toByteArray());  
            return version.trim();
  
        } catch (FileNotFoundException e) {  
            e.printStackTrace();
        } catch (IOException e) {  
            e.printStackTrace();
        } 
		return null;
	}
	
	/**
	 * 获取版本号
	 * @return
	 */
	public static String getAppVersion(){
		try{
			PackageManager manager = context.getPackageManager();
			PackageInfo info = manager.getPackageInfo(context.getPackageName(), 0);
			return info.versionName;
		}catch(Exception e){
			return "";
		}
	}
	
	/**
	 * 设置版本号
	 * @param version
	 */
	public static void setVersion(String version){

        try {  
            /* 根据用户提供的文件名，以及文件的应用模式，打开一个输出流.文件不存系统会为你创建一个的， 
             * 至于为什么这个地方还有FileNotFoundException抛出，我也比较纳闷。在Context中是这样定义的 
             *   public abstract FileOutputStream openFileOutput(String name, int mode) 
             *   throws FileNotFoundException; 
             * openFileOutput(String name, int mode); 
             * 第一个参数，代表文件名称，注意这里的文件名称不能包括任何的/或者/这种分隔符，只能是文件名 
             * 第二个参数，代表文件的操作模式 
             *          MODE_PRIVATE 私有（只能创建它的应用访问） 重复写入时会文件覆盖 
             *          MODE_APPEND  私有   重复写入时会在文件的末尾进行追加，而不是覆盖掉原来的文件 
             *          MODE_WORLD_READABLE 公用  可读 
             *          MODE_WORLD_WRITEABLE 公用 可读写 
             *  */  
            @SuppressWarnings("static-access")
			FileOutputStream outputStream = context.openFileOutput(context.getResources().getString(R.string.version),  
            		Zcareze.context.MODE_PRIVATE);  
            outputStream.write(version.getBytes());  
            outputStream.flush();  
            outputStream.close();  
            Zcareze.javascript("SetupComplete", null);
        } catch (FileNotFoundException e) {  
            e.printStackTrace();  
        } catch (IOException e) {  
            e.printStackTrace();  
        }
	}
	
	public static Apply javascriptCallBack(String function, Map<String, Object> params){
		Apply apply = new Apply();
		
		String data = "";
		String id = UUID.randomUUID().toString().replaceAll("-", "");
		cache.putClass(id, apply);
		if(params != null && !params.isEmpty()){
			Parameter p = new Parameter(id, params);
			data = JSON.toJSONString(p);
		}
		setMessage(function, data);
		return apply;
	}
	
	private static void setMessage(String function, String data){
		try{
			Message message = new Message();
			Bundle bundle = new Bundle();
			String script = "('" + function + "'";
			if(data.length() > 0){
				script = script + "," + data + ");";
			}else{
				script = script + ");";
			}
			bundle.putString(NAME, NAME+":"+JAVASCRIPT+" && "+ JAVASCRIPT + script);
			message.setData(bundle);
			handler.sendMessage(message);
		}catch(Exception e){
			
		}
	}
	
	public static void javascript(String function, Map<String, Object> params){
		String data = "";
		if(params != null && !params.isEmpty()){
			Parameter p = new Parameter(params);
			data = JSON.toJSONString(p);
		}
		setMessage(function, data);
	}
	
	public static void callBack(String params) {
		if(params.isEmpty()){
			return;
		}
		try {
			JSONObject json = JSON.parseObject(params);
			Result result = JSON.toJavaObject(json, Result.class);
			Apply apply = cache.getClass(result.id);
			apply.execute(result);
		} catch (Exception e) {
			// TODO: handle exception
			throw new RuntimeException("回调参数不正确：" + params, e);
		}
	}

	public static void setmXWalkView(Application context, Handler handler, Activity activity) {
		Zcareze.handler = handler;
		Zcareze.context = context;
		Zcareze.activity = activity;
		Zcareze.ROOT_DIR = context.getResources().getString(R.string.root_dir) + 
				context.getPackageName() + 
				context.getResources().getString(R.string.code_dir);
	}
	
	public static void restart(){
		final Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());  
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        Zcareze.activity.finish();
        context.startActivity(intent);
	}
	
	@Override
	public void onReceive(Context context, Intent intent) {
		// TODO Auto-generated method stub
		String action = intent.getAction();  
        if (action.equals(ConnectivityManager.CONNECTIVITY_ACTION)) {  
        	//Log.d(tag, "网络状态已经改变");  
            connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);  
            netWorkInfo = connectivityManager.getActiveNetworkInfo();    
            if(netWorkInfo != null && netWorkInfo.isAvailable()) {  
                String name = netWorkInfo.getTypeName();
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("state", name);
                Zcareze.javascript("NetWorkOnline", params);
            } else {  
            	Zcareze.javascript("NetWorkOffline", null);
            }  
        }
	}
}
