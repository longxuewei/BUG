/**
 * 
 */
package com.zcareze.core;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author sa
 * java回调缓存
 */
public class CacheClass {
	/**
	 * 缓存callback map
	 */
	private final Map<String, Apply> MAP = new ConcurrentHashMap<>();
	
	public void putClass(String id, Apply callBack) {
		MAP.put(id, callBack);
	}
	
	public Apply getClass(String id) {
		Apply apply = MAP.get(id);
		MAP.remove(id);
		return apply;
	}
	
}
