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
package com.zimbra.webClient.build;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.taskdefs.Copy;
import org.mozilla.javascript.CompilerEnvirons;
import org.mozilla.javascript.ErrorReporter;
import org.mozilla.javascript.EvaluatorException;
import org.mozilla.javascript.Parser;

/**
 * Copy task that syntax checks JavaScript source files.
 *
 * @author Dan Villiom Podlaski Christiansen <dchristiansen@zimbra.com>
 */
public class JSCopyTask extends Copy
{
    /**
     * Adapter from Rhino errors to Ant logging & exceptions.
     */
    private ErrorReporter errorLogger = new ErrorReporter()
    {
        private void log(int msgLevel, String message, String sourceName,
                         int line, String lineSource, int lineOffset)
        {
            String levelstring =
                msgLevel == Project.MSG_ERR ? "error" : "warning";

            if (lineSource == null) {
                // no line source; output the message as-is
                String logmsg =
                    String.format("%s: %s: %s", sourceName, levelstring,
                                  message);

                JSCopyTask.this.log(logmsg, msgLevel);

            } else {
                // we have a source line; output the message, a long
                // with a helpful pointer to the location of the error,
                // or as close to it as Rhino tells us
                String logmsg =
                    String.format("%s:%d: %s: %s", sourceName, line + 1,
                                  levelstring, message);

                JSCopyTask.this.log(logmsg, msgLevel);

                // create a prefix containing tabs as-is, but ignore
                // possible double-width characters and Unicode
                // aggregates
                StringBuilder linePrefix = new StringBuilder();

                for (int i = 0; i < lineOffset - 1; i++) {
                    char c = lineSource.charAt(i);
                    linePrefix.append(Character.isWhitespace(c) ? c : ' ');
                }

                logmsg = String.format("%s\n%s^", lineSource, linePrefix);

                JSCopyTask.this.log(logmsg, Project.MSG_INFO);
            }

        }

        @Override
        public void error(String message, String sourceName, int line,
                          String lineSource, int lineOffset)
        {
            log(Project.MSG_ERR, message, sourceName, line, lineSource,
                lineOffset);
        }

        @Override
        public EvaluatorException runtimeError(String message,
                                               String sourceName, int line,
                                               String lineSource,
                                               int lineOffset)
        {
            error(message, sourceName, line, lineSource, lineOffset);

            return new EvaluatorException(message,
                                          sourceName,
                                          line,
                                          lineSource,
                                          lineOffset);
        }

        @Override
        public void warning(String message, String sourceName, int line,
                            String lineSource, int lineOffset)
        {
            log(Project.MSG_WARN, message, sourceName, line, lineSource,
                lineOffset);
        }
    };

    /**
     * Extension of the copy task file operations to check the
     * JavaScript syntax of all files ending in <code>.js</code>. We
     * process the files prior to copying them.
     */
    @Override
    protected void doFileOperations()
    {
        CompilerEnvirons env = new CompilerEnvirons();
        Parser parser = new Parser(env, errorLogger);
        boolean success = true;

        List<String> jsFiles = new ArrayList<>();

        for (Object k : fileCopyMap.keySet()) {
            String fileName = (String) k;

            if (fileName.endsWith(".js")) {
                jsFiles.add(fileName);
            }
        }

        if (!jsFiles.isEmpty()) {
            log("Checking " + jsFiles.size() +
                " JavaScript source files for syntax errors");
        }

        for (String fileName : jsFiles) {
            log("Checking " + fileName, this.verbosity);

            try {
                Reader reader =
                    Files.newBufferedReader(Paths.get(fileName),
                                            Charset.forName("UTF-8"));

                parser.parse(reader, fileName, 0);

            } catch (IOException exc) {
                // an error occurred reading the file...
                success = false;

                if (failonerror) {
                    throw new BuildException(exc, getLocation());
                }

            } catch (EvaluatorException exc) {
                // the parse failed; the Java stacktrace isn't terribly
                // useful, so suppress it
                String msg =
                    String.format("%s: %s", exc.sourceName(), exc.getMessage());

                success = false;
                log(msg, Project.MSG_VERBOSE);
            }
        }

        if (!success && failonerror) {
            throw new BuildException("Syntax check failed.", getLocation());
        }

        super.doFileOperations();
    }
}
