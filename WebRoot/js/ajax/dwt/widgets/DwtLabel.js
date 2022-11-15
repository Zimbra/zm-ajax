/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file defines a label.
 *
 */

/**
 * Creates a label.
 * @constructor
 * @class
 * This class represents a label, which consists of an image and/or text. It is used
 * both as a concrete class and as the base class for {@link DwtButton}. The label
 * components are managed within a table. The label can be enabled or disabled, which are reflected in 
 * its display. A disabled label looks greyed out.
 * 
 * <h4>CSS</h4>
 * <ul>
 * <li><code>.className table</code> - the label table</li>
 * <li><code>.className .Icon</code> - class name for the icon image cell</li>
 * <li><code>.className .Text</code> - enabled text cell</li>
 * <li><code>.className .DisabledText</code> - disabled text cell</li>
 * </ul>
 * 
 * <h4>Keyboard Actions</h4>
 * None
 * 
 * <h4>Events</h4>
 * None
 * 
 * @author Ross Dargahi
 * 
 * @param {hash}		params		the hash of parameters
 * @param	{DwtComposite}	params.parent	the parent widget
 * @param	{constant}	params.style		the label style: May be one of: {@link DwtLabel.IMAGE_LEFT} 
 * 											or {@link DwtLabel.IMAGE_RIGHT} arithmetically or'd (|) with  one of:
 * 											{@link DwtLabel.ALIGN_LEFT}, {@link DwtLabel.ALIGN_CENTER}, or {@link DwtLabel.ALIGN_LEFT}
 * 											The first determines were in the label the icon will appear (if one is set), the second
 * 											determine how the content of the label will be aligned. The default value for
 * 											this parameter is: {@link DwtLabel.IMAGE_LEFT} | {@link DwtLabel.ALIGN_CENTER}
 * @param	{string}	params.className	the CSS class
 * @param	{constant}	params.posStyle		the positioning style (see {@link DwtControl})
 * @param	{string}	params.id			the to use for the control HTML element
 * @param	{number}	params.index 		the index at which to add this control among parent's children
 *        
 * @extends DwtComposite
 */
DwtLabel = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtLabel.PARAMS);
	
	params.className = params.className || "DwtLabel";
	DwtComposite.call(this, params);

	/**
	 * The label style. See the constructor for more info.
	 */
	this._style = params.style || (DwtLabel.IMAGE_LEFT | DwtLabel.ALIGN_CENTER);
	
	/**
	 * The label text background color.
	 */
	this._textBackground = null;
	
	/**
	 * The label text foreground color.
	 */
	this._textForeground = null;

    this._createHtml(params.template);
    //MOW:  this.setCursor("default");
}

DwtLabel.PARAMS = ["parent", "style", "className", "posStyle", "id", "index"];

DwtLabel.prototype = new DwtComposite;
DwtLabel.prototype.constructor = DwtLabel;

DwtLabel.prototype.isFocusable = true;

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtLabel.prototype.toString =
function() {
	return "DwtLabel";
}

//
// Constants
//

// display styles
/**
 * Defines the "left" align image (i.e. align to the left of text, if both present).
 */
DwtLabel.IMAGE_LEFT = 1;

/**
 * Defines the "right" align image (i.e. align to the right of text, if both present).
 */
DwtLabel.IMAGE_RIGHT = 2;

/**
 * Defines both "right" and "left" align images (i.e. align to the left and to the right of text, if all present).
 */
DwtLabel.IMAGE_BOTH = 4;

/**
 * Defines the "left" align label.
 */
DwtLabel.ALIGN_LEFT = 8;

/**
 * Defines the "right" align label.
 */
DwtLabel.ALIGN_RIGHT = 16;

/**
 * Defines the "center" align label.
 */
DwtLabel.ALIGN_CENTER = 32;

/**
 * Defines the last style label (used for subclasses).
 * @private
 */
DwtLabel._LAST_STYLE = 32;

/**
 * Defines the "left" side icon
 */
DwtLabel.LEFT = "left";

/**
 * Defines the "right" side icon
 */
DwtLabel.RIGHT = "right";

//
// Data
//

DwtLabel.prototype.TEMPLATE = "dwt.Widgets#ZLabel";

//
// Public methods
//

/**
 * Disposes of the label.
 * 
 */
DwtLabel.prototype.dispose =
function() {
	delete this._dropDownEl;
	delete this._iconEl;
	delete this._textEl;
	DwtControl.prototype.dispose.call(this);
};

/**
 * Sets the enabled/disabled state of the label. A disabled label may have a different
 * image, and greyed out text. This method overrides {@link DwtControl#setEnabled}.
 *
 * @param {boolean} enabled 		if <code>true</code>, set the label as enabled
 */
DwtLabel.prototype.setEnabled =
function(enabled) {
	if (enabled != this._enabled) {
		DwtControl.prototype.setEnabled.call(this, enabled);
		var direction = this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT;
		this.__imageInfo = this.__imageInfo || {};
		this.__setImage(this.__imageInfo[direction]);
	}
}

/**
 * Gets the current image info.
 *
 * @param	{string}	direction		position of the image
 *
 * @return	{string}	the image info
 */
DwtLabel.prototype.getImage =
function(direction) {
	direction = direction || (this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT);
	return this.__imageInfo[direction];
}

/**
 * Sets the main (enabled) image. If the label is currently enabled, the image is updated.
 *
 * @param	{string}	imageInfo		the image
 * @param	{string}	direction		position of the image
 * @param	{string}	altText			alternate text for non-visual users
 */
