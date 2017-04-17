/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * @class
 * This class is the base class of all DWT events.
 * 
 * @param {boolean} 	__init 	a dummy parameter used for class initialization
 * 
 * @author Ross Dargahi
 * @author Conrad Damon
 * 
 */
DwtEvent = function(__init) {
	if (arguments.length == 0) return;
	/**
	 * The Dwt object that generated the event
	 * @type DwtControl
	 */
	this.dwtObj = null;
}

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtEvent.prototype.toString = 
function() {
	return "DwtEvent";
}

// native browser events - value is the associated DOM property
/**
 * Browser "onchange" event.
 */
DwtEvent.ONCHANGE = "onchange";

/**
 * Browser "onclick" event.
 */
DwtEvent.ONCLICK = "onclick";

/**
 * Browser "oncontextmenu" event.
 */
DwtEvent.ONCONTEXTMENU = "oncontextmenu";

/**
 * Browser double-click event "ondblclick" event.
 */
DwtEvent.ONDBLCLICK = "ondblclick";

/**
 * Browser "onfocus" event.
 */
DwtEvent.ONFOCUS = "onfocus";

/**
 * Browser "onblur" event.
 */
DwtEvent.ONBLUR = "onblur";

/**
 * Browser "onkeydown" event.
 */
DwtEvent.ONKEYDOWN = "onkeydown";

/**
 * Browser "onkeypress" event.
 */
DwtEvent.ONKEYPRESS = "onkeypress";

/**
 * Browser "onkeyup" event.
 */
DwtEvent.ONKEYUP = "onkeyup";

/**
 * Browser "onmousedown" event.
 */
DwtEvent.ONMOUSEDOWN = "onmousedown";

/**
 * Browser "onmouseenter" event (IE Only) - reported only for the element.
 */
DwtEvent.ONMOUSEENTER = "onmouseenter";

/**
 * Browser "onmouseleave" event (IE Only) - reported only for the element.
 */
DwtEvent.ONMOUSELEAVE = "onmouseleave";

/**
 * Browser "onmousemove" event.
 */
DwtEvent.ONMOUSEMOVE = "onmousemove";

/**
 * Browser "onmouseout" event - reported for element and children.
 */
DwtEvent.ONMOUSEOUT = "onmouseout";

/**
 * Browser "onmouseover" event - reported for element and children.
 */
DwtEvent.ONMOUSEOVER = "onmouseover";

/**
 * Browser "onmouseup" event
 */
DwtEvent.ONMOUSEUP = "onmouseup";

/**
 * Browser "onmousewheel" event.
 */
DwtEvent.ONMOUSEWHEEL = "onmousewheel";

/**
 * Browser "onselectstart" event.
 */
DwtEvent.ONSELECTSTART = "onselectstart";

/**
 * Browser "onscroll" event.
 */
DwtEvent.ONSCROLL = "onscroll";

/**
 * Browser "onpaste" event.
 */
DwtEvent.ONPASTE = "onpaste";

/**
 * Browser "oncut" event.
 */
DwtEvent.ONCUT = "oncut";

/**
 * Browser "oninput" event is fired synchronously when the value of an <input> or <textarea> element is changed.
 */
DwtEvent.ONINPUT = "oninput";

// semantic events

/**
 * Action event. An example is right-clicking on a list item or tree item
 * generally brings up a context menu.
 */
DwtEvent.ACTION	= "ACTION";

/**
 * Control event. Control events are fired by resizing or repositioning {@link DwtControl}s.
 */
DwtEvent.CONTROL = "CONTROL";		// resize

/**
 * Date Range events are fired by the {@link DwtCalendar} widget. This event is
 * fired when the date range of the calendar widget changes.
 */
DwtEvent.DATE_RANGE	= "DATE_RANGE";

/**
 * The dispose event is fired when the {@link DwtControl#dispose} method of a control is called.
 */
DwtEvent.DISPOSE = "DISPOSE";

/**
 * The enter event is fired when the enter key is pressed.
 * @private
 */
DwtEvent.ENTER = "ENTER";			// enter/return key

/**
 * This event is fired when the mouse hovers over a control for a certain period of time.
 */
DwtEvent.HOVEROVER = "HOVEROVER";

/**
 * This event is fired when the mouse stops hovering over a control.
 */
DwtEvent.HOVEROUT = "HOVEROUT";

/**
 * The popdown event is fired when a item (such as a {@link DwtMenu}) is popped down.
 */
DwtEvent.POPDOWN = "POPDOWN";

/**
 * The popup event is fired when a item (such as a {@link DwtMenu}) is popped up.
 */
DwtEvent.POPUP = "POPUP";

/**
 * The selection event is fired when controls are selected. This generally means
 * that there has been a "left mouse button click" in the control (for example: a button, or
 * list item, or tree node).
 */
DwtEvent.SELECTION = "SELECTION";		// left-click

/**
 * A tree event is fired when a {@link DwtTree} node is expanded or collapsed.
 */
DwtEvent.TREE = "TREE";

/**
 * State change events are fired when some intrinsic state of a widget changes. For
 * example it may be that an item was added to a {@link DwtListView}
 */
DwtEvent.STATE_CHANGE	= "STATE_CHANGE";

/**
 * The tab event is fired when the tab key is pressed.
 * @private
 */
DwtEvent.TAB = "TAB";

// XForms
DwtEvent.XFORMS_READY				= "xforms-ready";
DwtEvent.XFORMS_DISPLAY_UPDATED		= "xforms-display-updated";
DwtEvent.XFORMS_VALUE_CHANGED		= "xforms-value-changed";
DwtEvent.XFORMS_FORM_DIRTY_CHANGE	= "xforms-form-dirty-change";
DwtEvent.XFORMS_CHOICES_CHANGED		= "xforms-choices-changed";
DwtEvent.XFORMS_VALUE_ERROR			= "xforms-value-error";
DwtEvent.XFORMS_INSTANCE_CHANGED 	= "xforms-instance-cahnged"; //fires when a new instance is applied to the form

// Convenience lists
/**
 * An array of key event types.
 */
DwtEvent.KEY_EVENTS = [DwtEvent.ONKEYDOWN, DwtEvent.ONKEYPRESS, DwtEvent.ONKEYUP];

/**
 * An array of mouse event types.
 */
DwtEvent.MOUSE_EVENTS = [
	DwtEvent.ONCONTEXTMENU, DwtEvent.ONCLICK, DwtEvent.ONDBLCLICK,
	DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEMOVE, DwtEvent.ONMOUSEUP,
	DwtEvent.ONSELECTSTART, DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT
];

DwtEvent.ONDRAGENTER	=	"ondragenter";
DwtEvent.ONDRAGLEAVE	=	"ondragleave";
DwtEvent.ONDRAGOVER 	=	"ondragover";
DwtEvent.ONDROP 		=	"ondrop";