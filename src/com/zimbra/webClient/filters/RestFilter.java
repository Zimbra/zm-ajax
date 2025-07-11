/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2013, 2014, 2016 Synacor, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.webClient.filters;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RestFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        if (!(request instanceof HttpServletRequest) || !(response instanceof HttpServletResponse)) {
            chain.doFilter(request, response);
            return;
        }

        Map<String,String[]> attrMap= request.getParameterMap();
        for(Map.Entry<String, String[]> entry: attrMap.entrySet()) {
            if (allowlist.contains(entry.getKey())) {
                for(String value : entry.getValue()) {
                    request.setAttribute(entry.getKey(), value);
                }
            }
        }
        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {
        allowlist.add(ATTR_REQUEST_URI);
        allowlist.add(ATTR_INTERNAL_DISPATCH);
        allowlist.add(ATTR_AUTH_TOKEN);
        allowlist.add(ATTR_CSRF_ENABLED);
        allowlist.add(ATTR_TARGET_ACCOUNT_NAME);
        allowlist.add(ATTR_TARGET_ACCOUNT_ID);
        allowlist.add(ATTR_TARGET_ITEM_ID);
        allowlist.add(ATTR_TARGET_ITEM_TYPE);
        allowlist.add(ATTR_TARGET_ITEM_COLOR);
        allowlist.add(ATTR_TARGET_ITEM_VIEW);
        allowlist.add(ATTR_TARGET_ITEM_PATH);
        allowlist.add(ATTR_TARGET_ITEM_NAME);
        allowlist.add(ATTR_TARGET_ACTION);
        allowlist.add(ATTR_TARGET_BODYPART);
        allowlist.add(ATTR_TARGET_COLOR);
        allowlist.add(ATTR_TARGET_DATE);
        allowlist.add(ATTR_TARGET_EX_COMP_NUM);
        allowlist.add(ATTR_TARGET_EX_INV_ID);
        allowlist.add(ATTR_TARGET_FMT);
        allowlist.add(ATTR_TARGET_FOLDER_IDS);
        allowlist.add(ATTR_TARGET_IM_ID);
        allowlist.add(ATTR_TARGET_IM_PART);
        allowlist.add(ATTR_TARGET_IM_XIM);
        allowlist.add(ATTR_TARGET_INST_DURATION);
        allowlist.add(ATTR_TARGET_INST_START_TIME);
        allowlist.add(ATTR_TARGET_INV_COMP_NUM);
        allowlist.add(ATTR_TARGET_INV_ID);
        allowlist.add(ATTR_TARGET_NOTOOLBAR);
        allowlist.add(ATTR_TARGET_NUMDAYS);
        allowlist.add(ATTR_TARGET_PSTAT);
        allowlist.add(ATTR_TARGET_REFRESH);
        allowlist.add(ATTR_TARGET_SKIN);
        allowlist.add(ATTR_TARGET_SQ);
        allowlist.add(ATTR_TARGET_TZ);
        allowlist.add(ATTR_TARGET_USE_INSTANCE);
        allowlist.add(ATTR_TARGET_XIM);
        allowlist.add(ATTR_TARGET_VIEW);
        allowlist.add(ATTR_TARGET_ACCOUNT_PREF_TIME_ZONE);
        allowlist.add(ATTR_TARGET_ACCOUNT_PREF_SKIN);
        allowlist.add(ATTR_TARGET_ACCOUNT_PREF_LOCALE);
        allowlist.add(ATTR_TARGET_ACCOUNT_PREF_CALENDAR_FIRST_DAY_OF_WEEK);
        allowlist.add(ATTR_TARGET_ACCOUNT_PREF_CALENDAR_DAY_HOUR_START);
        allowlist.add(ATTR_TARGET_ACCOUNT_PREF_CALENDAR_DAY_HOUR_END);
        allowlist.add(ATTR_FREEBUSY);
    }

    private static final ArrayList<String> allowlist = new ArrayList<String>();

    // Reference: com.zimbra.cs.service.formatter.HtmlFormatter
    private static final String ATTR_REQUEST_URI         = "zimbra_request_uri";
    private static final String ATTR_INTERNAL_DISPATCH   = "zimbra_internal_dispatch";
    private static final String ATTR_AUTH_TOKEN          = "zimbra_authToken";
    private static final String ATTR_CSRF_ENABLED        = "zimbra_csrfEnabled";
    private static final String ATTR_TARGET_ACCOUNT_NAME = "zimbra_target_account_name";
    private static final String ATTR_TARGET_ACCOUNT_ID   = "zimbra_target_account_id";
    private static final String ATTR_TARGET_ITEM_ID      = "zimbra_target_item_id";
    private static final String ATTR_TARGET_ITEM_TYPE    = "zimbra_target_item_type";
    private static final String ATTR_TARGET_ITEM_COLOR   = "zimbra_target_item_color";
    private static final String ATTR_TARGET_ITEM_VIEW    = "zimbra_target_item_view";
    private static final String ATTR_TARGET_ITEM_PATH    = "zimbra_target_item_path";
    private static final String ATTR_TARGET_ITEM_NAME    = "zimbra_target_item_name";
    private static final String ATTR_TARGET_ACTION       = "action";
    private static final String ATTR_TARGET_BODYPART     = "bodypart";
    private static final String ATTR_TARGET_COLOR        = "color";
    private static final String ATTR_TARGET_DATE         = "date";
    private static final String ATTR_TARGET_EX_COMP_NUM  = "exCompNum";
    private static final String ATTR_TARGET_EX_INV_ID    = "exInvId";
    private static final String ATTR_TARGET_FMT          = "fmt";
    private static final String ATTR_TARGET_FOLDER_IDS   = "folderIds";
    private static final String ATTR_TARGET_IM_ID        = "im_id";
    private static final String ATTR_TARGET_IM_PART      = "im_part";
    private static final String ATTR_TARGET_IM_XIM       = "im_xim";
    private static final String ATTR_TARGET_INST_DURATION = "instDuration";
    private static final String ATTR_TARGET_INST_START_TIME = "instStartTime";
    private static final String ATTR_TARGET_INV_COMP_NUM = "invCompNum";
    private static final String ATTR_TARGET_INV_ID       = "invId";
    private static final String ATTR_TARGET_NOTOOLBAR    = "notoolbar";
    private static final String ATTR_TARGET_NUMDAYS      = "numdays";
    private static final String ATTR_TARGET_PSTAT        = "pstat";
    private static final String ATTR_TARGET_REFRESH      = "refresh";
    private static final String ATTR_TARGET_SKIN         = "skin";
    private static final String ATTR_TARGET_SQ           = "sq";
    private static final String ATTR_TARGET_TZ           = "tz";
    private static final String ATTR_TARGET_USE_INSTANCE = "useInstance";
    private static final String ATTR_TARGET_XIM          = "xim";
    private static final String ATTR_TARGET_VIEW         = "view";
    private static final String ATTR_TARGET_ACCOUNT_PREF_TIME_ZONE   = "zimbra_target_account_prefTimeZoneId";
    private static final String ATTR_TARGET_ACCOUNT_PREF_SKIN   = "zimbra_target_account_prefSkin";
    private static final String ATTR_TARGET_ACCOUNT_PREF_LOCALE   = "zimbra_target_account_prefLocale";
    private static final String ATTR_TARGET_ACCOUNT_PREF_CALENDAR_FIRST_DAY_OF_WEEK   = "zimbra_target_account_prefCalendarFirstDayOfWeek";
    private static final String ATTR_TARGET_ACCOUNT_PREF_CALENDAR_DAY_HOUR_START   = "zimbra_target_account_prefCalendarDayHourStart";
    private static final String ATTR_TARGET_ACCOUNT_PREF_CALENDAR_DAY_HOUR_END  = "zimbra_target_account_prefCalendarDayHourEnd";

    // Reference: com.zimbra.cs.service.formatter.FreeBusyFormatter
    private static final String ATTR_FREEBUSY = "zimbra_freebusy";
}
