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

import java.awt.image.BufferedImage;
import java.io.IOException;

import org.dom4j.Element;
import org.dom4j.Document;
import org.dom4j.io.SAXReader;

/*
 * DecodedSVGImage represents a single SVG image that will be combined 
 * later.  It knows the original image's height, width, source filename, and 
 * target coordinates in the combined image.
 */
public class DecodedSVGImage extends DecodedImage {

    //
    // Data
    //

    private Element svg;

    //
    // Constructors
    //

    public DecodedSVGImage(String filename) {
        super(filename);
    }

    //
    // DecodedImage methods
    //

    public BufferedImage getBufferedImage() { return null; }
    
    public Element getSVG() { return svg; }

    public int getWidth() {
    	String width = svg.attributeValue("width").replace("px", "");
    	return Integer.parseInt(width);
    }

    public int getHeight() {
    	String height = svg.attributeValue("height").replace("px", "");
    	return Integer.parseInt(height);
    }

    /*
     * Load the contents of this image
     */
    public void load() throws IOException {
        String fName = getFilename();

        try {
        	SAXReader reader = new SAXReader();
            Document doc = reader.read(fName);
            
            svg = doc.getRootElement();
        } catch (Exception e) {
        	System.out.println("failed loading file: " + e.getMessage());

        	svg = null;
        }
    }

} // class DecodedFullColorImage