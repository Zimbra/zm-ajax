/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Default constructor.
 * @constructor
 * @class
 * Dwt is a static class that defines a number of constants and helper methods that
 * support the <code>ajax.dwt.*</code> package.
 *
 * @author Ross Dargahi
 * @author Conrad Damon
 */

Dwt = function() {
};

// Constants for positioning
/**
 * Static position style.
 */
Dwt.STATIC_STYLE = "static";

/**
 * Absolute position style.
 */
Dwt.ABSOLUTE_STYLE = "absolute";

/**
 * Relative position style.
 */
Dwt.RELATIVE_STYLE = "relative";

/**
 * Fixed position style.
 */
Dwt.FIXED_STYLE = "fixed";

// Background repeat
/**
 * Do not repeat background image.
 */
Dwt.NO_REPEAT = "no-repeat";

/**
 * Repeat background image.
 */
Dwt.REPEAT = "repeat";

/**
 * Repeat background image horizontally.
 */
Dwt.REPEAT_X = "repeat-x";

/**
 * Repeat background image vertically.
 */
Dwt.REPEAT_Y = "repeat-y";


// display style
/**
 * Inline display style.
 */
Dwt.DISPLAY_INLINE = "inline";

/**
 * Block display style.
 */
Dwt.DISPLAY_BLOCK = "block";

/**
 * No display style.
 */
Dwt.DISPLAY_NONE = "none";

/**
 * Table row style.
 */
Dwt.DISPLAY_TABLE_ROW = "table-row";

/**
 * Table cell style.
 */
Dwt.DISPLAY_TABLE_CELL = "table-cell";

// Scroll constants
/**
 * Clip on overflow.
 */
Dwt.CLIP = 1;

/**
 * Allow overflow to be visible.
 */
Dwt.VISIBLE = 2;

/**
 * Automatically create scrollbars if content overflows.
 */
Dwt.SCROLL = 3;

/**
 * Always have scrollbars whether content overflows or not.
 */
Dwt.FIXED_SCROLL = 4;

/**
 * Only show scrollbars on Y when content overflows.
 */
Dwt.SCROLL_Y = 5;

/**
 * Only show scrollbars on X when content overflows.
 */
Dwt.SCROLL_X = 6;


// z-index order
/** 
 * Hidden layer. Elements at this layer will be hidden from view.
 */
Dwt.Z_HIDDEN = 100;

/**
 * The curtain layer.
 * @type int
 * @see DwtShell
 */
Dwt.Z_CURTAIN = 200;


/**
 * Visible layer. Elements at this layer will be in view.
 */
Dwt.Z_VIEW = 300;

/**
 * Popup menu layer. Used by the menu components.
 */
Dwt.Z_MENU = 500;

/**
 * Veil layer. The veil appears just behind modal dialogs render other components
 * unable to receive mouse input.
 */
Dwt.Z_VEIL = 600;

/**
 * Dialog layer. Dialogs are positioned at this layer.
 */
Dwt.Z_DIALOG = 700;

/**
 * Used by menus that are part of a dialog.
 */
Dwt.Z_DIALOG_MENU = 750;

/**
 * Tooltips layer.
 */
Dwt.Z_TOOLTIP = 775;

/**
 * Drag and Drop (DnD) icon layer. DnD icons are positioned at this layer so they
 * move across the top of other components.
 */
Dwt.Z_DND = 800;		// Drag N Drop icons

/**
 * This layer appears in front of other layers to block all user mouse input.
 */
Dwt.Z_BUSY = 900;

/**
 * The toast layer.
 */
Dwt.Z_TOAST = 950;

/**
 * Used by the splash screens.
 */
Dwt.Z_SPLASH = 1000;


/**
 * Default value. Used when setting such things as size and bounds to indicate a
 * component should not be set. For example if setting size and not wishing to set
 * the height.
 * <pre>
 * Dwt.setSize(htmlElement, 100, Dwt.DEFAULT)
 * </pre>
 * 
 */
Dwt.DEFAULT = -123456789;

/**
 * Used to clear a value.
 */
Dwt.CLEAR = -20000;

/**
 * Offscreen position. Used when setting a elements position.
 */
Dwt.LOC_NOWHERE = -10000;

// Drag N Drop action constants. These are bit fields.
/**
 * No drag and drop operation.
 */
Dwt.DND_DROP_NONE = 0;

/**
 * Copy drag and drop operation.
 */
Dwt.DND_DROP_COPY = 1;

/**
 * Move drag and drop operation.
 */
Dwt.DND_DROP_MOVE = 2;

/**
 * Ballpark figure for width of a scrollbar.
 */
Dwt.SCROLLBAR_WIDTH = 22;

// Editor formats
Dwt.HTML = "text/html";
Dwt.TEXT = "text/plain";

// Keys used for retrieving data
// TODO JSDoc
Dwt.KEY_OBJECT = "_object_";
Dwt.KEY_ID = "_id_";

/**
 * z-index increment unit. Used by components if they need to bump their z-index.
 */
Dwt._Z_INC = 1;


/**
 * @private
 */
Dwt.__nextId = {};

/**
 * This method is used to generate a unique id to be used for an HTML element's id
 * attribute.
 *
 * @return {string}	the next available element ID
 */
Dwt.getNextId =
function(prefix) {
	prefix = prefix || "DWT";
	if (!Dwt.__nextId[prefix]) {
		Dwt.__nextId[prefix] = 1;
	}
	return prefix + Dwt.__nextId[prefix]++;
};

/**
 * This method is used to query an element for its id, generating one if it
 * isn't set.
 *
 * @return {string}	the element ID
 */
Dwt.getId =
function(element, prefix) {
	return element ? element.id || (element.id = Dwt.getNextId(prefix)) : null;
};

/**
 * @deprecated
 * The association between an element and a control is now via DwtControl.ALL_BY_ID,
 * where the unique element ID is a key to the control. The association is made when
 * the control is initialized.
 * 
 * This method builds an indirect association between a DOM object and a JavaScript
 * object. This indirection is important to prevent memory leaks (particularly in IE) by
 * not directly creating a circular reference between a DOM object
 *
 * @param {DOMElement} domElement the DOM element (typically an HTML element)
 * @param {Object} jsObject the JavaScript object
 * 
 * @private
 */
Dwt.associateElementWithObject =
function(domElement, jsObject, attrName) {
	domElement[attrName||"dwtObj"] = jsObject.__internalId = AjxCore.assignId(jsObject);
};

/**
 * @deprecated
 * The association will be broken by the control when it is disposed.
 * 
 * This method breaks the indirect association between a DOM object and a JavaScript
 * object that was created by the <code>Dwt.associateElementWithObject</code>method
 *
 * @param {DOMElement} domElement the DOM element (typically an HTML element)
 * @param {Object} jsObject the JavaScript object
 * 
 * @private
 */
