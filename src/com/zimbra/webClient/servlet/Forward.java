/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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

package com.zimbra.webClient.servlet;

import com.zimbra.common.localconfig.LC;
import com.zimbra.common.util.ZimbraLog;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class Forward extends ZCServlet {
    public static final String DEFAULT_FORWARD_URL = "/public/login.jsp";

    private static final String PARAM_FORWARD_URL = "fu";

    public void doGet(HttpServletRequest req, HttpServletResponse resp) {

        try {
            String url = getReqParameter(req, PARAM_FORWARD_URL, DEFAULT_FORWARD_URL);
            String qs = req.getQueryString();
            if (qs != null && !qs.equals("")) {
                url = url + "?" + qs;
            }
            ServletContext sc = getServletConfig().getServletContext();
            sc.getRequestDispatcher(url).forward(req, resp);
        } catch (Exception ex) {
            ZimbraLog.webclient.warn("exception forwarding", ex);
            if (!resp.isCommitted()) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    protected String getReqParameter(HttpServletRequest req, String paramName, String defaultValue) {

        String val = req.getParameter(paramName);

        if (val == null || val.isEmpty()) {
            return defaultValue;
        }

        if (PARAM_FORWARD_URL.equals(
                paramName) && LC.zimbra_forward_servlet_url_validation_enabled.booleanValue() && !isAllowedForwardUrl(
                val)) {
            throw new SecurityException("Forbidden forward URL: " + val);
        }

        return val;
    }

    private boolean isAllowedForwardUrl(String url) {
        if (url.length() > 2000) {
            return false;
        }
        if (containsBaselineRestrictedToken(url)) {
            return false;
        }
        String[] paths = getAllowedUrls().split(",");
        // after decoding url validate exact matches from allowed paths
        for (String p : paths) {
            if (url.equals(p.trim())) {
                return true;
            }
        }
        return false;
    }

    public String getAllowedUrls() {
        return LC.zimbra_forward_servlet_allowed_paths.value();
    }

    private boolean containsBaselineRestrictedToken(String value) {
        try {
            String decoded = URLDecoder.decode(value, StandardCharsets.UTF_8.name());
            decoded = decoded.toLowerCase();
            if (decoded.contains("..")) {
                return true;
            }
            if (decoded.contains("\\")) {
                return true;
            }
            return !decoded.startsWith("/");
        } catch (UnsupportedEncodingException e) {
            return true; // malformed encoding = reject
        }
    }
}
