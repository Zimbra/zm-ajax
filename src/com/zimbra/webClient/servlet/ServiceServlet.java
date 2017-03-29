/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014, 2016 Synacor, Inc.
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
import com.zimbra.common.soap.SoapProtocol;
import com.zimbra.common.util.FileUtil;
import com.zimbra.common.util.StringUtil;
import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.account.AuthToken;
import com.zimbra.cs.account.AuthTokenException;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.account.Server;
import com.zimbra.cs.account.ZimbraAuthToken;
import com.zimbra.cs.account.Zimlet;
import com.zimbra.cs.ephemeral.EphemeralStore;
import com.zimbra.cs.extension.ExtensionUtil;
import com.zimbra.cs.account.accesscontrol.AdminRight;
import com.zimbra.cs.account.accesscontrol.PermissionCache;
import com.zimbra.cs.account.accesscontrol.RightManager;
import com.zimbra.cs.account.accesscontrol.Rights.Admin;
import com.zimbra.cs.service.ExternalUserProvServlet;
import com.zimbra.cs.service.admin.AdminAccessControl;
import com.zimbra.cs.service.admin.FlushCache;
import com.zimbra.cs.util.SkinUtil;
import com.zimbra.cs.util.WebClientL10nUtil;
import com.zimbra.cs.util.WebClientServiceUtil;
import com.zimbra.cs.zimlet.ZimletException;
import com.zimbra.cs.zimlet.ZimletFile;
import com.zimbra.cs.zimlet.ZimletUtil;
import com.zimbra.soap.ZimbraSoapContext;

/**
 *
 * Servlet to handle requests from service webapp
 *
 */
public class ServiceServlet extends HttpServlet {

    private static final long serialVersionUID = 4025485927134616176L;

