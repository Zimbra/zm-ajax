package com.zimbra.webClient.filters;

import java.io.*;
import java.util.*;
import java.util.regex.*;
import javax.servlet.*;
import javax.servlet.http.*;

import com.zimbra.common.util.ZimbraLog;

public class SetHelpFileContentTypeFilter implements Filter {

    //
    // Constants
    //
    private static final String P_EXTENSIONS = "exts";
    private static final String P_MIME_TYPES = "types";

    private static final String A_MIME_TYPE = SetHelpFileContentTypeFilter.class.getName()+":mime-type";


    //
    // Data
    //


    private List<ExtensionFilter> filters;

    //
    // Filter methods
    //

    public void init(FilterConfig config) throws ServletException {
        this.filters = createFiltersFor(config.getInitParameter(P_EXTENSIONS), config.getInitParameter(P_MIME_TYPES));
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
    throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest)request;
        HttpServletResponse httpResponse = (HttpServletResponse)response;

        String uri = httpRequest.getRequestURI();
        for (ExtensionFilter filter : this.filters) {
            if (filter.accept(null, uri)) {
                httpResponse.setHeader("Content-Type", filter.getType());
            }
        }

        chain.doFilter(request, response);
    }

    public void destroy() {
    }


    private static List<ExtensionFilter> createFiltersFor(String exts, String types) {
        List<ExtensionFilter> filters = new LinkedList<ExtensionFilter>();
        StringTokenizer tokenizer = new StringTokenizer(exts, ",");
        StringTokenizer tokenizer2 = new StringTokenizer(types != null ? types : "", ",");
        while (tokenizer.hasMoreTokens()) {
            String ext = tokenizer.nextToken().trim();
            String type = tokenizer2.hasMoreTokens() ? tokenizer2.nextToken() : null;
            filters.add(new ExtensionFilter(ext, type));
        }
        return filters;
    }

    //
    // Classes
    //

    static class ExtensionFilter implements FilenameFilter {
        // Data
        private String ext;
        private String type;
        // Constructors
        public ExtensionFilter(String ext, String type) {
            this.ext = ext.toLowerCase();
            this.type = type;
        }
        // Public methods
        public String getType() { return type; }
        // FilenameFilter methods
        public boolean accept(File dir, String filename) {
            return filename.toLowerCase().endsWith(this.ext);
        }
    }

} // class SetHelpFileContentTypeFilter
