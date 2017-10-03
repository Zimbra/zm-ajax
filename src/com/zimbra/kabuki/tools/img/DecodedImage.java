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
import java.io.File;

public abstract class DecodedImage {

    //
    // Data
    //

	protected String mFilename;
    
    //
    // Constructors
    //

    public DecodedImage(String filename) {
        mFilename = filename;
    }

    //
    // Public methods
    //

    public abstract BufferedImage getBufferedImage();
    
    public abstract Boolean isVector();

    public abstract int getWidth();

    public abstract int getHeight();

    public abstract void load() throws java.io.IOException;

	public String getName() {
		String fileName = mFilename;
		String fileNameBase = fileName.substring(fileName.lastIndexOf(File.separator) + 1);

		// Strip the extension.
	    fileNameBase = fileNameBase.substring(0, fileNameBase.lastIndexOf('.'));

		// Strip any "repeat*" tiling derectives.  (Static layout has no directive.)
        for (ImageLayout layout : ImageLayout.values()) {
            if (layout.equals(ImageLayout.NONE)) continue;
            if (fileNameBase.endsWith(layout.toExtension())) {
                fileNameBase = fileNameBase.substring(0, fileNameBase.lastIndexOf('.'));
                break;
            }
        }

		return fileNameBase;
	}

    public String getFilename() {
        return mFilename;
    }

} // class DecodedImage