Dwt.disassociateElementFromObject =
function(domElement, jsObject, attrName) {
	if (domElement){
		domElement.removeAttribute(attrName||"dwtObj");
	}
	if (jsObject.__internalId){
		AjxCore.unassignId(jsObject.__internalId);
	}
};

/**
 * @deprecated		use {@link DwtControl.fromElement}
 * 
 * @private
 */
Dwt.getObjectFromElement =
function(domElement, attrName) {
	return AjxCore.objectWithId(domElement[attrName||"dwtObj"]);
};

Dwt.getElement =
function(el) {
	return (typeof(el) == "string") ? document.getElementById(el) : el;
};

/**
 * Finds an ancestor element with a non-empty value for the given attr.
 * 
 * @param	{DOMElement}	domElement	the starting DOM element
 * @param	{string}		attrName	the attribute name
 * 
 * @return	{DOMElement}	the DOM element
 */
Dwt.findAncestor =
function(domElement, attrName) {
	var attr = Dwt.getAttr(domElement, attrName);
	while (domElement && (attr == null || attr == "")) {
		domElement = domElement.parentNode;
		attr = Dwt.getAttr(domElement, attrName);
	}
	return domElement;
};

/**
 * Returns true if el1 is an ancestor (in the parent chain) of el2, or if
 * el1 and el2 are the same element.
 *
 * @param {DOMElement}	el1
 * @param {DOMElement}	el2
 */
Dwt.isAncestor =
function(el1, el2) {

	if (el1 == el2) {
		return true;
	}

	var el = el2;
	while (el) {
		el = el.parentNode;
		if (el == el1) {
			return true;
		}
	}
	return false;
};

Dwt.setHandler =
function(htmlElement, event, func) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		Dwt.clearHandler(htmlElement, event);
	}
	htmlElement[event] = func;
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		htmlElement.addEventListener("DOMMouseScroll", func, true);
	}
};

Dwt.clearHandler =
function(htmlElement, event) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (event == DwtEvent.ONMOUSEWHEEL && AjxEnv.isGeckoBased) {
		if (htmlElement[event]) {
			var func = htmlElement[event];
			htmlElement.removeEventListener("DOMMouseScroll", func, true);
		}
	}
	htmlElement[event] = null;
};

Dwt.getBackgroundRepeat =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	return DwtCssStyle.getProperty(htmlElement, "background-repeat");
};

Dwt.setBackgroundRepeat =
function(htmlElement, style) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.backgroundRepeat = style;
};

/**
 * Gets the bounds of an HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtRectangle}	the elements bounds
 *
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 * @see #getSize
 */
Dwt.getBounds =
function(htmlElement, rect) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return null; }
	var tmpPt = DwtPoint.tmp;

	Dwt.getLocation(htmlElement, tmpPt);
	var locX = tmpPt.x;
	var locY = tmpPt.y;

	Dwt.getSize(htmlElement, tmpPt);

	if (!rect) {
		return new DwtRectangle(locX, locY, tmpPt.x, tmpPt.y);
	} else {
		rect.set(locX, locY, tmpPt.x, tmpPt.y);
		return rect;
	}
};

/**
 * Sets the bounds of an HTML element. The position type of the element must
 * be absolute or else an exception is thrown. To omit setting a value set the
 * actual parameter value to <i>Dwt.DEFAULT</i>
 *
 * @param {HTMLElement} htmlElement absolutely positioned HTML element
 * @param {number|string} x the x coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 * @param {number|string} y the y coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 * @param {number} width the width of the element (for example: 100, "100px", "75%", {@link Dwt.DEFAULT})
 * @param {number} height the height of the element  (for example: 100, "100px", "75%", {@link Dwt.DEFAULT})
 *
 * @throws DwtException
 *
 * @see #getBounds
 * @see #setLocation
 * @see #setSize
 */
Dwt.setBounds =
function(htmlElement, x, y, width, height) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	Dwt.setLocation(htmlElement, x, y);
	Dwt.setSize(htmlElement, width, height);
};

/**
 * Gets the element cursor for a given HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {string}	the html elements cursor
 *
 * @see #setCursor
 */
Dwt.getCursor =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return ""; }
	return DwtCssStyle.getProperty(htmlElement, "cursor");
};

/**
 * Sets an HTML element cursor.
 *
 * @param {HTMLElement} htmlElement the element for which to set the cursor
 * @param {string} cursorName name of the new cursor
 *
 * @see #setCursor
 */
Dwt.setCursor =
function(htmlElement, cursorName) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.cursor = cursorName;
};

/**
 * Gets the location of an HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtPoint}		the location of the HTML element
 *
 * @see #setLocation
 * @see #getBounds
 * @see #getSize
 */
Dwt.getLocation =
function(htmlElement, point) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return null; }
	point = point || new DwtPoint(0, 0);

	if (htmlElement.style.position == Dwt.ABSOLUTE_STYLE) {
		// parseInt will return NaN if "top" or "left" is "auto" or not set.
		// TODO: We should test for that and just go to toWindow in that case.
		point.set(parseInt(DwtCssStyle.getProperty(htmlElement, "left")),
				parseInt(DwtCssStyle.getProperty(htmlElement, "top")));
		return point;
	}

	return Dwt.toWindow(htmlElement, 0, 0, null, null, point);
};

/**
 * Sets the location of an HTML element. The position type of the element must
 * be absolute or else an exception is thrown. To only set one of the coordinates,
 * pass in a value of {@link Dwt.DEFAULT} for the coordinate for which the value is
 * not to be set
 *
 * @param {HTMLElement} htmlElement the absolutely positioned HTML element
 * @param {number|string} x the x coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 * @param {number|string} y the y coordinate of the element (for example: 10, "10px", {@link Dwt.DEFAULT})
 *
 * @throws DwtException
 *
 * @see #getLocation
 * @see #setBounds
 * @see #setSize
 */
Dwt.setLocation =
function(htmlElement, x, y) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var position = DwtCssStyle.getProperty(htmlElement, 'position');
	if (position != Dwt.ABSOLUTE_STYLE && position != Dwt.RELATIVE_STYLE && position != Dwt.FIXED_STYLE) {
		DBG.println(AjxDebug.DBG1, "Cannot position static widget " + htmlElement.className);
		throw new DwtException("Static widgets may not be positioned", DwtException.INVALID_OP, "Dwt.setLocation");
	}
	if (x = Dwt.__checkPxVal(x)) {
		htmlElement.style.left = x;
	}
	if (y = Dwt.__checkPxVal(y)) {
		htmlElement.style.top = y;
	}
};

Dwt.getPosition =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	return htmlElement.style.position;
};

Dwt.setPosition =
function(htmlElement, posStyle) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.position = posStyle;
};

