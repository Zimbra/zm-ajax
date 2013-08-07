/*
 * ***** BEGIN LICENSE BLOCK *****
 * 
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2011 Zimbra Software, LLC.
 * 
 * The contents of this file are subject to the Zimbra Public License
 * Version 1.3 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * 
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
