/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011, 2013 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the “License”);
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at: http://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 
 * have been added to cover use of software over a computer network and provide for limited attribution 
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B. 
 * 
 * Software distributed under the License is distributed on an “AS IS” basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. 
 * See the License for the specific language governing rights and limitations under the License. 
 * The Original Code is Zimbra Open Source Web Client. 
 * The Initial Developer of the Original Code is Zimbra, Inc. 
 * All portions of the code are Copyright (C) 2011, 2013 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */
/**
 * @overview
 * A link that is a button. Currently used only for the "help" link/button
 *
 * @author Eran Yarkon
 *
 * @extends	DwtButton

 */
DwtLinkButton = function(params) {
	params.className = params.className || "ZButtonLink";
	this._noDropDown = params.noDropDown;
	this._elementTag = params.elementTag;
	DwtButton.call(this, params);
};


DwtLinkButton.prototype = new DwtButton;
DwtLinkButton.prototype.constructor = DwtLinkButton;

DwtLinkButton.prototype.TEMPLATE = "dwt.Widgets#ZLinkButton";

// defaults for drop down images (set here once on prototype rather than on each button instance)
DwtLinkButton.prototype._dropDownImg 	= null; //no longer using HelpPullDownArrow - we do the arrow via pixel-high divs
DwtLinkButton.prototype._dropDownDepImg	= null; //same as above
DwtLinkButton.prototype._dropDownHovImg = null; //same as above

DwtLinkButton.prototype.toString =
function() {
	return "DwtLinkButton";
};

DwtLinkButton.prototype._createHtmlFromTemplate = function(templateId, data) {
	data = data || {};
	data.noDropDown = this._noDropDown;
	DwtButton.prototype._createHtmlFromTemplate.call(this, templateId, data);
};

DwtLinkButton.prototype._createElement =
function() {
	return document.createElement(this._elementTag || "SPAN");
};