/**
 * Returns <code>htmlElement</code>'s scroll style. The scroll style determines the element's
 * behaviour when content overflows its boundaries. Possible values are:
 * <ul>
 * <li><i>Dwt.CLIP</i> - Clip on overflow</li>
 * <li><i>Dwt.VISIBLE</i> - Allow overflow to be visible</li>
 * <li><i>Dwt.SCROLL</i> - Automatically create scrollbars if content overflows</li>
 * <li><i>Dwt.FIXED_SCROLL</i> - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @param {HTMLElement} htmlElement HTML element
 *
 * @return {Dwt.CLIP|Dwt.VISIBLE|Dwt.SCROLL|Dwt.FIXED_SCROLL}	the elements scroll style
 */
Dwt.getScrollStyle =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return ""; }
	var overflow =  DwtCssStyle.getProperty(htmlElement, "overflow");

	if (overflow == "hidden")		{ return Dwt.CLIP; }
	if (overflow =="auto")			{ return Dwt.SCROLL; }
	if (overflow =="scroll")		{ return Dwt.FIXED_SCROLL; }

	if (overflow == '') {
		var overflowX = DwtCssStyle.getProperty(htmlElement, "overflowX");
		var overflowY = DwtCssStyle.getProperty(htmlElement, "overflowY");

		if (overflowX == 'scroll')	{ return Dwt.SCROLL_X; }
		if (overflowY == 'scroll')	{ return Dwt.SCROLL_Y; }
	}
	return Dwt.VISIBLE;
};

/**
 * Sets the <code>htmlElement</code>'s scroll style. The scroll style determines the elements's
 * behaviour when content overflows its div's boundaries. Possible values are:
 * <ul>
 * <li><i>Dwt.CLIP</i> - Clip on overflow</li>
 * <li><i>Dwt.VISIBLE</i> - Allow overflow to be visible</li>
 * <li><i>Dwt.SCROLL</i> - Automatically create scrollbars if content overflows</li>
 * <li><i>Dwt.FIXED_SCROLL</i> - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @param {HTMLElement} htmlElement HTML element
 * @param {Dwt.CLIP|Dwt.VISIBLE|Dwt.SCROLL|Dwt.FIXED_SCROLL}	scrollStyle		the elements scroll style
 */
Dwt.setScrollStyle =
function(htmlElement, scrollStyle) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (scrollStyle == Dwt.CLIP)
		htmlElement.style.overflow = "hidden";
	else if (scrollStyle == Dwt.SCROLL)
		htmlElement.style.overflow = "auto";
	else if (scrollStyle == Dwt.FIXED_SCROLL)
		htmlElement.style.overflow = "scroll";
	else if (scrollStyle == Dwt.SCROLL_Y) {
		htmlElement.style.overflowX = "hidden";
		htmlElement.style.overflowY = "auto";
	} else if (scrollStyle == Dwt.SCROLL_X) {
		htmlElement.style.overflowY = "hidden";
		htmlElement.style.overflowX = "auto";
	} else {
		htmlElement.style.overflow = "visible";
	}
};


/**
 * Gets the size of an HTML element. Normally, this yields the
 * calculated size of the element. However, if 'getFromStyle' is
 * true, the style is obtained directly from the CSS style.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 * @param {DwtPoint} point		if given, reuse this point
 * @param {Boolean} getFromStyle		whether to use the calculated size
 *
 * @return {DwtPoint}	the elements size, margins included
 *
 * @see #getBounds
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 * @see #getOuterSize
 */
Dwt.getSize =
function(htmlElement, point, getFromStyle) {
    // Note: in FireFox, offsetHeight includes border and clientHeight does not;
    // may want to look at clientHeight for FF

	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var p;
	if (!point) {
		p = new DwtPoint(0, 0);
	} else {
		p = point;
		p.set(0, 0);
	}

	if (!htmlElement) { return p; }

	if (getFromStyle) {
		if (htmlElement.style.width) { //assumption - the caller only cares about the dimension that is set via the style. So ok to keep 0 if it's not set. for simplicity.
			p.x = parseInt(htmlElement.style.width);
		}
		if (htmlElement.style.height) {
			p.y = parseInt(htmlElement.style.height);
		}

		return p;
	}

	p.x = htmlElement.offsetWidth;
	if (p.x != null) {
		p.y = htmlElement.offsetHeight;
	} else if (htmlElement.clip && htmlElement.clip.width != null) {
		p.x = parseInt(htmlElement.clip.width);
		p.y = parseInt(htmlElement.clip.height);
	} else if (htmlElement.style && htmlElement.style.pixelWidth != null) {
		p.x = parseInt(htmlElement.style.pixelWidth);
		p.y = parseInt(htmlElement.style.pixelHeight);
	}

	return p;
};


/**
 * Gets the outer size -- that is, the size including margins, padding, and borders -- of an
 * HTML element.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtPoint}	the elements size, margins included
 *
 * @see #getSize
 * @see #getBounds
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 */
Dwt.getOuterSize =
function(htmlElement, point) {
    var p = Dwt.getSize(htmlElement, point);

    if (p && Dwt.getVisible(htmlElement)) {
        var margins = Dwt.getMargins(htmlElement);
		var insets = Dwt.getInsets(htmlElement);
        p.x += margins.left + margins.right + insets.left + insets.right;
        p.y += margins.top + margins.bottom + insets.top + insets.bottom;
    }

    return p;
};

Dwt.setSize =
function(htmlElement, width, height) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (!htmlElement.style) { return; }

	if (width == Dwt.CLEAR) {
		htmlElement.style.width = null;
	} else if (width = Dwt.__checkPxVal(width, true)) {
		htmlElement.style.width = width;
	}

	if (height == Dwt.CLEAR) {
		htmlElement.style.height = null;
	} else if (height = Dwt.__checkPxVal(height, true)) {
		htmlElement.style.height = height;
	}
};

/**
 * Measure the extent in pixels of a section of html. This is not the worlds cheapest
 * method to invoke so do so judiciously
 *
 * @param {string} html 	the html content for which that extents are to be calculated
 *
 * @return {DwtPoint}	the extent of the content
 */
Dwt.getHtmlExtent =
function(html) {
	var div = AjxStringUtil.calcDIV();
	div.innerHTML = html;
	return Dwt.getSize(div);
};

Dwt.toDocumentFragment =
function(html, id) {
	var div = AjxStringUtil.calcDIV();
	div.innerHTML = html;

	var fragment = document.createDocumentFragment();
	var container = id && document.getElementById(id);
	if (container) {
		fragment.appendChild(container);
	}
	else {
		for (var child = div.firstChild; child; child = div.firstChild) {
			fragment.appendChild(child);
		}
	}
	return fragment;
};

Dwt.getAttr =
function(htmlEl, attr, recursive) {
	// test for tagName so we dont try to eval non-html elements (i.e. document)
	if (!recursive) {
		return htmlEl && htmlEl.tagName
			? (htmlEl.getAttribute(attr) || htmlEl[attr])
			: null;
	} else {
		while (htmlEl) {
			if (Dwt.getAttr(htmlEl, attr) != null) {
				return htmlEl;
			}
			htmlEl = htmlEl.parentNode;
		}
		return null;
	}
};

