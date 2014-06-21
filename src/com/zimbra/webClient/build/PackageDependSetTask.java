/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2007, 2009, 2010, 2013 Zimbra, Inc.
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

import java.io.*;
import org.apache.tools.ant.*;
import org.apache.tools.ant.types.*;

public class PackageDependSetTask
extends org.apache.tools.ant.taskdefs.DependSet {

	//
	// Data
	//

	protected Exception packageDependsEx;

	//
	// Public methods
	//

	/** All of the work is done in DependsList#setFiles. */
	public DependsList createSrcDependsList() {
		return new DependsList();
	}

	//
	// Task methods
	//

	public void execute() throws BuildException {
		if (this.packageDependsEx != null) {
			throw new BuildException(this.packageDependsEx);
		}
		super.execute();
	}

	//
	// Classes
	//

	public class DependsList {

		// Data

		private File dir;

		// Public methods

		public void setDir(File dir) {
			this.dir = dir;
		}

		public void setFiles(String files) {
			File baseDir = PackageDependSetTask.this.getProject().getBaseDir();

			String[] filenames = files.split(",");
			for (String filename : filenames) {
				// always consider this file part of the dependencies
				FileList filelist = new FileList();
				filelist.setDir(this.dir);
				filelist.setFiles(filename);
				PackageDependSetTask.this.addSrcfilelist(filelist);

				// is there anything more to do?
				File dependsFile = new File(this.dir, filename.trim());
				if (!dependsFile.exists()) {
					continue;
				}

				// add all dependencies
				try {
					BufferedReader in = new BufferedReader(new FileReader(dependsFile));
					String srcfilename;
					while ((srcfilename = in.readLine()) != null) {
						if (srcfilename.trim().length() == 0) continue;

						filelist = new FileList();
						File srcfile = new File(srcfilename);
						if (srcfile.isAbsolute()) {
							filelist.setDir(srcfile.getParentFile());
							filelist.setFiles(srcfile.getName());
						}
						else {
							filelist.setDir(baseDir);
							filelist.setFiles(srcfilename);
						}
						PackageDependSetTask.this.addSrcfilelist(filelist);
					}
				}
				catch (IOException ex) {
					PackageDependSetTask.this.packageDependsEx = ex;
				}
			}
		} // setList(String)

	} // class DependsList

} // class PackageDependSetTask