/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014 Zimbra, Inc.
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

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import com.zimbra.common.service.ServiceException;
import com.zimbra.cs.account.Provisioning;
import com.zimbra.cs.account.Server;
import com.zimbra.cs.consul.CatalogRegistration;
import com.zimbra.cs.consul.ConsulClient;
import com.zimbra.cs.consul.ConsulServiceLocator;
import com.zimbra.cs.consul.ServiceLocator;
import com.zimbra.cs.consul.ZimbraServiceNames;


/**
 * The WebServlet and WebAdminServlet servlets are used as a central place to hook
 * lifecycle events for these two webapps. This creates a place to perform Service Locator integration.
 */
@SuppressWarnings("serial")
public class WebAdminServlet extends HttpServlet {
    protected ServiceLocator serviceLocator;
    protected String serviceID;

    public WebAdminServlet() {
        super ();
    }

    @Override
    public void init() throws ServletException {
        super.init();
        ConsulClient consulClient = new ConsulClient();
        serviceLocator = new ConsulServiceLocator(consulClient);
        registerWithServiceLocator();
    }

    @Override
    public void destroy() {
        deregisterWithServiceLocator();
        super.destroy();
    }

    /**
     * Register with service locator.
     *
     * @see https://www.consul.io/docs/agent/http.html#_v1_catalog_register
     */
    protected void registerWithServiceLocator() throws ServletException {

        try {
            // Read protocol and port configuration
            Server localServer = Provisioning.getInstance().getLocalServer();
            String schemePrefix = localServer.getAdminServiceScheme();
            int httpsPort = localServer.getAdminPort();

            // Register https endpoint
            if ("https://".equals(schemePrefix)) {
                serviceID = registerWithServiceLocator(ZimbraServiceNames.WEBADMIN, httpsPort, "https");
            }
        } catch (ServiceException e) {
            throw new ServletException("Failed reading provisioning config before registering with service locator", e);
        }
    }

    protected String registerWithServiceLocator(String serviceName, int port, String checkScheme) {
        String serviceID = serviceName + ":" + port;
        CatalogRegistration.Service service = new CatalogRegistration.Service(serviceID, serviceName, port);
        if ("https".equals(checkScheme)) {
            service.tags.add("ssl");
        }
        String url = checkScheme + "://localhost:" + port + "/zimbraAdmin/";
        CatalogRegistration.Check check = new CatalogRegistration.Check(serviceID + ":health", serviceName);
        check.script = "/opt/zimbra/libexec/zmhealthcheck-webadmin " + url;
        check.interval = "1m";
        service.check = check;
        serviceLocator.registerSilent(service);
        return serviceID;
    }

    /**
     * De-register with service locator.
     *
     * @see https://www.consul.io/docs/agent/http.html#_v1_catalog_deregister
     */
    protected void deregisterWithServiceLocator() {
        if (serviceID != null) {
            serviceLocator.deregisterSilent(serviceID);
            serviceID = null;
        }
    }
}
