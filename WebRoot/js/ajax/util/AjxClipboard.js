/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * Clipboard access singleton. Current implementation either builds on
 * ZeroClipboard or adapts clipboard.js to satisfy the same API.
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

// clipboard.js works on all browsers except IE8 and Safari, but triggers a
// prompt on IE9-IE11. However, ZeroClipboard appears broken in IE for more
// than one copy (bug 98289) so we use it anyway.
//
// Since the 'test' corresponds to the platforms supported by clipboard.js, we
// put it here rather than in AjxEnv.
AjxClipboard.USE_JS = !AjxEnv.isIE8 && !(AjxEnv.isSafari && !AjxEnv.isChrome);

/**
 * Returns true if clipboard access is supported.
 * @returns {Boolean}   true if clipboard access is supported
 */
AjxClipboard.isSupported = function() {
	// use clipboard.js when possible, otherwise fallback to ZeroClipboard which
	// requires Flash
	return AjxClipboard.USE_JS ||
	    Boolean(window.ZeroClipboard && AjxPluginDetector.detectFlash());
};

AjxClipboard.prototype._init = function() {
	this._clients = {};

	if (!AjxClipboard.USE_JS) {
		ZeroClipboard.setMoviePath('/js/ajax/3rdparty/zeroclipboard/ZeroClipboard.swf');
	}
};

/**
 * Adds a clipboard client with the given name, and ties it to the given
 * operation (usually a DwtMenuItem) with the given listeners. The listener set
 * is tied to ZeroClipboard's API, so if we ever drop it completely, we can
 * switch to something more sane.
 *
 * @param {String}              name        a key to identify this client
 * @param {DwtControl}          op          widget that initiates copy (eg button or menu item)
 * @param {Object}              listeners   hash of events and (ZeroClipboard) callbacks
 */
AjxClipboard.prototype.addClient = function(name, op, listeners) {

	// use clipboard.js on supported browsers
	if (op && AjxClipboard.USE_JS) {
		this._clients[name] = new AjxClipboard.CJSAdapter(listeners, op);
		return;
	}

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
 * Returns the client with the given name.
 * @param name
 * @returns {*}
 */
AjxClipboard.prototype.getClient = function(name) {
	return this._clients[name];
};

/**
 * Private class which implements the ZeroClipboard API using 'clipboard.js'.
 *
 * @private
 */
AjxClipboard.CJSAdapter = function(listeners, op) {
	this._completionListener = listeners.onComplete;

	var selListener = this._mouseDownListener.bind(this, listeners.onMouseDown);
	op.addSelectionListener(selListener);
};

AjxClipboard.CJSAdapter.prototype._mouseDownListener = function(listener, ev) {
	listener(this);
};

AjxClipboard.CJSAdapter.prototype.setText = function(text) {
	clipboard.copy(text, this._onSuccess.bind(this), this._onError.bind(this));
};

AjxClipboard.CJSAdapter.prototype._onSuccess = function() {
	this._completionListener();
};

AjxClipboard.CJSAdapter.prototype._onError = function(err) {
	appCtxt.setStatusMsg(err && err.message, ZmStatusView.LEVEL_WARNING);
};
