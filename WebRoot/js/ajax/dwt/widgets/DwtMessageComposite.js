/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates a composite that is populated from a message pattern.
 * @constructor
 * @class
 * This class allows you to create a composite that is populated from
 * a message pattern and inserts controls at the appropriate places.
 * For example, say that the message <code>MyMsg.repeatTimes</code> is
 * defined as the following:
 * <pre>
 * MyMsg.repeatTimes = "Repeat: {0} times";
 * </pre>
 * and you want to replace "{0}" with an input field or perhaps a
 * drop-down menu that enumerates a specific list of choices as part of
 * the application. To do this, you just create a
 * {@link DwtMessageComposite} and set the message format, like so:
 * <pre>
 * var comp = new DwtMessageComposite(parent);
 * comp.setFormat(MyMsg.repeatTimes);
 * </pre>
 * <p>
 * The message composite instantiates an {@link AjxMessageFormat}
 * from the specified message pattern. Then, for each segment it creates
 * static text or a {@link DwtInputField} for replacement segments
 * such as "{0}".
 * <p>
 * To have more control over the controls that are created and inserted
 * into the resulting composite, you can pass a callback object to the
 * method. Each time that a replacement segment is found in the
 * message pattern, the callback is called with the following parameters:
 * <ul>
 * <li>a reference to this message composite object;
 * <li>a reference to the segment object.
 * <li>the index at which the segment was found in the message pattern; and
 * </ul>
 * The segment object will be an instance of
 * <code>AjxMessageFormat.MessageSegment</code> and has the following
 * methods of interest:
 * <ul>
 * <li>toSubPattern
 * <li>getIndex
 * <li>getType
 * <li>getStyle
 * <li>getSegmentFormat
 * </ul>
 * <p>
 * The callback can use this information to determine whether or not
 * a custom control should be created for the segment. If the callback
 * returns <code>null</code>, a standard {@link DwtInputField} is
 * created and inserted. Note: if the callback returns a custom control,
 * it <em>must</em> be an instance of {@link AjxControl}.
 * <p>
 * Here is an example of a message composite created with a callback
 * that generates a custom control for each replacement segment:
 * <pre>
 * function createCustomControl(parent, segment, i) {
 *     return new DwtInputField(parent);
 * }
 *
 * var compParent = ...;
 * var comp = new DwtMessageComposite(compParent);
 *
 * var message = MyMsg.repeatTimes;
 * var callback = new AjxCallback(null, createCustomControl);
 * comp.setFormat(message, callback);
 * </pre>
 *
 * @author Andy Clark
 *
 * @param {Object}		params		hash of params:
 * @param {DwtComposite}	parent    the parent widget.
 * @param {string}	className 	the CSS class
 * @param {constant}	posStyle  		the position style (see {@link DwtControl})
 * @param {DwtComposite}	parent    the parent widget.
 * @param {string}	format   the message that defines the text and controls within this composite control
 * @param {AjxCallback}	[controlCallback]   the callback to create UI components (only used with format specified)
 * @param {AjxCallback}	[hintsCallback]   the callback to provide display hints for the container element of the UI component (only used with format specified)
 * 
 * @extends		DwtComposite
 */
DwtMessageComposite = function(params) {
	if (arguments.length == 0) return;

	params = Dwt.getParams(arguments, DwtMessageComposite.PARAMS);

	if (!params.className) {
		params.className = "DwtMessageComposite";
	}

	DwtComposite.call(this, params);

	this._tabGroup = new DwtTabGroup("DwtMessageComposite");

	if (params.format) {
		this.setFormat(params.format,
		               params.controlCallback,
		               params.hintsCallback);
	}
}

DwtMessageComposite.PARAMS = ['parent', 'className', 'posStyle'];

DwtMessageComposite.prototype = new DwtComposite;
DwtMessageComposite.prototype.constructor = DwtMessageComposite;
DwtMessageComposite.prototype.isDwtMessageComposite = true;

DwtMessageComposite.prototype.toString =
function() {
	return "DwtMessageComposite";
}

// Public methods

/**
 * Sets the format.
 * 
 * @param {string}	message   the message that defines the text and controls that comprise this composite
 * @param {AjxCallback}	[callback]   the callback to create UI components
 * @param {AjxCallback}	[hintsCallback]   the callback to provide display hints for the container element of the UI component
 */
DwtMessageComposite.prototype.setFormat =
function(message, callback, hintsCallback) {
    // create formatter
    this._formatter = new AjxMessageFormat(message);
    this._controls = {};

    // create HTML
    var id = this._htmlElId;
    this.getHtmlElement().innerHTML = "<table class='DwtCompositeTable' border='0' cellspacing='0' cellpadding='0'><tr valign='center'></tr></table>";
    var row = this.getHtmlElement().firstChild.rows[0];

    var segments = this._formatter.getSegments();
    for (var i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var isMsgSegment = segment instanceof AjxMessageFormat.MessageSegment;

        var cid = [id,i].join("_");
        var cell = document.createElement('TD');

        cell.id = cid;
        cell.className = 'DwtCompositeCell';
        row.appendChild(cell);

        if (isMsgSegment) {
            cell.className += ' MessageControl' + segment.getIndex();
            var control = callback ? callback.run(this, segment, i) : null;
            if (!control) {
                control = new DwtInputField({parent:this, parentElement: cell});
            } else {
                control.reparentHtmlElement(cell);
            }
            this._tabGroup.addMember(control.getTabGroupMember());
            if (hintsCallback) {
                var hints = hintsCallback.run(this, segment, i);

                AjxUtil.hashUpdate(control.getHtmlElement(), hints, true);
            }

            var sindex = segment.getIndex();
            this._controls[sindex] = this._controls[sindex] || control;
        }
        else {
            control = new DwtText({parent:this, parentElement: cell});
            control.setText(segment.toSubPattern());
            this._tabGroup.addMember(control);
        }
    }
};

/**
 * Gets the format.
 * 
 * @return	{string}	the format
 */
DwtMessageComposite.prototype.format = function() {
    var args = [];
    for (var sindex in this._controls) {
        args[sindex] = this._controls[sindex].getValue();
    }
    return this._formatter.format(args);
};

DwtMessageComposite.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};
