package com.zcareze.core;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

import android.os.AsyncTask;
import android.util.Log;

public class ZipExtractorTask extends AsyncTask<Void, Integer, Long> {
	private final String TAG = "ZipExtractorTask";
	private final File mInput;
	private final File mOutput;
	private final String version;
	private int mProgress = 0;
	private boolean mReplaceAll;
	
	public ZipExtractorTask(String in, String out, String ver, boolean replaceAll){
		super();
		mInput = new File(in);
		mOutput = new File(out);
		version = ver;
		if(!mOutput.exists()){
			if(!mOutput.mkdirs()){
				Log.e(TAG, "Failed to make directories:"+mOutput.getAbsolutePath());
			}
		}
		
		mReplaceAll = replaceAll;
	}
	@Override
	protected Long doInBackground(Void... params) {
		// TODO Auto-generated method stub
		return unzip();
	}
	
	/**
	 * 执行结果
	 */
	@Override
	protected void onPostExecute(Long result) {
		if(isCancelled())
			return;
		Zcareze.setVersion(version);
	}
	
	/**
	 * 开始解压
	 */
	@Override
	protected void onPreExecute() {
		// TODO Auto-generated method stub
		//super.onPreExecute();
		Zcareze.javascript("UnZipRelease", null);
	}
	
	/**
	 * 回调javascript参数
	 */
	private Map<String, Object> params = new HashMap<String, Object>();
	
	/**
	 * 解压进度
	 */
	@Override
	protected void onProgressUpdate(Integer... values) {

		if(values.length>1){
			params.clear();
			params.put("progress", values[0]);
			params.put("contentLength", values[1]);
			Zcareze.javascript("UnZipReleaseProgress", params);
		}
		else{
			params.clear();
			params.put("progress", values[0].intValue());
			Zcareze.javascript("UnZipReleaseProgress", params);
		}
	}
	
	/**
	 * 执行解压
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private long unzip(){
		long extractedSize = 0L;
		Enumeration<ZipEntry> entries;
		ZipFile zip = null;
		try {
			zip = new ZipFile(mInput);
			long uncompressedSize = getOriginalSize(zip);
			publishProgress(0, (int) uncompressedSize);
			
			entries = (Enumeration<ZipEntry>) zip.entries();
			while(entries.hasMoreElements()){
				ZipEntry entry = entries.nextElement();
				if(entry.isDirectory()){
					continue;
				}
				File destination = new File(mOutput, entry.getName());
				if(!destination.getParentFile().exists()){
					Log.e(TAG, "make="+destination.getParentFile().getAbsolutePath());
					destination.getParentFile().mkdirs();
				}
				if(destination.exists()&&!mReplaceAll){
					
				}
				ProgressReportingOutputStream outStream = new ProgressReportingOutputStream(destination);
				extractedSize+=copy(zip.getInputStream(entry),outStream);
				outStream.close();
			}
		} catch (ZipException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				zip.close();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return extractedSize;
	}

	private long getOriginalSize(ZipFile file){
		@SuppressWarnings("unchecked")
		Enumeration<ZipEntry> entries = (Enumeration<ZipEntry>) file.entries();
		long originalSize = 0l;
		while(entries.hasMoreElements()){
			ZipEntry entry = entries.nextElement();
			if(entry.getSize()>=0){
				originalSize+=entry.getSize();
			}
		}
		return originalSize;
	}
	
	private int copy(InputStream input, OutputStream output){
		byte[] buffer = new byte[1024*8];
		BufferedInputStream in = new BufferedInputStream(input, 1024*8);
		BufferedOutputStream out  = new BufferedOutputStream(output, 1024*8);
		int count =0,n=0;
		try {
			while((n=in.read(buffer, 0, 1024*8))!=-1){
				out.write(buffer, 0, n);
				count+=n;
			}
			out.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				out.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			try {
				in.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return count;
	}
	
	private final class ProgressReportingOutputStream extends FileOutputStream{

		public ProgressReportingOutputStream(File file)
				throws FileNotFoundException {
			super(file);
			// TODO Auto-generated constructor stub
		}

		@Override
		public void write(byte[] buffer, int byteOffset, int byteCount)
				throws IOException {
			// TODO Auto-generated method stub
			super.write(buffer, byteOffset, byteCount);
		    mProgress += byteCount;
		    publishProgress(mProgress);
		}
		
	}
	
}