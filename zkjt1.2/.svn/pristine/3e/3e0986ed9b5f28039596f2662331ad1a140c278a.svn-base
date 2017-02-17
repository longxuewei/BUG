package com.zcareze.zkyandroidweb.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.zcareze.domain.core.AccountHolder;

import java.util.List;

/**
 * 源代码: Lxw
 * 伊妹儿: China2021@126.com
 * 时间轴: 2017 年 01 月 05 日 15 : 18
 */

public class RegionAdapter extends BaseAdapter {
    private List<AccountHolder> accountHolders;

    public RegionAdapter(List<AccountHolder> accountHolders) {
        this.accountHolders = accountHolders;
    }

    @Override
    public int getCount() {
        return accountHolders.size();
    }

    @Override
    public AccountHolder getItem(int position) {
        return accountHolders.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder;
        if (convertView == null) {
            viewHolder = new ViewHolder();
            convertView = LayoutInflater.from(parent.getContext()).inflate(android.R.layout.simple_list_item_1, null);
            viewHolder.cloudName = (TextView) convertView.findViewById(android.R.id.text1);
            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
        }
        viewHolder.cloudName.setText(accountHolders.get(position).getCloudName());
        return convertView;
    }

    public static class ViewHolder {
        public TextView cloudName;
    }
}
