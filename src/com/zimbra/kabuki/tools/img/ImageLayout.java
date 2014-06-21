/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2010, 2013 Zimbra, Inc.
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

package com.zimbra.kabuki.tools.img;

import java.io.File;

public enum ImageLayout {

    //
    // Values
    //
    NONE("no-repeat", ""),
    TILE("repeat", ".repeat"),
    // NOTE: While it may seem counter-intuitive that a HORIZONTAL image layout
    // NOTE: would have a "repeat-y" CSS value, it is in fact correct. The name
    // NOTE: of the ImageLayout enum value corresponds to how the sub-images are
    // NOTE: arranged within the image map. In order for a sub-image to be
    // NOTE: repeated along the x-axis, they need to be laid out vertically 
    // NOTE: within the generated image.
    HORIZONTAL("repeat-y", ".repeaty"),
    VERTICAL("repeat-x", ".repeatx");

    //
    // Data
    //

    private String css;
    private String ext;

    //
    // Constructors
    //

    ImageLayout(String css, String ext) {
        this.css = css;
        this.ext = ext;
    }

    //
    // Public methods
    //

    public String toCss() {
        return css;
    }

    public String toExtension() {
        return ext;
    }

    public static ImageLayout fromFile(File file) {
        String name = file.getName().toLowerCase();
        for (ImageLayout layout : ImageLayout.values()) {
            if (layout.equals(ImageLayout.NONE)) continue;
            if (name.contains(layout.toExtension())) {
                return layout;
            }
        }
        return ImageLayout.NONE;
    }

} // enum ImageLayout

