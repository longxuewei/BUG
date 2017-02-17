package com.zcareze.core;

public class Apply {
	
	private CallBack callBack;
	
	public void callBack(CallBack callBack) {
		this.callBack = callBack;
	}
	
	public void execute(Result result) {
		if (result.code == 200) {
			callBack.then(result.getParams());
		} else {
			callBack.fail(result.getParams());
		}
	}
	
}
