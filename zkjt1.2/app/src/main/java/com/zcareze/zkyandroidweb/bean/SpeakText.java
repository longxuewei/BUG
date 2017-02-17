package com.zcareze.zkyandroidweb.bean;

import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 02 月 16 日 10 : 32
 */

public class SpeakText {

    private List<String> texts;

    @Override
    public String toString() {
        return "SpeakText{" +
                "texts=" + texts +
                '}';
    }

    public List<String> getTexts() {
        return texts;
    }

    public void setTexts(List<String> texts) {
        this.texts = texts;
    }

    public SpeakText() {

    }

    public SpeakText(List<String> texts) {

        this.texts = texts;
    }
}
