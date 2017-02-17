package com.zcareze.zkyandroidweb.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.ArrayMap;

import com.tencent.bugly.Bugly;
import com.tencent.bugly.crashreport.CrashReport;
import com.zcareze.domain.core.AccountList;
import com.zcareze.domain.regional.resident.ResidentList;
import com.zcareze.zkyandroidweb.constant.AccountListInfo;
import com.zcareze.zkyandroidweb.constant.ResidentInfo;


import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SPUtil {
    /**
     * 保存在手机里面的文件名
     */
    private static final String FILE_NAME = "zky_data";

    private static Map<String, Object> data = new ConcurrentHashMap<>();


    /**
     * 保存数据的方法，我们需要拿到保存数据的具体类型，然后根据类型调用不同的保存方法
     *
     * @param context
     * @param key
     * @param object
     */
    public static void put(Context context, String key, Object object) {
        SharedPreferences sp = context.getSharedPreferences(FILE_NAME,
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();

        if (object instanceof String) {
            editor.putString(key, (String) object);
        } else if (object instanceof Integer) {
            editor.putInt(key, (Integer) object);
        } else if (object instanceof Boolean) {
            editor.putBoolean(key, (Boolean) object);
        } else if (object instanceof Float) {
            editor.putFloat(key, (Float) object);
        } else if (object instanceof Long) {
            editor.putLong(key, (Long) object);
        } else {
            editor.putString(key, object.toString());
        }
        SharedPreferencesCompat.apply(editor);
        data.remove(key);
        data.put(key, object);
    }

    /**
     * 得到保存数据的方法，我们根据默认值得到保存的数据的具体类型，然后调用相对于的方法获取值
     *
     * @param context
     * @param key
     * @param defaultObject
     * @return
     */
    public static Object get(Context context, String key, Object defaultObject) {
        if (data.containsKey(key)) {
            return data.get(key);
        }
        SharedPreferences sp = context.getSharedPreferences(FILE_NAME,
                Context.MODE_PRIVATE);

        if (defaultObject instanceof String) {
            return sp.getString(key, (String) defaultObject);
        } else if (defaultObject instanceof Integer) {
            return sp.getInt(key, (Integer) defaultObject);
        } else if (defaultObject instanceof Boolean) {
            return sp.getBoolean(key, (Boolean) defaultObject);
        } else if (defaultObject instanceof Float) {
            return sp.getFloat(key, (Float) defaultObject);
        } else if (defaultObject instanceof Long) {
            return sp.getLong(key, (Long) defaultObject);
        }

        return null;
    }

    /**
     * 移除某个key值已经对应的值
     *
     * @param context
     * @param key
     */
    public static void remove(Context context, String key) {
        SharedPreferences sp = context.getSharedPreferences(FILE_NAME,
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.remove(key);
        SharedPreferencesCompat.apply(editor);
        if(data.containsKey(key)){
            data.remove(key);
        }
    }

    /**
     * 清除所有数据
     *
     * @param context
     */
    public static void clear(Context context) {
        SharedPreferences sp = context.getSharedPreferences(FILE_NAME,
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.clear();
        SharedPreferencesCompat.apply(editor);
        data.clear();
    }



    /**
     * 创建一个解决SharedPreferencesCompat.apply方法的一个兼容类
     *
     * @author zhy
     */
    private static class SharedPreferencesCompat {
        private static final Method sApplyMethod = findApplyMethod();

        /**
         * 反射查找apply的方法
         *
         * @return
         */
        @SuppressWarnings({"unchecked", "rawtypes"})
        private static Method findApplyMethod() {
            try {
                Class clz = SharedPreferences.Editor.class;
                return clz.getMethod("apply");
            } catch (NoSuchMethodException e) {
            }

            return null;
        }

        /**
         * 如果找到则使用apply执行，否则使用commit
         *
         * @param editor
         */
        public static void apply(SharedPreferences.Editor editor) {
            try {
                if (sApplyMethod != null) {
                    sApplyMethod.invoke(editor);
                    return;
                }
            } catch (IllegalArgumentException | IllegalAccessException e) {
            } catch (InvocationTargetException e) {
            }
            editor.commit();
        }
    }

    /**
     * 保存用户信息
     *
     * @param residentList 用户信息
     * @param context      上下文
     */
    public static void saveResidentInfo(ResidentList residentList, Context context) {
        if (residentList == null)
            return;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA);
        SPUtil.put(context, ResidentInfo.ID, residentList.getId());
        SPUtil.put(context, ResidentInfo.ARCHIVENO, residentList.getArchiveNo());
        SPUtil.put(context, ResidentInfo.NAME, residentList.getName());
        SPUtil.put(context, ResidentInfo.ABBR, residentList.getAbbr());
        SPUtil.put(context, ResidentInfo.GENDER, residentList.getGender());
        if (residentList.getBirthday() != null) {
            String birthday = simpleDateFormat.format(residentList.getBirthday());
            SPUtil.put(context, ResidentInfo.BIRTHDAY, birthday);
        }
        SPUtil.put(context, ResidentInfo.PHONE, residentList.getPhone());
        SPUtil.put(context, ResidentInfo.ABOBLOOD, residentList.getAboBlood());
        SPUtil.put(context, ResidentInfo.RHBLOOD, residentList.getRhBlood());
        SPUtil.put(context, ResidentInfo.IDCARDNO, residentList.getIdCardNo());
        SPUtil.put(context, ResidentInfo.WORKUNIT, residentList.getWorkUnit());
        SPUtil.put(context, ResidentInfo.LINKMAN, residentList.getLinkman());
        SPUtil.put(context, ResidentInfo.LINKPHONE, residentList.getLinkPhone());
        SPUtil.put(context, ResidentInfo.STAYKIND, residentList.getStayKind());
        SPUtil.put(context, ResidentInfo.ARCHIVEADDRESS, residentList.getArchiveAddress());
        SPUtil.put(context, ResidentInfo.MINORITY, residentList.getMinority());
        SPUtil.put(context, ResidentInfo.EDUCATION, residentList.getEducation());

        SPUtil.put(context, ResidentInfo.OCCUPATION, residentList.getOccupation());
        SPUtil.put(context, ResidentInfo.MARITALSTATUS, residentList.getMaritalStatus());
        SPUtil.put(context, ResidentInfo.PAYMODES, residentList.getPayModes());
        SPUtil.put(context, ResidentInfo.FAMILYID, residentList.getFamilyId());
        SPUtil.put(context, ResidentInfo.RELATIONSHIP, residentList.getRelationship());
        SPUtil.put(context, ResidentInfo.ARCHIVESTATUS, residentList.getArchiveStatus());
        SPUtil.put(context, ResidentInfo.ORGID, residentList.getOrgId());
        if (residentList.getCommitTime() != null) {
            String birthday = simpleDateFormat.format(residentList.getCommitTime());
            SPUtil.put(context, ResidentInfo.COMMITTIME, birthday);
        }
        if (residentList.getLockTime() != null) {
            String birthday = simpleDateFormat.format(residentList.getLockTime());
            SPUtil.put(context, ResidentInfo.LOCKTIME, birthday);
        }
        SPUtil.put(context, ResidentInfo.OPENGRADE, residentList.getOpenGrade());
        SPUtil.put(context, ResidentInfo.EXISTACCOUNT, residentList.getExistAccount());
        SPUtil.put(context, ResidentInfo.ISHEAD, residentList.getIsHead());
        SPUtil.put(context, ResidentInfo.ADDRESS, residentList.getAddress());
        SPUtil.put(context, ResidentInfo.DISTRICTID, residentList.getCommunityId());
        SPUtil.put(context, ResidentInfo.TOWNADDRESS, residentList.getTownAddress());

    }

    /**
     * 获取用户信息
     *
     * @param context
     * @return
     */
    public static ResidentList getUserInfo(Context context) {
        ResidentList residentList = new ResidentList();
        residentList.setArchiveNo(((String) SPUtil.get(context, ResidentInfo.ARCHIVENO, "")));
        residentList.setName(((String) SPUtil.get(context, ResidentInfo.NAME, "")));
        residentList.setAbbr(((String) SPUtil.get(context, ResidentInfo.ABBR, "")));
        residentList.setGender(((String) SPUtil.get(context, ResidentInfo.GENDER, "")));
        try {
            residentList.setBirthday(new SimpleDateFormat("yyyy-DD-mm HH:mm:ss", Locale.CHINA).parse(((String) SPUtil.get(context, ResidentInfo.BIRTHDAY, ""))));
        } catch (ParseException e) {
            L.d("解析居民信(生日)息出错!");
            e.printStackTrace();
        }
        residentList.setPhone(((String) SPUtil.get(context, ResidentInfo.PHONE, "")));
        residentList.setAboBlood(((String) SPUtil.get(context, ResidentInfo.ABOBLOOD, "")));
        residentList.setRhBlood(((String) SPUtil.get(context, ResidentInfo.RHBLOOD, "")));
        residentList.setIdCardNo(((String) SPUtil.get(context, ResidentInfo.IDCARDNO, "")));
        residentList.setWorkUnit(((String) SPUtil.get(context, ResidentInfo.WORKUNIT, "")));
        residentList.setLinkman(((String) SPUtil.get(context, ResidentInfo.LINKMAN, "")));
        residentList.setLinkPhone(((String) SPUtil.get(context, ResidentInfo.LINKPHONE, "")));
        residentList.setStayKind(((Integer) SPUtil.get(context, ResidentInfo.STAYKIND, -1)));
        residentList.setArchiveAddress(((String) SPUtil.get(context, ResidentInfo.ARCHIVEADDRESS, "")));
        residentList.setMinority(((String) SPUtil.get(context, ResidentInfo.MINORITY, "")));
        residentList.setEducation(((String) SPUtil.get(context, ResidentInfo.EDUCATION, "")));
        residentList.setOccupation(((String) SPUtil.get(context, ResidentInfo.OCCUPATION, "")));
        residentList.setMaritalStatus(((String) SPUtil.get(context, ResidentInfo.MARITALSTATUS, "")));
        residentList.setPayModes(((String) SPUtil.get(context, ResidentInfo.PAYMODES, "")));
        residentList.setFamilyId(((String) SPUtil.get(context, ResidentInfo.FAMILYID, "")));
        residentList.setRelationship(((String) SPUtil.get(context, ResidentInfo.RELATIONSHIP, "")));
        residentList.setArchiveStatus(((Integer) SPUtil.get(context, ResidentInfo.ARCHIVESTATUS, -1)));
        residentList.setOrgId(((String) SPUtil.get(context, ResidentInfo.ORGID, "")));
        try {
            residentList.setCommitTime(new SimpleDateFormat("yyyy-DD-mm HH:mm:ss", Locale.CHINA).parse(((String) SPUtil.get(context, ResidentInfo.COMMITTIME, ""))));
        } catch (ParseException e) {
            L.d("解析居民信(CommitTime)息出错!");
            e.printStackTrace();
        }
        try {
            residentList.setLockTime(new SimpleDateFormat("yyyy-DD-mm HH:mm:ss", Locale.CHINA).parse(((String) SPUtil.get(context, ResidentInfo.COMMITTIME, ""))));
        } catch (ParseException e) {
            L.d("解析居民信(LockTime)息出错!");
            e.printStackTrace();
        }
        residentList.setOpenGrade(((Integer) SPUtil.get(context, ResidentInfo.OPENGRADE, -1)));
        residentList.setExistAccount(((Boolean) SPUtil.get(context, ResidentInfo.EXISTACCOUNT, false)));
        //status 激活状态
        residentList.setIsHead((Boolean) SPUtil.get(context, ResidentInfo.ISHEAD, false));
        residentList.setAddress((String) SPUtil.get(context, ResidentInfo.RELATIONSHIP, ""));
        residentList.setCommunityId((String) SPUtil.get(context, ResidentInfo.COMMITTIME, ""));
        residentList.setTownAddress((String) SPUtil.get(context, ResidentInfo.TOWNADDRESS, ""));
        residentList.setId((String) SPUtil.get(context, ResidentInfo.ID, ""));

        return residentList;
    }

    /**
     * 账户信息
     */
    public static void saveAccountInfo(AccountList accountList, String cloudId, Context context) {
        if (accountList == null)
            return;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA);
        SPUtil.put(context, AccountListInfo.ID, accountList.getId());
        SPUtil.put(context, AccountListInfo.MOBILE, accountList.getMobile());
        SPUtil.put(context, AccountListInfo.NICKNAME, accountList.getNickname());
        SPUtil.put(context, AccountListInfo.PASSWORD, accountList.getPassword());
        SPUtil.put(context, AccountListInfo.REGTIME, simpleDateFormat.format(accountList.getRegTime()));
        SPUtil.put(context, AccountListInfo.REGMODE, accountList.getRegMode());
        SPUtil.put(context, AccountListInfo.REGSOURCE, accountList.getRegSource());
        SPUtil.put(context, AccountListInfo.STATUS, accountList.getStatus());
        SPUtil.put(context, AccountListInfo.CLOUDID, cloudId);
    }

    /**
     * 账户信息
     */
    public static AccountList getAccountInfo(Context context) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.CHINA);
        String id = (String) SPUtil.get(context, AccountListInfo.ID, "");
        String mobile = (String) SPUtil.get(context, AccountListInfo.MOBILE, "");
        String nickName = (String) SPUtil.get(context, AccountListInfo.NICKNAME, "");
        String passWord = (String) SPUtil.get(context, AccountListInfo.PASSWORD, "");
        Date date;
        try {
            date = simpleDateFormat.parse((String) SPUtil.get(context, AccountListInfo.REGTIME, ""));
        } catch (ParseException e) {
            e.printStackTrace();
            CrashReport.postCatchedException(new Throwable("解析账户信息的注册时间失败"));
            date = null;
        }
        Integer regmode = (Integer) SPUtil.get(context, AccountListInfo.REGMODE, -1);
        String regSource = (String) SPUtil.get(context, AccountListInfo.REGSOURCE, "");
        Integer status = (Integer) SPUtil.get(context, AccountListInfo.STATUS, -1);
        AccountList account = new AccountList();
        account.setId(id);
        account.setMobile(mobile);
        account.setNickname(nickName);
        account.setPassword(passWord);
        account.setRegTime(date);
        account.setRegMode(regmode);
        account.setRegSource(regSource);
        account.setStatus(status);
        return account;

    }

}