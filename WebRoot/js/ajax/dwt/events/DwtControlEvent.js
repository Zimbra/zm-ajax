/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2013 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */


/**
 * 
 * @private
 */
DwtControlEvent = function() {
	this.reset();
}
DwtControlEvent.prototype = new DwtEvent;
DwtControlEvent.prototype.constructor = DwtControlEvent;

// type of control event
//      RESIZE	       -- for setSize
//      MOVE	       -- for setLocation
//      RESIZE | MOVE  -- for setBounts (bitwise or)

DwtControlEvent.RESIZE = 1;
DwtControlEvent.MOVE = 2;

DwtControlEvent.prototype.toString = 
function() {
	return "DwtControlEvent";
}

DwtControlEvent.prototype.reset = 
function(type) {
	this.oldX = Dwt.DEFAULT;
	this.oldY = Dwt.DEFAULT;
	this.oldWidth = Dwt.DEFAULT;
	this.oldHeight = Dwt.DEFAULT;
	this.newX = Dwt.DEFAULT;
	this.newY = Dwt.DEFAULT;
	this.newWidth = Dwt.DEFAULT;
	this.newHeight = Dwt.DEFAULT;
	this.type = type || null;
}
