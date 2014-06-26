/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2013, 2014 Zimbra, Inc.
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

import java.io.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class Props2JsServlet extends com.zimbra.kabuki.servlets.Props2JsServlet {

	//
	// Constants
	//

	protected static final String P_SKIN = "skin";
	protected static final String A_SKIN = P_SKIN;

	//
	// Protected methods
	//

	protected String getSkin(HttpServletRequest req) {
		String skin = (String)req.getAttribute(A_SKIN);
		if (skin == null) {
			skin = req.getParameter(P_SKIN);
		}
        if (skin != null) {
            skin = skin.replaceAll("[^A-Za-z0-9]", "");
        }
		return skin;
	}

	//
	// com.zimbra.kabuki.servlets.Props2JsServlet methods
	//

	protected String getRequestURI(HttpServletRequest req) {
		return this.getSkin(req) + super.getRequestURI(req);
	}

	protected List<String> getBasenamePatternsList(HttpServletRequest req) {
		List<String> list = super.getBasenamePatternsList(req);
		String skin = this.getSkin(req);
		String patterns = "skins/"+skin+"/messages/${name},skins/"+skin+"/keys/${name}";
		list.add(patterns);
		return list;
	};

	//
	// com.zimbra.kabuki.servlets.Props2JsServlet methods
	//

	protected boolean isWarnEnabled() {
		return ZimbraLog.webclient.isWarnEnabled();
	}
	protected boolean isErrorEnabled() {
		return ZimbraLog.webclient.isErrorEnabled();
	}
	protected boolean isDebugEnabled() {
		return ZimbraLog.webclient.isDebugEnabled();
	}

	protected void warn(String message) {
		ZimbraLog.webclient.warn(message);
	}
	protected void error(String message) {
		ZimbraLog.webclient.error(message);
	}
	protected void debug(String message) {
		ZimbraLog.webclient.debug(message);
	}

} // class Props2JsServlet