/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2014, 2015, 2016 Synacor, Inc.
 *
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at: https://www.zimbra.com/license
 * The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15
 * have been added to cover use of software over a computer network and provide for limited attribution
 * for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is Zimbra Open Source Web Client.
 * The Initial Developer of the Original Code is Zimbra, Inc.  All rights to the Original Code were
 * transferred by Zimbra, Inc. to Synacor, Inc. on September 14, 2015.
 *
 * All portions of the code are Copyright (C) 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Clipboard access. Current implementation is built on clipboard.js
 *
 * @class
 * @constructor
 */
AjxClipboard = function() {
	AjxDispatcher.require("Clipboard");
};

/**
 * Returns true if clipboard access is supported.
 * @returns {Boolean}   true if clipboard access is supported
 */
AjxClipboard.isSupported = function() {
	// clipboard.js works on all browsers except IE8 and Safari
	return !AjxEnv.isIE8 && !(AjxEnv.isSafari && !AjxEnv.isChrome);
};

/**
 * Initialize clipboard action
 *
 * @param {DwtControl}          op          widget that initiates copy (eg button or menu item)
 * @param {Object}              listeners   hash of events
 */
AjxClipboard.prototype.init = function(op, listeners) {
	if (listeners.onComplete) {
		this._completionListener = listeners.onComplete.bind(null, this);
	}
	if (op && listeners.onMouseDown) {
		op.addSelectionListener(listeners.onMouseDown.bind(null, this));
	}
};

AjxClipboard.prototype.setText = function(text) {
	if (window.clipboard) {
		clipboard.copy(text).then(this._completionListener, this._onError);
	}
};

AjxClipboard.prototype._onError = function(error) {
	appCtxt.setStatusMsg(error && error.message, ZmStatusView.LEVEL_WARNING);
};