Dwt.getVisible =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var disp = DwtCssStyle.getProperty(htmlElement, "display");
	return (disp != Dwt.DISPLAY_NONE);
};

Dwt.setVisible =
function(htmlElement, visible) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	if (visible) {
		if (htmlElement.nodeName.match(/tr/i)) {
			htmlElement.style.display = Dwt.DISPLAY_TABLE_ROW;
		}
		else if (htmlElement.nodeName.match(/td|th/i)) {
			htmlElement.style.display = Dwt.DISPLAY_TABLE_CELL;
		}
		else {
			htmlElement.style.display = htmlElement.getAttribute("x-display") ||
										Dwt.DISPLAY_BLOCK;
		}
	} else {
		var display = DwtCssStyle.getComputedStyleObject(htmlElement).display;
		if (display != "none") {
			htmlElement.setAttribute("x-display", display);
		}
		htmlElement.style.display = Dwt.DISPLAY_NONE;
	}
};

Dwt.getVisibility =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var vis = DwtCssStyle.getProperty(htmlElement, "visibility");
	return (vis == "visible");
};

Dwt.setVisibility =
function(htmlElement, visible) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.visibility = visible ? "visible" : "hidden";
};

Dwt.__MSIE_OPACITY_RE = /alpha\(opacity=(\d+)\)/;

Dwt.getOpacity =
function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	return Number(htmlElement.style.opacity || 1) * 100;
};

Dwt.setOpacity =
function(htmlElement, opacity) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.opacity = opacity/100;
};


/**
 * Get the z-index of an element.
 *
 * @param {boolean} getFromStyle    get the value from the style attribute of
 *                                  this element, or a parent
 *
 * @return	{number}	the z-index value
 */
Dwt.getZIndex =
function(htmlElement, getFromStyle) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }

	if (getFromStyle) {
		while (htmlElement.style.zIndex === "" && htmlElement.parentNode) {
			htmlElement = htmlElement.parentNode;
		}

		return htmlElement.style.zIndex;
	}

	return DwtCssStyle.getProperty(htmlElement, "z-index");
};

Dwt.setZIndex =
function(htmlElement, idx) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.zIndex = idx;
	if (idx < Dwt.Z_VIEW) {
		htmlElement.setAttribute('aria-hidden', true);
		if (htmlElement.getAttribute('tabindex')) {
			htmlElement.setAttribute('tabindex', -1);
		}
	} else {
		htmlElement.removeAttribute('aria-hidden');
		if (htmlElement.getAttribute('tabindex')) {
			htmlElement.setAttribute('tabindex', 0);
		}
	}
};

Dwt.getDisplay =
function(htmlElement) {
	DwtCssStyle.getProperty(htmlElement, "display");
};

Dwt.setDisplay =
function(htmlElement, value) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	htmlElement.style.display = value;
};

/**
 * Gets the window size of the browser.
 * 
 * @param	{DwtPoint}		point		the point to hold the windows x/y size
 * @return	{DwtPoint}		the point holding the window x/y size
 */
Dwt.getWindowSize =
function(point) {
	var p = (!point) ? new DwtPoint(0, 0) : point;
	if (window.innerWidth) {
		p.x = window.innerWidth;
		p.y = window.innerHeight;
	} else if (document.body && document.body.clientWidth) {
		p.x = document.body.clientWidth;
		p.y = document.body.clientHeight;
	}
	return p;
};

Dwt.toWindow =
function(htmlElement, x, y, containerElement, dontIncScrollTop, point) {
	var p;
	if (!point) {
		p = new DwtPoint(x, y);
	} else {
		p = point;
		p.set(x, y);
	}

	htmlElement = Dwt.getElement(htmlElement);
	var offsetParent = htmlElement;
	while (offsetParent && offsetParent != containerElement) {
		p.x += offsetParent.offsetLeft - offsetParent.scrollLeft;
		p.y += offsetParent.offsetTop;
		if (!dontIncScrollTop) {
			var scrollTop = AjxEnv.isOpera ? offsetParent.pageYOffset : offsetParent.scrollTop;
			if (scrollTop) {
				p.y -= scrollTop;
			}
			var parentNode = offsetParent.parentNode;
			while (parentNode != offsetParent.offsetParent && parentNode != containerElement) {
				scrollTop = AjxEnv.isOpera ? parentNode.pageYOffset : parentNode.scrollTop;
				if (scrollTop) {
					p.y -= scrollTop;
				}
				parentNode = parentNode.parentNode;
			}
		}
		offsetParent = offsetParent.offsetParent;
	}
	return p;
};

Dwt.getInsets = function(htmlElement) {
	// return an object with the insets (border + padding size) for each side of the element, eg:
	//		{ left: 3, top:0, right:3, bottom:0 }
	// NOTE: assumes values from computedStyle are returned in pixels!!!

	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var style = DwtCssStyle.getComputedStyleObject(htmlElement);

	var bl = parseInt(style.borderLeftWidth) 	|| 0;
	var bt = parseInt(style.borderTopWidth) 	|| 0;
	var br = parseInt(style.borderRightWidth)	|| 0;
	var bb = parseInt(style.borderBottomWidth)	|| 0;

	var pl = parseInt(style.paddingLeft) 	|| 0;
	var pt = parseInt(style.paddingTop) 	|| 0;
	var pr = parseInt(style.paddingRight)	|| 0;
	var pb = parseInt(style.paddingBottom)	|| 0;

	return {
			left 	: bl + pl,
			top  	: bt + pt,
			right 	: br + pr,
			bottom	: bb + pb
		};
};

Dwt.insetBounds = function(bounds, insets) {

	// given a 'bounds' object [from Dwt.getBounds()] 
	//	and an 'insets' object [from Dwt.getInsets()]
	//	munge the bounds so it takes the insets into account.
	// Useful to get the inner dimensions of an element.
	if (!bounds) {
        return null;
    }

	bounds.x += insets.left;
	bounds.y += insets.top;
	bounds.width  -= insets.left + insets.right;
	bounds.height -= insets.top + insets.bottom;

	return bounds;
};

/**
 * Gets the bounds of an HTML element, excluding borders and paddings.
 *
 * @param {HTMLElement} htmlElement		the HTML element
 *
 * @return {DwtRectangle}	the elements bounds
 *
 * @see #setBounds
 * @see #getInsetBounds
 * @see #getLocation
 * @see #getSize
 */
Dwt.getInsetBounds = function(htmlElement) {
	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }

	var bounds = Dwt.getBounds(htmlElement);
	var insets = Dwt.getInsets(htmlElement);

	return Dwt.insetBounds(bounds, insets);
};

