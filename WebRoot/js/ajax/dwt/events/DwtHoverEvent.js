/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */


/**
 * 
 * @private
 */
DwtHoverEvent = function(type, delay, object, x, y) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.type = type;
	this.delay = delay;
	this.object = object;
	this.x = x || -1;
	this.y = y || -1;
}

DwtHoverEvent.prototype = new DwtEvent;
DwtHoverEvent.prototype.constructor = DwtHoverEvent;

DwtHoverEvent.prototype.toString = function() { return "DwtHoverEvent"; };

DwtHoverEvent.prototype.reset =
function() {
	this.type = 0;
	this.delay = 0;
	this.object = null;
	this.x = -1;
	this.y = -1;
};
