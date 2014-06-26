/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014 Zimbra, Inc.
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

import com.zimbra.common.util.ZimbraLog;
import com.zimbra.cs.taglib.ZJspSession;
import com.zimbra.client.ZMailbox;

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

/**
 * This class sub-classes the Jasper JspServlet in order to override
 * the context class loader. This is done so that we can transparently
 * merge skin message files into the default ones allowing skins to
 * independently override messages; JSP authors continue to use the
 * same mechanisms to load and format messages in JSP pages without
 * having to care about how the skin messages are overloaded.
 *
 * @author Andy Clark
 * Note: The above mentioned logic has been moved to I18nUtil.java
 * since we want to avoid overriding of context class loader for all
 * jsp pages.
 */
public class JspServlet extends org.apache.jasper.servlet.JspServlet {

	//
	// Servlet methods
	//

	public void service(ServletRequest request, ServletResponse response)
	throws IOException, ServletException {
		// set custom class loader
//		Thread thread = Thread.currentThread();
//		ClassLoader oLoader = thread.getContextClassLoader();
//		ClassLoader nLoader = new ResourceLoader(oLoader, this, request, response);
//		thread.setContextClassLoader(nLoader);

		// default processing
		try {
			super.service(request, response);
		}

		// restore previous class loader
		finally {
//			thread.setContextClassLoader(oLoader);
		}
	}
} // class JspServlet