DwtLabel.prototype.setImage =
function(imageInfo, direction, altText) {
	direction = direction || (this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT);
	this.__imageInfo = this.__imageInfo || {};
	this.__imageInfo[direction] = imageInfo;
	this.__setImage(imageInfo, direction, altText);
}

/**
 *
 * Set _iconEl, used for buttons that contains only images
 *
 * @param	htmlElement/DOM node
 * @param	{string}				direction		position of the image
 *
 */
DwtLabel.prototype.setIconEl = function(iconElement, direction) {
	this._iconEl = this._iconEl || {};
	direction = direction || (this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT);
	this._iconEl[direction] =  iconElement;
}

/**
 * Sets the disabled image. If the label is currently disabled, its image is updated.
 *
 * @param	{string}	imageInfo		the image
 * @deprecated		no longer support different images for disabled
 * @see		#setImage
 */
DwtLabel.prototype.setDisabledImage =
function(imageInfo) {
	// DEPRECATED -- we no longer support different images for disabled.
	//	See __setImage() for details.
}

/**
 * Gets the label text.
 * 
 * @return	{string}	the text or <code>null</code> if not set
 */
DwtLabel.prototype.getText =
function() {
	return (this.__text != null) ? this.__text : null;
}

/**
* Sets the label text, and manages the placement and display.
*
* @param {string}	text	the new label text
*/
DwtLabel.prototype.setText = function(text) {

    if (!this._textEl) {
	    return;
    }

    if (text == null || text == "") {
        this.__text = null;
        this._textEl.innerHTML = "";
    }
    else {
		this.__text = text;
        this._textEl.innerHTML = text;
    }

	// Do not set combobox selected value as aria-label
	if (!(this instanceof DwtSelect)) {
		this.setAriaLabel(text);
	}
};

/**
 * Sets the text background.
 * 
 * @param	{string}	color	the background color
 */
DwtLabel.prototype.setTextBackground =
function(color) {
	this._textBackground = color;
    if (this._textEl) {
        this._textEl.style.backgroundColor = color;
    }
}

/**
 * Sets the text foreground.
 * 
 * @param	{string}	color	the foreground color
 */
DwtLabel.prototype.setTextForeground =
function(color) {
	this._textForeground = color;
    if (this._textEl) {
		this._textEl.style.color = color;
    }
}

/**
 * Sets the align style.
 * 
 * @param		{constant}		alignStyle		the align style (see {@link DwtControl})
 */
DwtLabel.prototype.setAlign =
function(alignStyle) {
	this._style = alignStyle;

	// reset dom since alignment style may have changed
	var direction = this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT;
	this.__imageInfo = this.__imageInfo || {};
    this.__setImage(this.__imageInfo[direction]);
}

/**
 * Checks if the given style is set as the current label style.
 * 
 * @param	{constant}	style	the style
 * @return	{boolean}	<code>true</code> if the style is set
 */
DwtLabel.prototype.isStyle = function(style) {
    return this._style & style;
};

DwtLabel.prototype.getTabGroupMember =
function() {
	// DwtLabel descends from DwtComposite, as some buttons contain nested
	// members; it's a widget, however, and should be directly focusable
	return DwtControl.prototype.getTabGroupMember.apply(this, arguments);
}

//
// Protected methods
//

/**
 * @private
 */
DwtLabel.prototype._createHtml = function(templateId) {
    var data = { id: this._htmlElId };
    this._createHtmlFromTemplate(templateId || this.TEMPLATE, data);
};

/**
 * @private
 */
DwtLabel.prototype._createHtmlFromTemplate = function(templateId, data) {
    DwtControl.prototype._createHtmlFromTemplate.call(this, templateId, data);
    this._textEl = document.getElementById(data.id+"_title");
};

/**
 * @private
 *
 * @param	{string}	direction		position of the image
 */
DwtLabel.prototype._getIconEl = function(direction) {
    var _dir = this._style & DwtLabel.IMAGE_RIGHT ? DwtLabel.RIGHT : DwtLabel.LEFT;
    direction = typeof direction === 'boolean' ? _dir : (direction || _dir);    // fix for Bug 90130
	// MOW: getting the proper icon element on demand rather than all the time for speed
	this._iconEl = this._iconEl || {};
	return this._iconEl[direction] ||
		(this._iconEl[direction] = document.getElementById(this._htmlElId+"_"+direction+"_icon"));
};

//
// Private methods
//

/**
 * Set the label's image, and manage its placement.
 *
 * @private
 *
 * @param	{string}	imageInfo		the image
 * @param	{string}	direction		position of the image
 * @param	{string}	altText			alternate text for non-visual users
 */
DwtLabel.prototype.__setImage =
function(imageInfo, direction, altText) {
	this.__altText = altText || this.__altText;

	var iconEl = this._getIconEl(direction);
	if (iconEl) {
		if (imageInfo) {
			AjxImg.setImage(iconEl, imageInfo, null, !this._enabled, null, this.__altText);

			// set a ZHasRightIcon or ZHasLeftIcon on the outer element, depending on which we set
			var elementClass = (this._style & DwtLabel.IMAGE_RIGHT ? "ZHasRightIcon" : "ZHasLeftIcon");
			Dwt.addClass(this.getHtmlElement(), elementClass);
		} else {
			iconEl.innerHTML = "";
		}
	}
};

// Accessibility
DwtLabel.prototype.setAriaLabel = function(text) {

	// assign the ARIA label directly; we want it to override the tooltip, if any
	if (!this.hasAttribute('aria-labelledby')) {
		if (text) {
			this.setAttribute('aria-label', text);
		} else {
			this.removeAttribute('aria-label');
		}
	}
};