Dwt.getMargins = function(htmlElement) {
	// return an object with the margins for each side of the element, eg:
	//		{ left: 3, top:0, right:3, bottom:0 }
	// NOTE: assumes values from computedStyle are returned in pixels!!!

	if (!(htmlElement = Dwt.getElement(htmlElement))) { return; }
	var style = DwtCssStyle.getComputedStyleObject(htmlElement);

	return {
		left 	: parseInt(style.marginLeft) 	|| 0,
		top  	: parseInt(style.marginTop) 	|| 0,
		right 	: parseInt(style.marginRight) 	|| 0,
		bottom	: parseInt(style.marginBottom)	|| 0
	};
};

/**
 * Get ancestor elements of the given node, up to and including the given
 * parent node. If no parent is given, assume the root document node. If the
 * parent node is not an ancestor of the child, return <code>null</code>.
 *
 * @param {HTMLElement} childNode		the child HTML element
 * @param {HTMLElement} parentNode		the parent HTML element
 * @param {Boolean} 	includeChild	if true, include the child itself
 *
 * @return {Array}						a list of HTML elements
 */
Dwt.getAncestors =
function(childNode, parentNode, includeChild) {
	var ancestors = [];

	// a reasonable default
	if (!parentNode) {
		parentNode = document.documentElement;
	}

	if (includeChild) {
		ancestors.push(childNode);
	}

	while (childNode && childNode != parentNode) {
		ancestors.push(childNode.parentNode);
		childNode = childNode.parentNode;
	}

	// check if the parent was an ancestor
	if (ancestors[ancestors.length - 1] != parentNode) {
		return null;
	}

	return ancestors;
};

Dwt.setStatus =
function(text) {
	window.status = text;
};

Dwt.getTitle =
function() {
	return window.document.title;
};

Dwt.setTitle =
function(text) {
	window.document.title = text;
};

Dwt.getIframeDoc =
function(iframeObj) {
	if (iframeObj) {
		return iframeObj.contentDocument;
	}
	return null;
};

Dwt.getIframeWindow =
function(iframeObj) {
	return iframeObj.contentWindow;
};

/**
 * Creates and returns an element from a string of HTML.
 *
 * @param {string} html 	the HTML text
 * @param {boolean} isRow 	if <code>true</code>, if the element is a <code>&lt;tr&gt;</code>
 *
 * @return {HTMLElement}	an HTMLElement with the <code>html</code> as its content. if <code>isRow</code>
 * 		is <code>true</code>, then the element will be a table
 */
Dwt.parseHtmlFragment =
function(html, isRow) {
	if (!Dwt._div) {
		Dwt._div = document.createElement('div');
	}
	// TR element needs to have surrounding table
	if (isRow) {
		html = "<table style='table-layout:fixed'>" + html + "</table>";
	}
	Dwt._div.innerHTML = html;

	if (isRow) {
		var fragment = document.createDocumentFragment();
		var rows = Dwt._div.firstChild.rows;
		for (var i = rows.length - 1; i >= 0; i--) {
			// NOTE: We always grab the first row because once we append it
			//       to the fragment, it will be removed from the table.
			fragment.appendChild(rows[0]);
		}
		return fragment.childNodes.length > 1 ? fragment : fragment.firstChild;
	}
	return Dwt._div.firstChild;
};

Dwt.contains =
function(parentEl, childEl) {
	var isContained = false;
	if (parentEl.compareDocumentPosition) {
		var relPos = parentEl.compareDocumentPosition(childEl);
		if ((relPos == (document.DOCUMENT_POSITION_CONTAINED_BY | document.DOCUMENT_POSITION_FOLLOWING))) {
			isContained = true;
		}
	} else if (parentEl.contains) {
		isContained = parentEl.contains(childEl);
	}
	return isContained;
};

Dwt.removeChildren =
function(htmlEl) {
	while (htmlEl.hasChildNodes()) {
		htmlEl.removeChild(htmlEl.firstChild);
	}
};

/**
 * Opera always returns zero for cellIndex property of TD element :(
 *
 * @param cell		TD object we want cell index for
 * 
 * @private
 */
Dwt.getCellIndex =
function(cell) {
	if (AjxEnv.isOpera) {
		if (cell.tagName && cell.tagName.toLowerCase() == "td") {
			// get the cells collection from the TD's parent TR
			var cells = cell.parentNode.cells;
			var len = cells.length;
			for (var i = 0; i < len; i++) {
				if (cells[i] == cell)
					return i;
			}
		}
	} else {
		return cell.cellIndex;
	}
	return -1;
};

/**
 * Remove the <code>del</code> class name from the element's CSS class names and
 * optionally add <code>add</code> class name if given provided
 *
 * @param {HTMLElement} el HTML Element to which to add/delete class names
 * @param {string} [del] the class name to delete
 * @param {string} [add] the class name to add
 */
Dwt.delClass =
function(el, del, add) {

	if (el == null) { return }
	if (!del && !add) { return; }

	if (typeof del == "string" && del.length) {
		del = Dwt._DELCLASS_CACHE[del] || (Dwt._DELCLASS_CACHE[del] = new RegExp("\\b" + del + "\\b", "ig"));
	}
	var className = el.className || "";
	className = className.replace(del, " ");
	className = AjxStringUtil.trim(className);
	el.className = add ? className + " " + add : className;
};

// cache the regexps here to avoid compiling the same regexp multiple times
Dwt._DELCLASS_CACHE = {};

/**
 * Adds the given class name to the element's CSS class names
 *
 * @param {HTMLElement} el the HTML Element to which to add the class name
 * @param {string} c the class name
 *
 * @see #delClass
 */
Dwt.addClass =
function(el, c) {
	Dwt.delClass(el, c, c);
};

/**
 * Conditionally add or remove a class name from an element
 *
 * @param {HTMLElement} el the target element
 * @param {boolean} condition 	the condition to check
 * @param {string} a the class name when condition is <code>true</code>
 * @param {string} b the class name when condition is <code>false</code>
 */
Dwt.condClass =
function(el, condition, a, b) {
	if (!!condition) {
		if (b) {
			Dwt.delClass(el, b);
		}
		Dwt.addClass(el, a);
	} else {
		Dwt.delClass(el, a);
		if (b) {
			Dwt.addClass(el, b);
		}
	}
};

/** Returns true if the specified element has the given class. */
Dwt.hasClass = function(el, className) {
    if (!el || !className) return false;
    return el.className.match(new RegExp("\\b"+className+"\\b"));
};

/**
 * Sets the selection range.
 *
 * @param {input|iframe} input input for which to find the selection start point. This
 * 		may be a text input field or an iframe in design mode
 * @param {number} start 	the starting position
 * @param {number} end 	the ending position
 *
 * @see #getSelectionStart
 * @see #getSelectionEnd
 * @see #setSelectionText
 * @see #moveCursorToEnd
 */
Dwt.setSelectionRange =
function(input, start, end) {
	if (input.setSelectionRange) {
        input.focus();
		input.setSelectionRange(start, end);
	} else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveStart("character", start);
		range.moveEnd("character", end - start);
		range.select();
	} else if (input.select) {
		// FIXME: find solutions for other browsers
		input.select();
	}
};

