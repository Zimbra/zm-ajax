/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013, 2014, 2016 Synacor, Inc.
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


package com.zimbra.kabuki.tools.img;

import org.apache.tools.ant.*;
import org.apache.tools.ant.util.FileUtils;
import java.io.*;

public class ImageSortTask 
	extends Task {
    
    //
    // Data
	//
    
    private File sourceDir;
    private File targetDir;
    private boolean deleteSource;
    
    private boolean noop;
    
    //
    // Public methods
    //
    
    public void setSource(File dir) {
        sourceDir = dir;
    }
    
    public void setTarget(File dir) {
        targetDir = dir;
    }
    
    public void setDelete(boolean delete) {
        deleteSource = delete;
    }
    
    public void setNoop(boolean noop) {
        this.noop = noop;
    }
    
    //
    // Task methods
    //
    
    public void execute() throws BuildException {

        // check parameters
        require(sourceDir != null, "missing source directory name");
        require(targetDir != null, "missing target directory name");
        
        require(sourceDir.exists(), "source directory doesn't exist");
        require(targetDir.exists(), "target directory doesn't exist");
        
        // process files in target directory
        try {
            System.out.println("Source directory: "+sourceDir);
            // results[0] is number of files processed 
            // results[1] is number of files skipped
            // results[2] is number of warnings
            int[] results = { 0 , 0, 0 };
            process(sourceDir, targetDir, deleteSource, noop, results);
            System.out.println("Processed "+results[0]+" file(s), skipped "+results[1]+" file(s).");
            if (results[2] > 0) {
                System.out.println("NOTE: Finished processing with "+results[2]+" warning(s).");
            }
        }
        catch (IOException e) {
            throw new BuildException(e);
        }
        
    } // execute()
    
    //
    // Private static methods
    //
    
    private static void process(File sourceDir, File targetDir, 
            					 boolean deleteSource, boolean noop,
            					 final int[] results) throws IOException {
        System.out.println("Scanning target directory: "+targetDir);

        // process files
        File[] files = targetDir.listFiles(new FileFilter() {
            public boolean accept(File file) {
                if (file.isFile()) {
	                String filename = file.getName().toLowerCase();
	                int period = filename.lastIndexOf('.');
	                String suffix = period != -1 ? filename.substring(period+1) : "";
	                boolean image = suffix.equals("gif") || suffix.equals("png") ||
	                				suffix.equals("jpg") || suffix.equals("jpeg") ||
	                				suffix.equals("svg");
	                if (image) {
	                    return true;
	                }
	                System.out.println("  Skipping non-image file: "+file);
	                results[1]++;
                }
                return false;
            }
        });
        if (files.length > 0) {
            FileUtils fileUtils = FileUtils.newFileUtils();
	        for (File targetFile : files) {
	            File sourceFile = new File(sourceDir, targetFile.getName());
	            if (!sourceFile.exists()) {
	                System.out.println("  Source file missing: "+sourceFile);
	                results[2]++;
	            }
	            else {
	                if (deleteSource) {
	                    System.out.println("  Moving "+sourceFile+" -> "+targetFile);
	                }
	                else {
	                    System.out.println("  Copying "+sourceFile+" -> "+targetFile);
	                }
	                if (!noop) {
		                fileUtils.copyFile(sourceFile, targetFile);
		                if (deleteSource) {
		                    sourceFile.delete();
		                }
	                }
	                results[0]++;
	            }
	        }
        }
        
        // process sub-directories
        File[] dirs = targetDir.listFiles(new FileFilter() {
            public boolean accept(File file) {
                return file.isDirectory();
            }
        });
        for (File dir : dirs) {
            process(sourceDir, dir, deleteSource, noop, results);
        }

    } // process(File,File,boolean,boolean,int[])
    
    private static void require(boolean truthful, String message) throws BuildException {
        if (!truthful) {
            throw new BuildException(message);
        }
    }

} // class ImageSortTask
