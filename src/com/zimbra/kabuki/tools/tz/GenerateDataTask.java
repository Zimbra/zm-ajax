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
package com.zimbra.kabuki.tools.tz;

import java.io.*;
import java.text.MessageFormat;

import org.apache.tools.ant.*;
import org.apache.tools.ant.types.*;

public class GenerateDataTask extends Task {

	//
	// Data
	//

	private File srcFile;
	private File destFile;

	//
	// Public methods
	//

	public void setSrc(File file) {
		this.srcFile = file;
	}

	public void setDest(File file) {
		this.destFile = file;
	}

	//
	// Task methods
	//

	public void execute() throws BuildException {

		antAssert(this.srcFile == null, "missing src attribute");
		antAssert(this.destFile == null, "missing dest attribute");

		antAssert(!this.srcFile.exists(), "file doesn't exist: ", this.srcFile);

		try {
			String[] args = {
				"-i", this.srcFile.getAbsolutePath(),
				"-o", this.destFile.getAbsolutePath()
			};

			System.out.print("GenerateData");
			for (String arg : args) {
				System.out.print(' ');
				System.out.print(arg);
			}
			System.out.println();

			GenerateData.main(args);
		}
		catch (Exception e) {
			throw new BuildException(e);
		}
	}

	//
	// Private static functions
	//

	private static void antAssert(boolean condition, String message, Object... args)
	throws BuildException {
		if (condition) {
			if (args.length > 0) {
				message = MessageFormat.format(message, args);
			}
			throw new BuildException(message);
		}
	}

} // class GenerateDataTask