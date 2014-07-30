/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * 
 * @private
 */
DwtGrouper = function(parent, className, posStyle) {
	if (arguments.length == 0) return;
	className = className || "DwtGrouper";
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, {parent:parent, posStyle:posStyle});
	
	this._labelEl = document.createElement("LEGEND");
	this._insetEl = document.createElement("DIV");
	this._borderEl = document.createElement("FIELDSET");
	this._borderEl.appendChild(this._labelEl);
	this._borderEl.appendChild(this._insetEl);
	
	var element = this.getHtmlElement();
	element.appendChild(this._borderEl);
}

DwtGrouper.prototype = new DwtComposite;
DwtGrouper.prototype.constructor = DwtGrouper;

// Public methods

DwtGrouper.prototype.setLabel = function(htmlContent) {
	Dwt.setVisible(this._labelEl, Boolean(htmlContent));
	// HACK: undo block display set by Dwt.setVisible
	this._labelEl.style.display = "";
	this._labelEl.innerHTML = htmlContent ? htmlContent : "";
};

DwtGrouper.prototype.setContent = function(htmlContent) {
	var element = this._insetEl;
	element.innerHTML = htmlContent;
};

DwtGrouper.prototype.setElement = function(htmlElement) {
	var element = this._insetEl;
	Dwt.removeChildren(element);
	element.appendChild(htmlElement);
};

DwtGrouper.prototype.setView = function(control) {
	this.setElement(control.getHtmlElement());
};

DwtGrouper.prototype.getInsetHtmlElement = function() {
	return this._insetEl;
};