    @Override
    public void init() throws ServletException {
        String ephemeralStoreURL;
        try {
            RightManager.getInstance();
            ephemeralStoreURL = Provisioning.getInstance().getConfig().getEphemeralBackendURL();
            if(ephemeralStoreURL != null) {
                String[] tokens = ephemeralStoreURL.split(":");
                if (tokens != null && tokens.length > 0) {
                    String backend = tokens[0];
                    if(!backend.equalsIgnoreCase("ldap")) {
                        ZimbraLog.webclient.info("Will attempt to load server extensions to handle ephemeral backend %s", backend);
                        ExtensionUtil.initAllMatching(new EphemeralStore.EphemeralStoreMatcher(backend));
                    } else {
                        ZimbraLog.webclient.info("Using LDAP backend. Will skip loading server extensions.");
                    }
                }
            }
        } catch (Exception e) {
            ZimbraLog.webclient.error("Failed to initialize ServiceServlet. Ignoring", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String authTokenEncoded = req.getHeader(WebClientServiceUtil.PARAM_AUTHTOKEN);
        if(authTokenEncoded == null || authTokenEncoded.isEmpty()) {
            ZimbraLog.webclient.warn("AuthToken is missing");
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        try {
            AuthToken authToken = ZimbraAuthToken.getAuthToken(authTokenEncoded);
            if (authToken != null && authToken.isRegistered() && !authToken.isExpired()) {
                String path = req.getPathInfo();
                if ("/loadskins".equals(path)) {
                    //this operation does not require an admin permission. It can be triggered by a user login.
                    doLoadSkins(req, resp);
                } else if ("/flushskins".equals(path)) {
                    checkAdminRight(req, authToken, Admin.R_flushCache);
                    doFlushSkins(req, resp);
                } else if ("/loadlocales".equals(path)) {
                    //this operation does not require an admin permission. It can be triggered by a user login.
                    doLoadLocales(req, resp);
                } else if ("/flushuistrings".equals(path)) {
                    checkAdminRight(req, authToken, Admin.R_flushCache);
                    doFlushUistrings(req, resp);
                } else if ("/flushzimlets".equals(path)) {
                    checkAdminRight(req, authToken, Admin.R_flushCache);
                    doFlushZimlets(req, resp);
                } else if ("/extuserprov".equals(path)) {
                    //ZM_PRELIM_AUTH_TOKEN token is validated downstream. Opens a JSP with registration form.
                    doExtUserProv(req, resp);
                } else if ("/publiclogin".equals(path)) {
                    //this operation loads a JSP with login form for public login.
                    doPublicLoginProv(req, resp);
                } else if ("/flushacl".equals(path)) {
                    //only automated tests need to flush ACL cache in /zimbra app.
                    //this call invalidates all LDAP entry caches where the ACL is cached.
                    if(authToken.isAdmin()) {
                        PermissionCache.invalidateAllCache();
                    } else {
                        ZimbraLog.webclient.warn("Only global admin is allowed to access %s", path);
                        resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                        return;
                    }
                } else {
                    ZimbraLog.webclient.warn("Unrecognized request %s", path);
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
            if(ServiceException.PERM_DENIED.equals(e.getCode())) {
                ZimbraLog.webclient.error(e);
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } else {
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ZimbraLog.webclient.error("Unexpected ServiceException while processing GET request: %s. %s", e.getCode(), e.getMessage(), e);
                return;
            }
        } catch (AuthTokenException e) {
            ZimbraLog.webclient.error(e);
            resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ZimbraLog.webclient.error("Encountered an unexpected exception while processing GET request", e);
            return;
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String authTokenEncoded = req.getHeader(WebClientServiceUtil.PARAM_AUTHTOKEN);
        try {
            AuthToken authToken = ZimbraAuthToken.getAuthToken(authTokenEncoded);
            if (authToken.isRegistered() && !authToken.isExpired()) {
                String path = req.getPathInfo();
                if ("/deployzimlet".equals(path)) {
                    if(!authToken.isAdmin()) {
                        checkAdminRight(req, authToken, Admin.R_deployZimlet);
                    }
                    doDeployZimlet(req, resp, authToken);
                } else if ("/undeployzimlet".equals(path)) {
                    if(!authToken.isAdmin()) {
                        checkAdminRight(req, authToken, Admin.R_deployZimlet);
                    }
                    doUndeployZimlet(req, resp, authToken);
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
            return;
        } catch (ZimletException e) {
            ZimbraLog.webclient.error(e);
            resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        } catch (ServiceException e) {
            if(ServiceException.PERM_DENIED.equals(e.getCode())) {
                ZimbraLog.webclient.error(e);
                resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            } else {
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                ZimbraLog.webclient.error("Unexpected ServiceException while processing POST request: %s. %s", e.getCode(), e.getMessage(), e);
                return;
            }
        } catch (Exception e) {
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ZimbraLog.webclient.error("Encountered an unexpected exception while processing POST request", e);
            return;
        }
    }

    private void checkAdminRight(HttpServletRequest req, AuthToken at, AdminRight permission) throws ServiceException {
        if(permission == null) {
            ZimbraLog.webclient.error("cannot check null permission");
            throw ServiceException.FAILURE("permission object is NULL", null);
        } else {
            ZimbraLog.webclient.info("checking %s admin permission on local server", permission.getName());
        }
        Server server = Provisioning.getInstance().getLocalServer();
        ZimbraSoapContext zsc = new ZimbraSoapContext(at, at.getAccountId(), SoapProtocol.SoapJS, SoapProtocol.SoapJS);
        AdminAccessControl aac = AdminAccessControl.getAdminAccessControl(zsc);
        aac.checkRight(server, permission);
    }

    private void doFlushUistrings(HttpServletRequest req, HttpServletResponse resp) throws ServiceException, ServletException, IOException {
        String mailURL = Provisioning.getInstance().getLocalServer().getMailURL();
        RequestDispatcher dispatcher = this.getServletContext().getContext(mailURL).getRequestDispatcher(FlushCache.RES_AJXMSG_JS);
        ZimbraLog.webclient.debug("flushCache: sending flush request");
        req.setAttribute(FlushCache.FLUSH_CACHE, Boolean.TRUE);
        dispatcher.include(req, resp);

        dispatcher = this.getServletContext().getContext("/zimbraAdmin").getRequestDispatcher(FlushCache.RES_AJXMSG_JS);
        ZimbraLog.webclient.debug("flushCache: sending flush request to zimbraAdmin");
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
        ZimbraLog.webclient.debug("flushCache: sending flush request");
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

    private void doDeployZimlet(HttpServletRequest req, HttpServletResponse resp, AuthToken authToken) throws Exception {
        String zimletName = req.getHeader(ZimletUtil.PARAM_ZIMLET);
        ZimbraLog.zimlet.info("deploying zimlet %s", zimletName);
        ZimletFile zf = new ZimletFile(zimletName, req.getInputStream());
        if(zf.getZimletDescription().isExtension() && !authToken.isAdmin()) {
            throw ServiceException.PERM_DENIED("Only global admins are allowed to deploy extensions for Zimbra Admin UI");
        }
        ZimletUtil.deployZimletLocally(zf);
        ZimbraLog.zimlet.info("deployed zimlet %s", zimletName);
    }

    private void doUndeployZimlet(HttpServletRequest req, HttpServletResponse resp, AuthToken authToken) throws IOException, ZimletException, ServiceException {
        String zimletName = req.getHeader(ZimletUtil.PARAM_ZIMLET);
        Zimlet z = Provisioning.getInstance().getZimlet(zimletName);
        if(z != null && z.isExtension() && !authToken.isAdmin()) {
            throw ServiceException.PERM_DENIED("Only global admins are allowed to undeploy extensions for Zimbra Admin UI");
        } else if (z == null) {
            ZimbraLog.zimlet.info("%s has already been deleted from LDAP. Cleaning up.", zimletName);
        }
        ZimbraLog.zimlet.info("deleting zimlet %s from disk", zimletName);
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
        ZimbraLog.webclient.debug("ExternalUserProvServlet: sending extuserprov request");
        dispatcher.forward(req, resp);
    }

    private void doPublicLoginProv(HttpServletRequest req, HttpServletResponse resp) throws ServiceException, ServletException, IOException {
        String mailURL = Provisioning.getInstance().getLocalServer().getMailURL();
        String vacctdomain = req.getHeader("virtualacctdomain");
        req.setAttribute("virtualacctdomain", vacctdomain);
        RequestDispatcher dispatcher = this.getServletContext().getContext(mailURL).getRequestDispatcher(ExternalUserProvServlet.PUBLIC_LOGIN_JSP);
        ZimbraLog.webclient.debug("ExternalUserProvServlet: sending publc login request");
        dispatcher.forward(req, resp);
    }
}
