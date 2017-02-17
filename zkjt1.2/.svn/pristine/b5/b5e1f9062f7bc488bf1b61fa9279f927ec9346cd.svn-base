package com.zcareze.core;

import java.util.Map;

public class Parameter {
	private String id;
	private Object data = new Object();
	public Parameter(String id, Map<String, Object> data) {
		super();
		this.id = id;
		setData(data);
	}
	public Parameter(Map<String, Object> data) {
		super();
		this.id = "";
		setData(data);
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object object) {
		if(object instanceof Map){
			Map<?, ?> map = (Map<?, ?>) object;
			if(map.containsKey("data")){
				this.data = map.get("data");
			}else{
				this.data = object;
			}
		}else{
			this.data = object;
		}
	}
}
