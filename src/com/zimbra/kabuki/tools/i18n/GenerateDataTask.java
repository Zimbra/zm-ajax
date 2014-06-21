/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2013 Zimbra, Inc.
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


package com.zimbra.kabuki.tools.i18n;

import java.io.File;
import org.apache.tools.ant.*;

public class GenerateDataTask
	extends Task {

	//
	// Data
	//

	// required

	private File destdir = null;
	private String basename = "I18nMsg";
	private boolean client = true;
	private boolean server = false;

	//
	// Public methods
	//

	// required

	public void setDestDir(File dir) {
		this.destdir = dir;
	}

	public void setBaseName(String basename) {
		this.basename = basename;
	}

	public void setClient(boolean generate) {
		this.client = generate;
	}

	public void setServer(boolean generate) {
		this.server = generate;
	}

	//
	// Task methods
	//

	public void execute() throws BuildException {

		// check required arguments
		if (destdir == null) {
			throw new BuildException("destination directory required -- use destdir attribute");
		}
		if (!destdir.exists()) {
			throw new BuildException("destination directory doesn't exist");
		}
		if (!destdir.isDirectory()) {
			throw new BuildException("destination must be a directory");
		}

		// build argument list
		String[] argv = {
			this.client ? "-c" : "-C", this.server ? "-s" : "-S",
			"-d", destdir.getAbsolutePath(), "-b", basename
		};

		// run program
		try {
			System.out.print("GenerateData");
			for (String arg : argv) {
				System.out.print(' ');
				System.out.print(arg);
			}
			System.out.println();
			GenerateData.main(argv);
		}
		catch (Exception e) {
			throw new BuildException(e);
		}

	} // execute()

} // class GenerateDataTask