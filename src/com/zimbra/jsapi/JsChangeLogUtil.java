/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2013, 2014 Zimbra, Inc.
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

package	com.zimbra.jsapi;

import java.io.*;
import java.util.*;
import java.util.zip.*;
import org.json.*;

/**
 * 
 * @author sposetti
 *
 */
public	class	JsChangeLogUtil {
		
	private	static	final	String		ARG_OUTPUT_DIR = "-output";
	private	static	final	String		ARG_TEMPLATE_DIR = "-template";
	private	static	final	String		ARG_BASELINE_INVENTORY = "-baseline.inventory";
	private	static	final	String		ARG_CURRENT_INVENTORY = "-current.inventory";

	private	static	String	outputDir = null;
	private	static	String	templateDir = null;
	private	static	String	baselineInventoryFile = null;
	private	static	String	currentInventoryFile = null;

	/**
	 * Reads the command line arguments.
	 * 
	 * @param	args		the arguments
	 */
	private static void readArguments(String[] args) {
		int	argPos = 0;
		
		if (args[argPos].equals(ARG_OUTPUT_DIR)) {
			outputDir = args[++argPos];
			argPos++;
		}

		if (args[argPos].equals(ARG_TEMPLATE_DIR)) {
			templateDir = args[++argPos];
			argPos++;
		}

		if (args[argPos].equals(ARG_BASELINE_INVENTORY)) {
			baselineInventoryFile = args[++argPos];
			argPos++;
		}

		if (args[argPos].equals(ARG_CURRENT_INVENTORY)) {
			currentInventoryFile = args[++argPos];
			argPos++;
		}

	}
		
	/**
	 * Main
	 * 
	 * @param	args		the utility arguments
	 */
    public static void main(String[] args) throws Exception {
    	
       	readArguments(args);
       	
       	JsInventory baselineInv = JsInventory.create(baselineInventoryFile);
       	JsInventory currentInv = JsInventory.create(currentInventoryFile);

       	Properties props = new Properties();
       	props.setProperty(JsChangeLogTemplateUtil.PROP_TEMPLATE_DIR, templateDir);
       	props.setProperty(JsChangeLogTemplateUtil.PROP_OUTPUT_DIR, outputDir);

       	JsChangeLogTemplateUtil templateUtil = JsChangeLogTemplateUtil.getInstance(props);
       	templateUtil.writeChangeLog(baselineInv, currentInv);
    }

}