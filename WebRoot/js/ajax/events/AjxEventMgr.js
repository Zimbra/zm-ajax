/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2011, 2013 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * @class
 * This class represents the event manager.
 * 
 * @private
 */
AjxEventMgr = function() {
	this._listeners = new Object();
}

/**
 * Returns a string representation of the object.
 * 
 * @return	{string}		a string representation of the object
 */
AjxEventMgr.prototype.toString = 
function() {
	return "AjxEventMgr";
}

AjxEventMgr.prototype.addListener =
function(eventType, listener, index) {
	var lv = this._listeners[eventType];
	if (lv == null) {
		lv = this._listeners[eventType] = new AjxVector();
	}         	 
	if (!lv.contains(listener)) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.add(listener, index);
		return true;
	}
	return false;
}

AjxEventMgr.prototype.notifyListeners =
function(eventType, event) {
	this._notifyingListeners = true;
	var lv = this._listeners[eventType];
	if (lv != null) {
		var a = lv.getArray();
		var s = lv.size();
		var retVal = null;
		var c = null;
		for (var i = 0; i < s; i++) {
			c = a[i];
			// listener must be an AjxListener or a function
			if (!(c && ((c instanceof AjxListener) || (typeof c == "function")))) {
				continue;
			}
			retVal = c.handleEvent ? c.handleEvent(event) : c(event);
			if (retVal === false) {
				break;
			}
		}
	}	
	this._notifyingListeners = false;
	return retVal;
}

AjxEventMgr.prototype.isListenerRegistered =
function(eventType) {
	var lv = this._listeners[eventType];
	return (lv != null && lv.size() > 0);
}

AjxEventMgr.prototype.removeListener = 
function(eventType, listener) {
	var lv = this._listeners[eventType];
	if (lv != null) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.remove(listener);
		return true;
	}
	return false;
}

AjxEventMgr.prototype.removeAll = 
function(eventType) {
	var lv = this._listeners[eventType];
	if (lv != null) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.removeAll();
		return true;
	}
	return false;
}

AjxEventMgr.prototype.clearAllEvents =
function() {
	var listeners = this._listeners;
    for (var eventType in listeners) {
        this.removeAll(eventType);
    }
};