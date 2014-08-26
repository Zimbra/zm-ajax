/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file contains the result class.
 */

/**
 * Creates a CSFE result object.
 * @class
 * This class represents the result of a CSFE request. The data is either the 
 * response that was received, or an exception. If the request resulted in a 
 * SOAP fault from the server, there will also be a SOAP header present.
 *
 * @author Conrad Damon
 * 
 * @param {Object}	data			the response data
 * @param {Boolean}	isException	if <code>true</code>, the data is an exception object
 * @param {Object}	header			the SOAP header
 * 
 */
ZmCsfeResult = function(data, isException, header) {
	this.set(data, isException, header);
};

ZmCsfeResult.prototype.isZmCsfeResult = true;
ZmCsfeResult.prototype.toString = function() { return "ZmCsfeResult"; };

/**
 * Sets the content of the result.
 *
 * @param {Object}	data			the response data
 * @param {Boolean}	isException	if <code>true</code>, the data is an exception object
 * @param {Object}	header			the SOAP header
 */
ZmCsfeResult.prototype.set =
function(data, isException, header) {
	this._data = data;
	this._isException = (isException === true);
	this._header = header;
};

/**
 * Gets the response data. If there was an exception, throws the exception.
 * 
 * @return	{Object}	the data
 */
ZmCsfeResult.prototype.getResponse =
function() {
	if (this._isException) {
		throw this._data;
	} else {
		return this._data;
	}
};

/**
 * Gets the exception object, if any.
 * 
 * @return	{ZmCsfeException}	the exception or <code>null</code> for none
 */
ZmCsfeResult.prototype.getException =
function() {
	return this._isException ? this._data : null;
};

/**
 * Checks if this result is an exception.
 * 
 * @return	{Boolean}	<code>true</code> if an exception
 */
ZmCsfeResult.prototype.isException = 
function() {
	return this._isException;
};

/**
 * Gets the SOAP header that came with a SOAP fault.
 * 
 * @return	{String}	the header
 */
ZmCsfeResult.prototype.getHeader =
function() {
	return this._header;
};