/**
 * Retrieves the start of the selection.  For a collapsed range, this is
 * equivalent to {@link #getSelectionEnd}.
 *
 * @param {input|iframe} input input for which to find the selection start point. This
 * 		may be a text input field or an iframe in design mode
 *
 * @return {number}	starting position of the selection
 *
 * @see #getSelectionEnd
 * @see #setSelectionText
 * @see #setSelectionRange
 * @see #moveCursorToEnd
 */
Dwt.getSelectionStart =
function(input) {
	if (AjxUtil.isSpecified(input.selectionStart)) {
		return input.selectionStart;
	} else if (document.selection) {
		var range = document.selection.createRange();
		var isCollapsed = range.compareEndPoints("StartToEnd", range) == 0;
		if (!isCollapsed)
			range.collapse(true);
		var b = range.getBookmark();
		var offset = input.createTextRange().getBookmark().charCodeAt(2);
		return Math.max(b.charCodeAt(2) - offset, 0);
	}

	// FIXME: find solutions for other browsers
	return input.value.length;
};

/**
 * Retrieves the end of the selection.
 *
 * @param {input|iframe} input 	the input for which to find the selection end point. This
 * 		may be a text input field or an iframe in design mode
 *
 * @return {number}	the starting position of the selection
 *
 * @see #getSelectionStart
 * @see #setSelectionText
 * @see #setSelectionRange
 * @see #moveCursorToEnd
 */
Dwt.getSelectionEnd =
function(input) {
	if (AjxUtil.isSpecified(input.selectionEnd)) {
		return input.selectionEnd;
	} else if (document.selection) {
		var range = document.selection.createRange();
		var isCollapsed = range.compareEndPoints("StartToEnd", range) == 0;
		if (!isCollapsed)
			range.collapse(false);
		var b = range.getBookmark();
		var offset = input.createTextRange().getBookmark().charCodeAt(2);
		return Math.max(b.charCodeAt(2) - offset, 0);
	}

	// FIXME: find solutions for other browsers
	return input.value.length;
};

/**
 * Sets the selection text
 *
 * @param {input|iframe} input	the input for which to set the selection text. This
 * 		may be a text input field or an iframe in design mode
 * @param {string} text 	the text to set as the selection
 *
 * @see #getSelectionStart
 * @see #getSelectionEnd
 * @see #setSelectionRange
 * @see #moveCursorToEnd
 */
Dwt.setSelectionText =
function(input, text) {
	var start = Dwt.getSelectionStart(input);
	var end = Dwt.getSelectionEnd(input);
	var str = input.value;
	var val = [
		str.substr(0, start),
		text,
		str.substr(end)
	].join("");

	if (typeof input.setValue == "function") {
		input.setValue(val);
	} else {
		input.value = val;
	}
	Dwt.setSelectionRange(input, start, start + text.length);
};

/**
 * Move cursor to the end of an input.
 *
 * @param {input} input	    text input
 *
 * @see #getSelectionStart
 * @see #getSelectionEnd
 * @see #setSelectionText
 * @see #setSelectionRange
 */
Dwt.moveCursorToEnd =
function(input) {
	Dwt.setSelectionRange(input, input.value.length, input.value.length);
};

Dwt.instanceOf =
function(objOrClassName, className) {
	if (typeof objOrClassName == "string") {
		return window[objOrClassName] &&
				(objOrClassName == className || window[objOrClassName].prototype instanceof window[className]);
	}
	return (window[className] && objOrClassName instanceof window[className]);
};

/**
 * Normalizes an argument list into a hash with the given argument names.
 * If a single hash argument is passed, it is recognized as a params hash
 * and returned. Otherwise, the argument list is exploded into a params
 * hash with the given param names.
 * 
 * @param {Object}	args			Array-like structure of arguments
 * @param {array}	paramNames		an ordered list of param names
 */
Dwt.getParams = function(args, paramNames) {

	if (!args || args.length === 0 || (args.length === 1 && !args[0])) {
		return {};
	}

	// Check for arg-list style of passing params. There will almost always
	// be more than one arg, and the first one may be the parent DwtControl.
	// Conversion is not done if there is a single argument that is a simple
	// hash, or a proxy for a simple hash (see AjxUtil.createProxy).

	if (args.length > 1 || !AjxUtil.isHash(args[0]._object_ || args[0])) {
		var params = {};
		for (var i = 0; i < args.length; i++) {
			params[paramNames[i]] = args[i];
		}
		return params;
	}
	if (args.length === 1) {
		return args[0];
	}
	return {};
};

//////////////////////////////////////////////////////////////////////////////////
// PRIVATE METHODS
//////////////////////////////////////////////////////////////////////////////////

Dwt.__REM_RE = /^(-?[0-9]+(?:\.[0-9]*)?)rem$/;

/**
 * @private
 */
Dwt.__checkPxVal =
function(val, check) {
	if (val == Dwt.DEFAULT) { return false; }
	if (isNaN(parseInt(val))) { return false; }

	if (check && val < 0 && val != Dwt.LOC_NOWHERE) {
		DBG.println(AjxDebug.DBG1, "negative pixel value: " + val);
		val = 0;
	}
	if (typeof(val) == "number") {
		val = val + "px";
	}
	if (!AjxEnv.supportsCSS3RemUnits && Dwt.__REM_RE.test(val)) {
		val = DwtCssStyle.asPixelCount(val) + "px";
	}
	return val;
};






/////////////
//	NEW STUFF FROM OWEN
/////////////
Dwt.byId =
function(id, ancestor) {
	if (!ancestor) {
		return (typeof id == "string" ? document.getElementById(id) : id);
	}

	// Find node with id that descends from ancestor (also works on DOM trees
	// that are not attached to the document object)
	if (ancestor == id || ancestor.id == id) {
		return ancestor;
	}

	for (var i = 0; i < ancestor.childNodes.length; i++) {
		if (ancestor.childNodes[i].nodeType == 1) {
			var cnode = Dwt.byId(id, ancestor.childNodes[i]);
			if (cnode) { return cnode; }
		}
	}
	return null;
};

/**
 * Get all elements of a certain tag name. Similar to
 * document.getElementsByTagName(), but returning an Array instead of
 * a NodeList.
 *
 * @param {String} tagName	the tag name, such as "A"
 * @param {HTMLElement} ancestor An optional ancestor element,
 *                      defaults to the document
 * @return	{Array}
 */
Dwt.byTag =
function(tagName, ancestor) {
	if (!ancestor) {
		ancestor = document;
	}

	return AjxUtil.toArray(ancestor.getElementsByTagName(tagName));
};

/**
 * Get all elements of the given class name. Similar to
 * document.getElementsByClassName(), but returning an Array instead
 * of a NodeList.
 *
 * @param {String} className
 * @param {HTMLElement} ancestor An optional ancestor element,
 *                      defaults to the document
 * @return	{Array}
 */
