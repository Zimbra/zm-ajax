/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Server
 * Copyright (C) 2014 Zimbra, Inc
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software Foundation,
 * version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.webClient.servlet;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.zimbra.common.service.ServiceException;
import com.zimbra.common.util.FileUtil;
import com.zimbra.common.util.StringUtil;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.AuthTokenException;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.account.ZimbraAuthToken;
import com.zimbra.cs.service.ExternalUserProvServlet;
import com.zimbra.cs.service.admin.FlushCache;
import com.zimbra.cs.util.SkinUtil;
import com.zimbra.cs.util.WebClientL10nUtil;
import com.zimbra.cs.util.WebClientServiceUtil;
import com.zimbra.cs.zimlet.ZimletFile;
import com.zimbra.cs.zimlet.ZimletUtil;

/**
 *
 * Servlet to handle requests from service webapp
 *
 */
public class ServiceServlet extends HttpServlet {

    private static final long serialVersionUID = 4025485927134616176L;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String authTokenEncoded = req.getHeader(WebClientServiceUtil.PARAM_AUTHTOKEN);
        try {
            AuthToken authToken = ZimbraAuthToken.getAuthToken(authTokenEncoded);
            if (authToken.isRegistered() && !authToken.isExpired()) {
                String path = req.getPathInfo();
                if ("/loadskins".equals(path)) {
                    doLoadSkins(req, resp);
                } else if ("/flushskins".equals(path)) {
                    doFlushSkins(req, resp);
                } else if ("/loadlocales".equals(path)) {
                    doLoadLocales(req, resp);
                } else if ("/flushuistrings".equals(path)) {
                    doFlushUistrings(req, resp);
                } else if ("/flushzimlets".equals(path)) {
                    doFlushZimlets(req, resp);
                } else if ("/extuserprov".equals(path)) {
                    doExtUserProv(req, resp);
                } else if ("/publiclogin".equals(path)) {
                    doPublicLoginProv(req, resp);
                } else {
                    resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
                    return;
                }
                resp.setStatus(HttpServletResponse.SC_OK);
                return;
            } else {
                ZimbraLog.webclient.warn("AuthToken is not valid");
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } catch (ServiceException e) {
            ZimbraLog.webclient.error(e);
        } catch (AuthTokenException e) {
            ZimbraLog.webclient.error(e);
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String authTokenEncoded = req.getHeader(WebClientServiceUtil.PARAM_AUTHTOKEN);
        try {
            AuthToken authToken = ZimbraAuthToken.getAuthToken(authTokenEncoded);
            if (authToken.isRegistered() && !authToken.isExpired()) {
                String path = req.getPathInfo();
                if ("/deployzimlet".equals(path)) {
                    doDeployZimlet(req, resp);
                } else if ("/undeployzimlet".equals(path)) {
                    doUndeployZimlet(req, resp);
                } else {
                    resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
                    return;
                }
                resp.setStatus(HttpServletResponse.SC_OK);
                return;
            } else {
                ZimbraLog.webclient.warn("AuthToken is not valid");
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } catch (AuthTokenException e) {
            ZimbraLog.webclient.error(e);
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        } catch (Exception e) {
            ZimbraLog.webclient.error(e);
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    private void doFlushUistrings(HttpServletRequest req, HttpServletResponse resp) throws ServiceException, ServletException, IOException {
        String mailURL = Provisioning.getInstance().getLocalServer().getMailURL();
        RequestDispatcher dispatcher = this.getServletContext().getContext(mailURL).getRequestDispatcher(FlushCache.RES_AJXMSG_JS);
        ZimbraLog.misc.debug("flushCache: sending flush request");
        req.setAttribute(FlushCache.FLUSH_CACHE, Boolean.TRUE);
        dispatcher.include(req, resp);

        dispatcher = this.getServletContext().getContext("/zimbraAdmin").getRequestDispatcher(FlushCache.RES_AJXMSG_JS);
        ZimbraLog.misc.debug("flushCache: sending flush request to zimbraAdmin");
        req.setAttribute(FlushCache.FLUSH_CACHE, Boolean.TRUE);
        dispatcher.include(req, resp);
    }

    private void doLoadSkins(HttpServletRequest req, HttpServletResponse resp) throws ServiceException, IOException {
        List<String> skins = new ArrayList<>();
        SkinUtil.loadSkinsByDiskScan(skins);
        String[] sortedSkins = skins.toArray(new String[skins.size()]);
        Arrays.sort(sortedSkins);
        resp.getOutputStream().write(StringUtil.join(",", sortedSkins).getBytes());
    }

    private void doFlushSkins(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException, ServiceException {
        String mailURL = Provisioning.getInstance().getLocalServer().getMailURL();
        RequestDispatcher dispatcher = this.getServletContext().getContext(mailURL).getRequestDispatcher(FlushCache.JS_SKIN_JS);
        ZimbraLog.misc.debug("flushCache: sending flush request");
        req.setAttribute(FlushCache.FLUSH_CACHE, Boolean.TRUE);
        dispatcher.include(req, resp);
    }

    private void doLoadLocales(HttpServletRequest req, HttpServletResponse resp) throws ServiceException, IOException {
        WebClientL10nUtil.loadBundlesByDiskScan();
        Set<Locale> availableLocales = WebClientL10nUtil.getAvailableLocales();
        boolean isFirst = true;
        for (Locale locale : availableLocales) {
            if (!isFirst) {
                resp.getOutputStream().write(",".getBytes());
            }
            resp.getOutputStream().write(locale.toString().getBytes());
            isFirst = false;
        }
    }

    private void doFlushZimlets(HttpServletRequest req, HttpServletResponse resp) {
        ZimletUtil.flushAllZimletsCache();
    }

    private void doDeployZimlet(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        String zimletName = req.getHeader(ZimletUtil.PARAM_ZIMLET);
        ZimbraLog.zimlet.info("deploying zimlet %s", zimletName);
        ZimletFile zf = new ZimletFile(zimletName, req.getInputStream());
        ZimletUtil.deployZimletLocally(zf);
        ZimbraLog.zimlet.info("deployed zimlet %s", zimletName);
    }

    private void doUndeployZimlet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String zimletName = req.getHeader(ZimletUtil.PARAM_ZIMLET);
        ZimbraLog.zimlet.info("undeploying zimlet %s", zimletName);
        File zimletDir = ZimletUtil.getZimletRootDir(zimletName);
        FileUtil.deleteDir(zimletDir);
        ZimbraLog.zimlet.info("zimlet directory %s is deleted", zimletDir.getName());
    }

    private void doExtUserProv(HttpServletRequest req, HttpServletResponse resp) throws ServiceException, ServletException, IOException {
        String extUserEmail = req.getHeader("extuseremail");
        String param = req.getHeader("ZM_PRELIM_AUTH_TOKEN");
        resp.addCookie(new Cookie("ZM_PRELIM_AUTH_TOKEN", param));
        req.setAttribute("extuseremail", extUserEmail);
        String mailURL = Provisioning.getInstance().getLocalServer().getMailURL();
        RequestDispatcher dispatcher = this.getServletContext().getContext(mailURL).getRequestDispatcher(ExternalUserProvServlet.PUBLIC_EXTUSERPROV_JSP);
        ZimbraLog.misc.debug("ExternalUserProvServlet: sending extuserprov request");
        dispatcher.forward(req, resp);
    }

    private void doPublicLoginProv(HttpServletRequest req, HttpServletResponse resp) throws ServiceException, ServletException, IOException {
        String mailURL = Provisioning.getInstance().getLocalServer().getMailURL();
        String vacctdomain = req.getHeader("virtualacctdomain");
        req.setAttribute("virtualacctdomain", vacctdomain);
        RequestDispatcher dispatcher = this.getServletContext().getContext(mailURL).getRequestDispatcher(ExternalUserProvServlet.PUBLIC_LOGIN_JSP);
        ZimbraLog.misc.debug("ExternalUserProvServlet: sending publc login request");
        dispatcher.forward(req, resp);
    }

}
