package com.zcareze.core;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

public class Result {
	
	public int code;
	public String id;
	private String params;

	public JSONObject getParams() {
		return JSON.parseObject(this.params);
	}
}
