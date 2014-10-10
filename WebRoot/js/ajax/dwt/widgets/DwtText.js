/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates a text control.
 * @constructor
 * @class
 * This class represents a container for a piece of text.
 * 
 * @author Ross Dargahi
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}      parent	the parent widget
 * @param {string}      className		CSS class
 * @param {constant}      posStyle		the positioning style (see {@link DwtControl})
 * @param {string}      id			an explicit ID to use for the control's HTML element
 * 
 * @extends		DwtControl
 */
DwtText = function(params) {
	if (arguments.length == 0) return;
	params = Dwt.getParams(arguments, DwtText.PARAMS);
	params.className = params.className || "DwtText";
	DwtControl.call(this, params);
};

DwtText.PARAMS = ["parent", "className", "posStyle"];

DwtText.prototype = new DwtControl;
DwtText.prototype.constructor = DwtText;

DwtText.prototype.isFocusable = true;

DwtText.prototype.toString =
function() {
	return "DwtText";
};

DwtText.prototype.getTabGroupMember = function() {
	return null;
};

/**
 * Sets the text.
 * 
 * @param	{string}	text		the text
 */
DwtText.prototype.setText =
function(text) {
	if (!this._textNode) {
		 this._textNode = document.createTextNode(text);
		 this.getHtmlElement().appendChild(this._textNode);
	} else {
		try { // IE mysteriously throws an error sometimes, but still does the right thing
			this._textNode.data = text;
		} catch (e) {}
	}
};

/**
 * Gets the text.
 * 
 * @return	{string}	the text
 */
DwtText.prototype.getText =
function() {
	return this._textNode ? this._textNode.data : "";
};

/**
 * Gets the text node.
 * 
 * @return	{Object}	the node
 */
DwtText.prototype.getTextNode =
function() {
	return this._textNode;
};
