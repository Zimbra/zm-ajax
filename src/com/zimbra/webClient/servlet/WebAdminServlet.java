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

import com.zimbra.cs.consul.CatalogRegistration;
import com.zimbra.cs.consul.ConsulClient;
import com.zimbra.cs.consul.ConsulServiceLocator;
import com.zimbra.cs.consul.ServiceLocator;


/**
 * The WebServlet and WebAdminServlet servlets are used as a central place to hook
 * lifecycle events for these two webapps. This creates a place to perform Service Locator integration.
 */
@SuppressWarnings("serial")
public class WebAdminServlet extends HttpServlet {
    protected ServiceLocator serviceLocator;

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

    protected CatalogRegistration.Service getServiceLocatorService() {
        String name = "zimbra:webAdmin";
        int port = 7071; // TODO read from java:comp/env in production (see ZCServlet static init)
        String id = name + ":" + port;
        CatalogRegistration.Service service = new CatalogRegistration.Service(id, name, port);
        // TODO tag service with http/https read from java:comp/env in production (see ZCServlet static init)

        String url = "https://localhost:" + port + "/zimbraAdmin/";
        CatalogRegistration.Check check = new CatalogRegistration.Check(id + ":health", name);
        check.script = "/opt/zimbra/libexec/zmhealthcheck-webadmin " + url;
        check.interval = "1m";

        return service;
    }

    /**
     * Register with service locator.
     *
     * @see https://www.consul.io/docs/agent/http.html#_v1_catalog_register
     */
    protected CatalogRegistration.Service registerWithServiceLocator() {
        CatalogRegistration.Service serviceLocatorService = getServiceLocatorService();
        serviceLocator.registerSilent(serviceLocatorService);
        return serviceLocatorService;
    }

    /**
     * De-register with service locator.
     *
     * @see https://www.consul.io/docs/agent/http.html#_v1_catalog_deregister
     */
    protected void deregisterWithServiceLocator() {
        serviceLocator.deregisterSilent(getServiceLocatorService().id);
    }
}
