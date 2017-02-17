package com.zcareze.zkyandroidweb.utils;


import com.tencent.bugly.crashreport.CrashReport;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2016 年 09 月 08 日 15 : 22
 */
public class JavaScriptUtil {
    public static Object callJs(String js, String methodName, Object[] params) {
        Context enter = Context.enter();
        enter.setOptimizationLevel(-1);
        try {
            Scriptable scriptable = enter.initStandardObjects();
            ScriptableObject.putProperty(scriptable, "javaContext", Context.javaToJS(JavaScriptUtil.class, scriptable));
            ScriptableObject.putProperty(scriptable, "javaLoader", Context.javaToJS(JavaScriptUtil.class.getClassLoader(), scriptable));

            enter.evaluateString(scriptable, js, "JavaScriptUtil", 1, null);
            Function function = (Function) scriptable.get(methodName, scriptable);
            return function.call(enter, scriptable, scriptable, params);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            Context.exit();
        }
        return null;
    }


    /**
     * 只有逻辑语句
     *
     * @param expr
     * @return
     */
    public static boolean computeBoolean(String expr, String exprParam, String[] exprValue) {
        try {
            String js = "function computeBoolean(" + exprParam + "){if(" + expr + "){return true;}else{return false;}}";
            Object commonMethod = callJs(js, "computeBoolean", exprValue);
            return commonMethod instanceof Boolean && (boolean) commonMethod;
        } catch (Exception e) {
            L.i("逻辑表达式" + expr);
            L.i("参数" + exprParam);
            CrashReport.postCatchedException(new Throwable("逻辑表达式:" + expr + "参数:" + exprParam));
            e.printStackTrace();
        }
        return false;
    }


    /**
     * 执行布尔值
     *
     * @param expr
     * @param exprParam
     * @param exprValue
     * @return
     */
    public static BigDecimal computeFloat(String expr, String exprParam, String[] exprValue) {
        String js = "function computeFloat(" + exprParam + "){return " + expr + "}";
        Object computeFloat = callJs(js, "computeFloat", exprValue);
        if(computeFloat!=null && !computeFloat.equals("")) {
            return new BigDecimal(computeFloat.toString()).setScale(2, RoundingMode.DOWN);
        }

        return null;
    }
}