Dwt.byClassName =
function(className, ancestor) {
	if (!ancestor) {
        ancestor = document;
	}

	var nodes;

	if (ancestor.getElementsByClassName) {
		nodes = ancestor.getElementsByClassName(className);
	} else {
		nodes = ancestor.querySelectorAll('.' + className);
	}

	return AjxUtil.toArray(nodes);
};

Dwt.show =
function(it) {
	var el = Dwt.byId(it);
	if (el) {
		Dwt.setVisible(el,true);
	}
};

Dwt.hide =
function(it) {
	var el = Dwt.byId(it);
	if (el) {
		Dwt.setVisible(el,false);
	}
};

//setText Methods

Dwt.setText =
function(htmlEl,text){
	htmlEl.appendChild(document.createTextNode(text));
};

Dwt.populateText =
function(){
	if (arguments.length == 0 ) { return; }

	var node, index = 0, length = arguments.length;
	while (index < length) {
		node = document.getElementById(arguments[index]);
		if (node) {
			Dwt.setText(node,arguments[index+1]);
		}
		index += 2;
	}
};

//setHtml Methods

Dwt.setInnerHtml =
function(htmlEl,html){
	htmlEl.innerHTML = html;
};

/**
 * Sets the favicon.
 *
 * @param {string} the url to the icon to display
 * 
 * @private
 */
Dwt.setFavIcon =
function(iconURL) {

	// Look for an existing fav icon to modify.
	var favIcon = null;
	if (Dwt._favIconId) {
		favIcon = document.getElementById(Dwt._favIconId);
	} else {
		var docHead = document.getElementsByTagName("head")[0];
		var links = docHead.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			var link = links[i];
			if (link.rel.toUpperCase() == "SHORTCUT ICON") {
				if (!link.id) {
					link.id = Dwt._favIconId = Dwt.getNextId();
				}
				favIcon = link;
				break;
			}
		}
	}
	// If available, change the existing favicon.
	// (Need to remove/add to dom in order to force a redraw.)
	if (favIcon) {
		favIcon.href=iconURL;
		favIcon.type = 'image/x-icon';
		var parent = favIcon.parentNode;
		parent.removeChild(favIcon);
		parent.appendChild(favIcon);
	}
	// If no favicon was found in the document, create a new one.
	else {
		var newLink = document.createElement("link");
		newLink.id = Dwt._favIconId = Dwt.getNextId()
		newLink.rel = "SHORTCUT ICON";
		newLink.href = iconURL;
		newLink.type = "image/x-icon";
		docHead = docHead || document.getElementsByTagName("head")[0];
		docHead.appendChild(newLink);
	}
};

Dwt.enableDesignMode =
function(doc, on) {
	if (!AjxEnv.isIE) {
		doc.designMode = on ? "on" : "off";
	} else {
		var editorBody = doc.body;
		if (!editorBody || editorBody.contentEditable === undefined) {
			doc.designMode = on ? "on" : "off";
		} else {
			editorBody.contentEditable = on ? true : false;
		}
	}
};

/**
 * Hack to work around FF 3.6 change in behavior with regard to mouse down/up in
 * scrollbar, which breaks this list view's scrollbar. Return true and tell DOM
 * not to call <code>preventDefault()</code>, since we want default browser behavior.
 * <p>
 * Note: Callers should set up their elements so that a click that is not within
 * a scrollbar goes to a more specific element (and not the one that scrolls).
 * That way we don't have to perform sketchy math to see if the click was in the
 * scrollbar.
 * </p>
 * <p>
 * <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=489667">https://bugzilla.mozilla.org/show_bug.cgi?id=489667</a>
 * </p>
 * <p>It looks like the FF bug will be fixed with the release of 3.6.4.</p>
 * @param {DwtMouseEvent}	ev			the event
 * @return	{boolean}	<code>true</code> if FF3.6+ scrollbar click was detected and handled
 * 
 * @private
 */
Dwt.ffScrollbarCheck =
function(ev) {
	if (AjxEnv.isFirefox3_6up || AjxEnv.isDesktop2up) {
		var t = ev.target;
		if (t && (t.clientHeight && t.scrollHeight && (t.clientHeight != t.scrollHeight)) ||
				 (t.clientWidth && t.scrollWidth && (t.clientWidth != t.scrollWidth)))
		{
			ev._dontCallPreventDefault = true;
			ev._stopPropagation = false;
			ev._returnValue = true;
			return true;
		}
	}
	return false;
};

Dwt.selectText =
function(el) {

	if (!el) {
		Dwt.deselectText();
		return;
	}

	if (document.selection) {
		// IE
		var range = el.parentTextEdit.createTextRange();
		range.moveToElementText(el);
		range.select();
	}
	else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(el);
		var sel = window.getSelection();
		sel.addRange(range);
	}
};

Dwt.deselectText =
function() {

	if (document.selection) {
		// IE
		document.selection.empty();
	}
	else if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
};

/**
 * Inserts some text into an input at the caret.
 *
 * @param {Element}     input       INPUT or TEXTAREA
 * @param {String}      text        text to insert
 */
Dwt.insertText = function(input, text) {

    if (!input || !text) {
        return;
    }

    if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        sel.text = text;
        input.focus();
    }
    else if (AjxUtil.isSpecified(input.selectionStart)) {
        var start = input.selectionStart,
            end = input.selectionEnd;
        input.value = input.value.substring(0, start) + text + input.value.substring(end, input.value.length);
        input.selectionStart = start + text.length;
        input.selectionEnd = end + text.length;
    }
    else {
        input.value += text;
    }
};

/**
 * Returns true if the two elements overlap.
 * 
 * @param el1
 * @param el2
 */
Dwt.doOverlap =
function(el1, el2) {

	if (!el1 || !el2) { return false; }

	var loc1 = Dwt.getLocation(el1), loc2 = Dwt.getLocation(el2);
	var size1 = Dwt.getSize(el1), size2 = Dwt.getSize(el2);
	var left1 = loc1.x, left2 = loc2.x, top1 = loc1.y, top2 = loc2.y;
	var right1 = left1 + size1.x, right2 = left2 + size2.x;
	var bottom1 = top1 + size1.y, bottom2 = top2 + size2.y;

	return !(left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2);
};

/**
 * Resets the scrollTop of container (if necessary) to ensure that element is visible.
 * 
 * @param {Element}		element		the element to be made visible
 * @param {Element}		container	the containing element to possibly scroll
 * @private
 */
Dwt.scrollIntoView =
function(element, container) {
	
	if (!element || !container) { return; }
	
	var elementTop = Dwt.toWindow(element, 0, 0, null, null, DwtPoint.tmp).y;
	var containerTop = Dwt.toWindow(container, 0, 0, null, null, DwtPoint.tmp).y + container.scrollTop;

	var diff = elementTop - containerTop;
	if (diff < 0) {
		container.scrollTop += diff;
	} else {
		var containerH = Dwt.getSize(container, DwtPoint.tmp).y;
		var elementH = Dwt.getSize(element, DwtPoint.tmp).y;
		diff = (elementTop + elementH) - (containerTop + containerH);
		if (diff > 0) {
			container.scrollTop += diff;
		}
	}
};

