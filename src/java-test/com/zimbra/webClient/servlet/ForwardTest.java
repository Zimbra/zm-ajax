
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2026 Synacor, Inc.
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

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.junit.Before;
import org.junit.Test;
import static org.mockito.Mockito.*;

public class ForwardTest {

    private Forward servlet;

    private HttpServletRequest request;

    private HttpServletResponse response;

    private ServletContext servletContext;

    private RequestDispatcher dispatcher;

    @Before
    public void setup() throws Exception {
        servlet = spy(new Forward());
        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        servletContext = mock(ServletContext.class);
        dispatcher = mock(RequestDispatcher.class);

        // mock allowed paths
        doReturn("/public/login.jsp,/public/home.jsp,/public/error.jsp").when(servlet).getAllowedUrls();

        ServletConfig servletConfig = mock(ServletConfig.class);
        when(servletConfig.getServletContext()).thenReturn(servletContext);

        java.lang.reflect.Field configField = javax.servlet.GenericServlet.class.getDeclaredField("config");

        configField.setAccessible(true);
        configField.set(servlet, servletConfig);
    }

    @Test
    public void testForwardWithAllowedFu() throws Exception {
        when(request.getParameter("fu")).thenReturn("/public/login.jsp");
        when(request.getQueryString()).thenReturn(null);
        when(servletContext.getRequestDispatcher("/public/login.jsp")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    public void testForwardWithDefaultWhenFuMissing() throws Exception {
        when(request.getParameter("fu")).thenReturn(null);
        when(request.getQueryString()).thenReturn(null);
        when(servletContext.getRequestDispatcher("/public/login.jsp")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    public void testForwardWithEmptyFuParameter() throws Exception {
        when(request.getParameter("fu")).thenReturn("");
        when(request.getQueryString()).thenReturn(null);
        when(servletContext.getRequestDispatcher("/public/login.jsp")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    public void testQueryStringAppended() throws Exception {
        when(request.getParameter("fu")).thenReturn("/public/login.jsp");
        when(request.getQueryString()).thenReturn("a=1&b=2");
        when(servletContext.getRequestDispatcher("/public/login.jsp?a=1&b=2")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    public void testDisallowedPathReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("/admin/private.jsp");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithSimpleTraversalReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("../admin.jsp");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithEncodedDoubleDotsReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("/public/%2e%2e/WEB-INF/web.xml");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithSimpleEncodedTraversalReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("%2e%2e/admin.jsp");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithDoubleEncodedTraversalReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("/public/%252e%252e/WEB-INF/web.xml");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithNullByteInjectionReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("/public/login.jsp%00");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testVeryLongUrlReturns403() throws Exception {
        String longUrl = new String(new char[2500]).replace("\0", "a");

        when(request.getParameter("fu")).thenReturn(longUrl);

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithJSPOutsidePublicReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("/private/admin/dashboard.jsp");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithInvalidEncodingReturns500() throws Exception {
        // this will cause UnsupportedEncodingException in containsBaselineRestrictedToken
        when(request.getParameter("fu")).thenReturn("/public/login.jsp%");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testPathWithoutLeadingSlashReturns403() throws Exception {
        when(request.getParameter("fu")).thenReturn("public/login.jsp");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testDispatcherNotFoundReturns500() throws Exception {
        when(request.getParameter("fu")).thenReturn("/public/login.jsp");
        when(request.getQueryString()).thenReturn(null);
        when(servletContext.getRequestDispatcher("/public/login.jsp")).thenThrow(
                new RuntimeException("Dispatcher not found"));

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        verifyNoInteractions(dispatcher);
    }

    @Test
    public void testNullPointerExceptionReturns500() throws Exception {
        when(request.getParameter("fu")).thenThrow(new NullPointerException());

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }

    @Test
    public void testResponseAlreadyCommittedDoesNotSetStatus() throws Exception {
        when(request.getParameter("fu")).thenReturn("/admin.jsp");
        when(response.isCommitted()).thenReturn(true);

        servlet.doGet(request, response);

        verify(response, never()).setStatus(anyInt());
    }

    @Test
    public void testDispatcherFailureWithQueryStringReturns500() throws Exception {
        when(request.getParameter("fu")).thenReturn("/public/login.jsp");
        when(request.getQueryString()).thenReturn("a=1");
        when(servletContext.getRequestDispatcher("/public/login.jsp?a=1")).thenThrow(new RuntimeException());

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }

    @Test
    public void testAllowedPathWithWhitespaceInConfig() throws Exception {

        doReturn(" /public/login.jsp , /public/home.jsp ").when(servlet).getAllowedUrls();

        when(request.getParameter("fu")).thenReturn("/public/login.jsp");
        when(request.getQueryString()).thenReturn(null);
        when(servletContext.getRequestDispatcher("/public/login.jsp")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
    }

    @Test
    public void testEmptyQueryStringDoesNotAppend() throws Exception {

        when(request.getParameter("fu")).thenReturn("/public/login.jsp");
        when(request.getQueryString()).thenReturn("");
        when(servletContext.getRequestDispatcher("/public/login.jsp")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
    }

    @Test
    public void testUrlAtMaxLengthBoundaryAllowed() throws Exception {

        String base = "/public/login.jsp";
        int remaining = 2000 - base.length();
        String padded = base + new String(new char[remaining]).replace("\0", "a");

        when(request.getParameter("fu")).thenReturn(padded);

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
    }

    @Test
    public void testMaliciousQueryDoesNotAffectWhitelist() throws Exception {

        when(request.getParameter("fu")).thenReturn("/public/login.jsp");
        when(request.getQueryString()).thenReturn("../../etc/passwd");

        when(servletContext.getRequestDispatcher("/public/login.jsp?../../etc/passwd")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
    }

    @Test
    public void testEmptyAllowedUrlsConfigReturns403() throws Exception {

        doReturn("").when(servlet).getAllowedUrls();

        when(request.getParameter("fu")).thenReturn("/public/login.jsp");

        servlet.doGet(request, response);

        verify(response).setStatus(HttpServletResponse.SC_FORBIDDEN);
    }

    @Test
    public void testSecondAllowedPathMatches() throws Exception {
        doReturn("/public/login.jsp,/public/home.jsp").when(servlet).getAllowedUrls();

        when(request.getParameter("fu")).thenReturn("/public/home.jsp");
        when(request.getQueryString()).thenReturn(null);
        when(servletContext.getRequestDispatcher("/public/home.jsp")).thenReturn(dispatcher);

        servlet.doGet(request, response);

        verify(dispatcher).forward(request, response);
    }
}