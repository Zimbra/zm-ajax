/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * Clipboard access singleton. Current implementation is built on ZeroClipboard.
 *
 * @class
 * @constructor
 */
AjxClipboard = function() {
	if (AjxClipboard.INSTANCE) {
		return AjxClipboard.INSTANCE;
	}
	AjxClipboard.INSTANCE = this;
	this._init();
};

/**
 * Returns true if clipboard access is supported.
 * @returns {Boolean}   true if clipboard access is supported
 */
AjxClipboard.isSupported = function() {
	// ZeroClipboard requires Flash
	return !!(window.ZeroClipboard && AjxPluginDetector.detectFlash());
};

AjxClipboard.prototype._init = function() {
	this._clients = {};
	ZeroClipboard.setMoviePath('/js/ajax/3rdparty/zeroclipboard/ZeroClipboard.swf');
};

/**
 * Adds a (ZeroClipboard) clipboard client with the given name, and ties it to the given operation (usually
 * a DwtMenuItem) with the given listeners. The listener set up pretty much ties us to a ZeroClipboard
 * implementation. If we ever switch to a different implementation, this API will probably have to change.
 *
 * @param {String}              name        a key to identify this client
 * @param {DwtControl}          op          widget that initiates copy (eg button or menu item)
 * @param {Object}              listeners   hash of events and (ZeroClipboard) callbacks
 */
AjxClipboard.prototype.addClient = function(name, op, listeners) {

	if (!op || this._clients[name]) {
		return;
	}

	// ZeroClipboard uses a transparent Flash movie to copy content to the clipboard. For security reasons,
	// the copy has to be user-initiated, so it click-jacks the user's press of the Copy menu item. We need
	// to make sure we propagate the mousedown and mouseup events so that the movie gets them.
	var clip = this._clients[name] = new ZeroClipboard.Client();
	op.setEventPropagation(true, [ DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP ]);
	op.removeListener(DwtEvent.ONMOUSEDOWN, op._listeners[DwtEvent.ONMOUSEDOWN]);
	op.removeListener(DwtEvent.ONMOUSEUP, op._listeners[DwtEvent.ONMOUSEUP]);

	// For some reason, superimposing the movie on just our menu item doesn't work, so we surround our
	// menu item HTML with a friendly container.
	var content = op.getContent(),
		seq = ZeroClipboard.nextId,
		containerId = "d_clip_container" + seq,
		buttonId = "d_clip_button" + seq;

	op.setContent('<div id="' + containerId + '" style="position:relative"><div id="' + buttonId + '">' + content + '</div></div>');
	Dwt.setZIndex(buttonId, Dwt.Z_TOAST);
	clip.glue(buttonId, containerId);

	for (var event in listeners) {
		clip.addEventListener(event, listeners[event]);
	}
};

/**
 * Returns the (ZeroClipboard) client with the given name.
 * @param name
 * @returns {*}
 */
AjxClipboard.prototype.getClient = function(name) {
	return this._clients[name];
};
