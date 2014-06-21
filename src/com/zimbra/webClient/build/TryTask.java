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
import org.apache.tools.ant.taskdefs.*;
import org.apache.tools.ant.types.*;

import java.io.*;
import java.util.*;

public class TryTask {

	//
	// Data
	//

	private Sequential block;
	private List<CatchBlock> catchBlocks = new ArrayList<CatchBlock>();
	private Sequential finallyBlock;

	//
	// Public methods
	//

	public Sequential createBlock() {
		return this.block = new Sequential();
	}

	public CatchBlock createCatch() {
		CatchBlock block = new CatchBlock();
		this.catchBlocks.add(block);
		return block;
	}

	public Sequential createFinally() {
		return this.finallyBlock = new Sequential();
	}

	//
	// Task methods
	//

	public void execute() throws BuildException {
		BuildException ex = null;
		CatchBlock catchBlock = null;

		// execute main block
		if (this.block == null) {
			// TODO: log that nothing to do
		}
		else {
			try {
				this.block.execute();
			}
			catch (BuildException e) {
				ex = e;
			}
			catch (Throwable t) {
				ex = new BuildException(t);
			}
		}

		// find matching catch block
		if (ex != null) {
			Throwable t = ex.getCause();
			for (CatchBlock block : this.catchBlocks) {
				if (block.catches(t)) {
					catchBlock = block;
					break;
				}
			}
		}

		// handle exception and finally
		if (catchBlock != null) {
			catchBlock.execute();
		}
		if (this.finallyBlock != null) {
			this.finallyBlock.execute();
		}
		if (ex != null) {
			throw ex;
		}

	} // execute()

	//
	// Classes
	//

	static class CatchBlock extends Sequential {
		// Constants
		public static final String ANY = "*";
		// Data
		private Class exClass;
		// Public methods
		public void setType(String exceptionClassName) {
			// empty or "*" value == ANY
			exceptionClassName = exceptionClassName.trim();
			if (exceptionClassName.length() == 0 || exceptionClassName.equals(ANY)) {
				return;
			}

			// try literal name
			try {
				this.exClass = Class.forName(exceptionClassName);
			}
			catch (ClassNotFoundException e) {
				// assume java.lang exception
				try {
					this.exClass = Class.forName("java.lang."+exceptionClassName);
				}
				catch (ClassNotFoundException e2) {
					throw new BuildException(e2);
				}
			}

			// ensure that it's of type Throwable
			if (!this.exClass.isAssignableFrom(Throwable.class)) {
				this.exClass = null;
				throw new BuildException("Specified class does not derive from java.lang.Throwable");
			}
		}
		public String getType() {
			return exClass != null ? exClass.getName() : ANY;
		}
		public boolean isAny() {
			return getType().equals(ANY);
		}
		public boolean catches(Throwable t) {
			if (t == null) return isAny();
			return isAny() || t.getClass().isAssignableFrom(this.exClass);
		}
	} // class CatchBlock

} // class TryTask