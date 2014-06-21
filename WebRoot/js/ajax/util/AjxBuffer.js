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
 * @class
 * Use this class to implement an efficient String Buffer. It is especially useful for assembling HTML.
 * <p>
 * Usage:
 * <ol>
 * <li>For a small amount of text, call it statically as:
 * <pre>
 * AjxBuffer.concat("a", 1, "b", this.getFoo(), ...);
 * </pre>
 * </li>
 * <li>Or create an instance and use that to assemble a big pile of HTML:
 * <pre>
 * var buffer = new AjxBuffer();
 * buffer.append("foo", myObject.someOtherFoo(), ...);
 * ...
 * buffer.append(fooo.yetMoreFoo());
 * return buffer.toString();
 * </pre>
 * </li>
 * </ol>
 * 
 * It is useful (and quicker!) to create a single buffer and then pass that to subroutines
 * that are doing assembly of HTML pieces for you.
 * </p><p>
 * Note: in both modes you can pass as many arguments you like to the
 * methods -- this is quite a bit faster than concatenating the arguments
 * with the + sign (eg: do not do <code>buffer.append("a" + b.foo());</code>).
 *
 * @author Owen Williams
 * 
 * @private
 */
AjxBuffer = function() {
	this.clear();
	if (arguments.length > 0) {
		arguments.join = this.buffer.join;
		this.buffer[this.buffer.length] = arguments.join("");
	}
}
AjxBuffer.prototype.toString = function () {
	return this.buffer.join("");
}
AjxBuffer.prototype.join = function (delim) {
	if (delim == null) delim = "";
	return this.buffer.join(delim);
}
AjxBuffer.prototype.append = function () {
	arguments.join = this.buffer.join;
	this.buffer[this.buffer.length] = arguments.join("");
}
AjxBuffer.prototype.join = function (str) {
	return this.buffer.join(str);
}
AjxBuffer.prototype.set = function(str) {
	this.buffer = [str];
}
AjxBuffer.prototype.clear = function() {
	this.buffer = [];
}
AjxBuffer.concat = function() {
	arguments.join = Array.prototype.join;
	return arguments.join("");
}
AjxBuffer.append = AjxBuffer.concat;
