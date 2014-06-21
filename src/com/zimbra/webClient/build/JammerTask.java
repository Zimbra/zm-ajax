/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2004, 2005, 2006, 2007, 2009, 2010, 2013 Zimbra, Inc.
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

import org.apache.tools.ant.*;
import org.apache.tools.ant.types.*;


import java.io.*;
import java.util.*;

public class JammerTask extends Task {
    /**
     * Directory that will map  to the webroot
     */
    private File webrootDir;
    /**
     * Name of the web application when deployed
     */
    private String webappName;
    /**
     * List of fileLists set in the build.xml file.
     */
    private List<JammerFiles> fileLists;
    /**
     * Destination target for this jammer task.
     */
    private File destFile;
    
    /**
     * @constructor
     * No argument constructor.
     */
    public JammerTask() {
        // nothing for right now
        // probably need some initialization of default root directory
        // Default for directories, is the directory we are working in.
        this.webrootDir = new File(".");
        this.webappName = null;
        this.fileLists = new LinkedList<JammerFiles>();
        this.destFile = null;
    }

    /**
     * Internal utility method
     * @param message - message to log.
     */
    private void logDebug(String message){
        this.log(message, Project.MSG_DEBUG);
    }
    
    /**
     * execute handles the task itself
     * 
     * @throws BuildException
     */
    public void execute() throws BuildException {
        this.logDebug("============= Jammer task START====================");
        try {
            // check for valid directories
            if (!this.webrootDir.isDirectory()) {
                throw new BuildException(this.webrootDir
                        + "is not a valid directory");
            }
            Jammer jammer = new Jammer(this.destFile, this, this.webrootDir.toString(), 
                                       this.webappName);
            this.log("Jamming to "+this.destFile);
            Project project = this.getProject();
            for (JammerFiles fileList : this.fileLists){
                File dir = fileList.getDir(project);
                String[] filenames = fileList.getFiles(project);
                for (String filename : filenames) {
                    File file = new File(dir, filename);
                    jammer.parse(file);
                }
            }
            jammer.concatFiles();
        } catch (JammerException je){
            je.printStackTrace();
            throw new BuildException(je);
        } catch (Throwable t) {
            t.printStackTrace();
            throw new BuildException(t);
        }
        this.logDebug("================ Jammer task DONE===================");

    }
    
    // --------------------------------------------------------------
    // Access methods
    // --------------------------------------------------------------
    public FileList createFileList(){
        JammerFileList fileList = new JammerFileList();
        this.fileLists.add(fileList);
        return fileList;
    }

    public FileSet createFileSet(){
        JammerFileSet fileSet = new JammerFileSet();
        this.fileLists.add(fileSet);
        return fileSet;
    }

    public File getDestFile() {
        return this.destFile;
    }

    public File getWebrootDir() {
        return this.webrootDir;
    }
    
    public void setDestFile (File destinationFile){
        this.destFile = destinationFile;
    }
    public void setPathToWebapp(String name) {
        this.webappName = name;
    }

    public void setWebrootDir(File dir) {
        this.webrootDir = dir;
    }

    public static interface JammerFiles {
        public File getDir(Project project);
        public String[] getFiles(Project project);
    }
    public static class JammerFileList extends FileList implements JammerFiles {}
    public static class JammerFileSet extends FileSet implements JammerFiles {
        public String[] getFiles(Project project) {
            return this.getDirectoryScanner(project).getIncludedFiles();
        }
    }
}
