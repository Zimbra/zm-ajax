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

ZmBaseSplashScreen = function(shell, imageInfo, className) {

 	if (arguments.length == 0) return;
	
 	if (!(shell instanceof DwtShell)) {
 		throw new AjxException("Parent must be a DwtShell", AjxException.INVALIDPARENT, "ZSplashScreen");
 	}
	
 	className = className || "ZSplashScreen";
 	DwtControl.call(this, {parent:shell, className:className, posStyle:Dwt.ABSOLUTE_STYLE});

	this.__createContents();
}

ZmBaseSplashScreen.prototype = new DwtControl;
ZmBaseSplashScreen.prototype.constructor = ZmBaseSplashScreen;

/** abstract **/
ZmBaseSplashScreen.prototype.getHtml = function() { }

ZmBaseSplashScreen.prototype.setVisible =
function(visible) {
	if (visible == this.getVisible()) {
		return;
	}
	
	if (visible) {
		this.__createContents();
	}		

	DwtControl.prototype.setVisible.call(this, visible);	
	
	if (!visible) {
		this.getHtmlElement().innerHTML = "";
	}
};

ZmBaseSplashScreen.prototype.__createContents =
function() {
	var htmlEl = this.getHtmlElement();
 	htmlEl.style.zIndex = Dwt.Z_SPLASH;
	
 	var myTable = document.createElement("table");
 	myTable.border = myTable.cellSpacing = myTable.cellPadding = 0;
 	Dwt.setSize(myTable, "100%", "100%");
	
 	var row = myTable.insertRow(0);
 	var cell = row.insertCell(0);
 	cell.vAlign = "middle";
 	cell.align = "center";
	cell.innerHTML = this.getHtml();
 	htmlEl.appendChild(myTable);
	htmlEl.style.cursor = "wait";
};
