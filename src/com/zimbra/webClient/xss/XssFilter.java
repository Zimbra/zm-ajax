/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2008, 2010 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.3 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 */
package com.zimbra.webClient.xss;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by IntelliJ IDEA.
 * User: rajendra
 * Date: Aug 19, 2008
 * Time: 10:38:10 AM
 * To change this template use File | Settings | File Templates.
 */
public class XssFilter implements Filter {

    private FilterConfig filterConfig;

    public void init(FilterConfig filterConfig) throws
            ServletException {
        System.out.println("XSS Filter initialized");
        this.filterConfig = filterConfig;
    }


    public void destroy() {

        System.out.println("XSS Filter destroyed");

        this.filterConfig = null;

    }


    public void doFilter(ServletRequest request, ServletResponse response,

                         FilterChain chain)

            throws IOException, ServletException {

        chain.doFilter(new XssRequestWrapper((HttpServletRequest) request), response);

    }
}
