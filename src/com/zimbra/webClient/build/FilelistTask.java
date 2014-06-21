/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2009, 2010, 2013 Zimbra, Inc.
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

public class FilelistTask extends Task {

	//
	// Data
	//

	private File file;
	private String propertyName;
	private String separator = ",";
	private String encoding;

	//
	// Public methods
	//

	public void setFile(File file) {
		this.file = file;
	}

	public void setProperty(String name) {
		this.propertyName = name;
	}

	public void setSep(String sep) {
		this.separator = sep;
	}

	public void setEncoding(String encoding) {
		this.encoding = encoding;
	}

	// Task methods

	public void execute() throws BuildException {
		// check values
		if (this.file == null) {
			throw new BuildException("missing attribute 'file'");
		}
		if (this.propertyName == null) {
			throw new BuildException("missing attribute 'property'");
		}
		if (!this.file.exists()) {
			throw new BuildException("file does not exist");
		}

		// load file
		InputStream stream = null;
		StringBuilder str = new StringBuilder();
		try {
			stream = new FileInputStream(this.file);
			Reader reader = this.encoding != null ? new InputStreamReader(stream, this.encoding) : new InputStreamReader(stream);
			BufferedReader in = new BufferedReader(reader);
			String line;
			for (int i = 0; (line = in.readLine()) != null; i++) {
				if (i > 0) {
					str.append(this.separator);
				}
				str.append(line);
			}
			in.close();
		}
		catch (IOException e) {
			throw new BuildException(e);
		}
		finally {
			try {
				stream.close();
			}
			catch (Exception e) {
				// ignore
			}
		}

		// set property
		getProject().setProperty(this.propertyName, str.toString());
	}

} // class FilelistTask