/**
 * Sets up a hidden div for performance metrics.  Use to set the start of object rendering
 * @param id {String}
 * @param date {Date}
 */
Dwt.setLoadingTime = 
function(id, date) {
	if (!window.isPerfMetric) { return;	}
	date = date || new Date();
	id += "_loading";
	var div = document.getElementById(id);
	if (!div) {
		div = document.createElement("div");
		div.id = id;
		div.style.display = "none";
		document.body.appendChild(div);
	}
	div.innerHTML = date.getTime();
	if (window.appDevMode) {
		console.profile(id);
	}
};

/**
 * Sets up a hidden div for performance metrics.  Use to set the end of object rendering
 * @param id {String}
 * @param date {Date}
 */
Dwt.setLoadedTime = 
function(id, date) {
	if (!window.isPerfMetric) { return;	}
	date = date || new Date();
	id += "_loaded";
	var div = document.getElementById(id);
	if (!div) {
		div = document.createElement("div");
		div.id = id;
		div.style.display = "none";
		document.body.appendChild(div);
	}
	div.innerHTML = date.getTime();
	if (window.appDevMode) {
		console.profileEnd();
	}
};

/**
 * Prints the computed time from performance metrics data
 */
Dwt.printPerfMetric =
function() {
	//code to print all loading stats
	$.each($('div[id*="_loaded"]'), function(index, elem) {
		var end_id = $(elem).attr("id");
		var start_id_prefix = end_id.substring(0,end_id.indexOf("_"));
		var end_elem = $("#" + start_id_prefix+"_launched");
		if (end_elem && end_elem.length > 0) {
			var end_time = $("#" + start_id_prefix+"_launched").html();
		} else {
			end_time = $("#" + start_id_prefix+"_loading").html();
		}
		var log = "Load time for " + start_id_prefix + " is " + ($(elem).html()-end_time);
		DBG.println(AjxDebug.DBG1,log);
		if (console) {
			console.log(log);
		}
	});
}

// Css for Templates
Dwt.createLinearGradientCss =
function(startColor, endColor, direction) {
    var gradientCss = null;
    var gradient = this.createLinearGradientInfo(startColor, endColor, direction);
    if (gradient.field) {
        gradientCss = gradient.field + ":" + gradient.css + ";";
    }
    return gradientCss;
}

/**
 * -- FF 3.6+
 *    background: -moz-linear-gradient(black, white);
 * -- Safari 4+, Chrome 2+
 *    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #000000), color-stop(100%, #ffffff));
 * -- Safari 5.1+, Chrome 10+
 *    background: -webkit-linear-gradient(top, black, white);
 * -- Opera 11.10
 *    background: -o-linear-gradient(black, white);
 * -- IE6 & IE7
 *    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000', endColorstr='#ffffff');
 * -- IE10
 *    background: -ms-linear-gradient(black, white);
 * -- the standard
 *    background: linear-gradient(black, white);
 */
Dwt.createLinearGradientInfo =
function(startColor, endColor, direction) {

    var cssDirection;
    var gradient = {};
	if (AjxEnv.isIE9) {
        var params = {
            x1: "0%",
            x2: direction == 'v' ? "0%" : "100%",
            y1: "0%",
            y2: direction == 'v' ? "100%" : "0%",
            startColor: startColor,
            endColor: endColor
        };
        var svgsrc =
            AjxTemplate.expand('dwt.Widgets#SVGGradient', params);
        gradient.field = "background";
        gradient.css   = ('url(data:image/svg+xml,' +
                          escape(svgsrc.replace(/\s+/g, ' ')) + ')');
    } else if (AjxEnv.isFirefox3_6up) {
        cssDirection = (direction == 'v') ? 'top' : 'left';
        gradient.field = "background";
        gradient.css   = "-moz-linear-gradient(" + cssDirection + "," + startColor + ", "  + endColor + ")";
    } else if ((AjxEnv.isSafari && AjxEnv.isSafari5_1up) || AjxEnv.isChrome10up) {
        cssDirection = (direction == 'v') ? 'top' : 'left';
        gradient.field = "background";
        gradient.css   = "-webkit-linear-gradient(" + cssDirection + ","+
                          startColor + ", " + endColor + ")";
    } else if ((AjxEnv.isSafari && AjxEnv.isSafari4up) || AjxEnv.isChrome2up) {
        var startPt = 'left top';
        var endPt   = (direction == 'v') ? "left bottom" : "right top";
        gradient.field = "background";
        gradient.css   = "-webkit-gradient(linear, " + startPt + ", " + endPt +
                         ", color-stop(0%, " + startColor + "), color-stop(100%, " + endColor + "))";
    } else {
        cssDirection = (direction == 'v') ? 'to bottom' : 'to right';
        gradient.field = "background";
        gradient.css   = "linear-gradient(" + cssDirection + "," + startColor + ", "  + endColor + ")";
    }
    return gradient;
}

// Used for an unattached DOM subtree.
Dwt.getDescendant =
function(htmlElement, id) {
    var descendant = null;
    for (var i = 0; i < htmlElement.childNodes.length; i++) {
        var child = htmlElement.childNodes[i];
        if (child.id == id) {
            descendant = child;
        } else {
            descendant = Dwt.getDescendant(child, id);
        }
        if (descendant != null) {
            break;
        }
    }
    return descendant;
};

Dwt.getPreviousElementSibling =
function(element) {
	var sibling = element.previousElementSibling;

	if (sibling !== undefined) {
		return sibling;
	}

	// workaround for missing previousElementSibling in MSIE 8
	for (sibling = element.previousSibling;
		 sibling && sibling.nodeType !== 1;
		 sibling = sibling.previousSibling);

	return sibling;
}

Dwt.getNextElementSibling =
function(element) {
	var sibling = element.nextElementSibling;

	if (sibling !== undefined) {
		return sibling;
	}

	// workaround for missing nextElementSibling in MSIE 8
	for (sibling = element.nextSibling;
		 sibling && sibling.nodeType !== 1;
		 sibling = sibling.nextSibling);

	return sibling;
}

Dwt.getScrollbarSizes = function(node) {
    var insets = Dwt.getInsets(node);
    var style = DwtCssStyle.getComputedStyleObject(node);

    var bl = parseInt(style.borderLeftWidth)    || 0;
    var bt = parseInt(style.borderTopWidth)     || 0;
    var br = parseInt(style.borderRightWidth)   || 0;
    var bb = parseInt(style.borderBottomWidth)  || 0;

    var width = node.offsetWidth - node.clientWidth - bl - br;
    var height = node.offsetHeight - node.clientHeight - bt - bb;

    return new DwtPoint(width, height);
};
