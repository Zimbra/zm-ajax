/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */

/**
 * Creates an empty keyboard manager. Intended for use as a singleton.
 * @constructor
 * @class
 * This class is responsible for managing focus and shortcuts via the keyboard. That includes dispatching
 * keyboard events (shortcuts), as well as managing tab groups. It is at the heart of the
 * Dwt keyboard navigation framework.
 * <p>
 * {@link DwtKeyboardMgr} intercepts key strokes and translates
 * them into actions which it then dispatches to the component with focus. If the key
 * stroke is a TAB (or Shift-TAB), then focus is moved based on the current tab group.
 * </p><p>
 * A {@link DwtShell} instantiates its own <i>DwtKeyboardMgr</i> at construction.
 * The keyboard manager may then be retrieved via the shell's <code>getKeyboardMgr()</code>
 * function. Once a handle to the shell's keyboard manager is retrieved, then the user is free
 * to add tab groups, and to register keymaps and handlers with the keyboard manager.
 * </p><p>
 * Focus is managed among a stack of tab groups. The TAB button will move the focus within the
 * current tab group. When a non-TAB is received, we first check if the control can handle it.
 * In general, control key events simulate something the user could do with the mouse, and change
 * the state/appearance of the control. For example, ENTER on a DwtButton simulates a button
 * press. If the control does not handle the key event, the event is handed to the application,
 * which handles it based on its current state. The application key event handler is in a sense
 * global, since it does not matter which control received the event.
 * </p><p>
 * At any given time there is a default handler, which is responsible for determining what
 * action is associated with a particular key sequence, and then taking it. A handler should support
 * the following methods:
 * 
 * <ul>
 * <li><i>getKeyMapName()</i> -- returns the name of the map that defines shortcuts for this handler</li>
 * <li><i>handleKeyAction()</i> -- performs the action associated with a shortcut</li>
 * <li><i>handleKeyEvent()</i>	-- optional override; handler solely responsible for handling event</li>
 * </ul>
 * </p>
 *
 * @author Ross Dargahi
 *
 * @param	{DwtShell}	shell		the shell
 * @see DwtShell
 * @see DwtTabGroup
 * @see DwtKeyMap
 * @see DwtKeyMapMgr
 * 
 * @private
 */
DwtKeyboardMgr = function(shell) {

	DwtKeyboardMgr.__shell = shell;

    this.__kbEventStatus = DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
    this.__keyTimeout = DwtKeyboardMgr.SHORTCUT_TIMEOUT;

    // focus
    this.__tabGrpStack = [];
    this.__currTabGroup = null;
    this.__tabGroupChangeListenerObj = this.__tabGrpChangeListener.bind(this);

    // shortcuts
    this.__shortcutsEnabled = false;
	this.__defaultHandlerStack = [];
	this.__currDefaultHandler = null;
    this.__killKeySeqTimedAction = new AjxTimedAction(this, this.__killKeySequenceAction);
    this.__killKeySeqTimedActionId = -1;
    this.__keySequence = [];
    this._evtMgr = new AjxEventMgr();

    Dwt.setHandler(document, DwtEvent.ONKEYDOWN, DwtKeyboardMgr.__keyDownHdlr);
    Dwt.setHandler(document, DwtEvent.ONKEYUP, DwtKeyboardMgr.__keyUpHdlr);
    Dwt.setHandler(document, DwtEvent.ONKEYPRESS, DwtKeyboardMgr.__keyPressHdlr);
};

DwtKeyboardMgr.prototype.isDwtKeyboardMgr = true;
DwtKeyboardMgr.prototype.toString = function() { return "DwtKeyboardMgr"; };

DwtKeyboardMgr.SHORTCUT_TIMEOUT = 750;

DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED	= "NOT HANDLED";
DwtKeyboardMgr.__KEYSEQ_HANDLED		= "HANDLED";
DwtKeyboardMgr.__KEYSEQ_PENDING		= "PENDING";

/**
 * Checks if the event may be a shortcut from within an input (text input or
 * textarea). Since printable characters are echoed, the shortcut must be non-printable:
 * 
 * <ul>
 * <li>Alt or Ctrl or Meta plus another key</li>
 * <li>Esc</li>
 * </ul>
 * 
 * @param {DwtKeyEvent}	ev	the key event
 * @return	{boolean}	<code>true</code> if the event may be a shortcut
 */

// Enter and all four arrows can be used as shortcuts in an INPUT
DwtKeyboardMgr.IS_INPUT_SHORTCUT_KEY = AjxUtil.arrayAsHash([
    DwtKeyEvent.KEY_END_OF_TEXT,
    DwtKeyEvent.KEY_RETURN,
    DwtKeyEvent.KEY_ARROW_LEFT,
    DwtKeyEvent.KEY_ARROW_UP,
    DwtKeyEvent.KEY_ARROW_RIGHT,
    DwtKeyEvent.KEY_ARROW_DOWN
]);

// Returns true if the key event has a keycode that could be used in an input (INPUT or TEXTAREA) as a shortcut. That
// excludes printable characters.
DwtKeyboardMgr.isPossibleInputShortcut = function(ev) {

	var target = DwtUiEvent.getTarget(ev);
    return !DwtKeyMap.IS_MODIFIER[ev.keyCode] && (ev.keyCode === DwtKeyEvent.KEY_ESCAPE || DwtKeyMapMgr.hasModifier(ev) ||
			(target && target.nodeName.toLowerCase() == "input" && DwtKeyboardMgr.IS_INPUT_SHORTCUT_KEY[ev.keyCode]));
};

/**
 * Pushes the tab group onto the stack and makes it the active tab group.
 * 
 * @param 	{DwtTabGroup}	tabGroup	the tab group to push onto the stack
 * 
 * @see		#popTabGroup
 */
DwtKeyboardMgr.prototype.pushTabGroup = function(tabGroup, preventFocus) {

    if (!(tabGroup && tabGroup.isDwtTabGroup)) {
        DBG.println(AjxDebug.DBG1, "pushTabGroup() called without a tab group: " + tabGroup);
        return;
    }

	DBG.println(AjxDebug.FOCUS, "PUSH tab group " + tabGroup.getName());
	this.__tabGrpStack.push(tabGroup);
	this.__currTabGroup = tabGroup;
	var focusMember = tabGroup.getFocusMember();
	if (!focusMember) {
		focusMember = tabGroup.resetFocusMember(true);
	}
	if (!focusMember) {
		DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr.pushTabGroup: tab group " + tabGroup.__name + " has no members!");
		return;
	}
	tabGroup.addFocusChangeListener(this.__tabGroupChangeListenerObj);
	if (!preventFocus) {
		this.grabFocus(focusMember);
	}
};

/**
 * Pops the current tab group off the top of the tab group stack. The previous 
 * tab group (if there is one) then becomes the current tab group.
 * 
 * @param {DwtTabGroup} [tabGroup]		the tab group to pop. If supplied, then the tab group
 * 		stack is searched for the tab group and it is removed. If <code>null</code>, then the
 * 		top tab group is popped.
 * 
 * @return {DwtTabGroup}	the popped tab group or <code>null</code> if there is one or less tab groups
 */
DwtKeyboardMgr.prototype.popTabGroup = function(tabGroup) {

    if (!(tabGroup && tabGroup.isDwtTabGroup)) {
        DBG.println(AjxDebug.DBG1, "popTabGroup() called without a tab group: " + tabGroup);
        return null;
    }

    DBG.println(AjxDebug.FOCUS, "POP tab group " + tabGroup.getName());
	
	// we never want an empty stack
	if (this.__tabGrpStack.length <= 1) {
		return null;
	}
	
	// If we are popping a tab group that is not on the top of the stack then
	// we need to find it and remove it.
	if (tabGroup && this.__tabGrpStack[this.__tabGrpStack.length - 1] != tabGroup) {
		var a = this.__tabGrpStack;
		var len = a.length;
		for (var i = len - 1; i >= 0; i--) {
			if (tabGroup == a[i]) {
				a[i].dump(AjxDebug.DBG1);
				break;
			}
		}
		
		/* If there is no match in the stack for tabGroup, then simply return null,
		 * else if the match is not the top item on the stack, then remove it from 
		 * the stack. Else we are dealing with the topmost item on the stack so handle it 
		 * as a simple pop. */
		if (i < 0) { // No match
			return null;
		} else if (i != len - 1) { // item is not on top
			// Remove tabGroup
			a.splice(i, 1);
			return tabGroup;
		}
	} 

	var tabGroup = this.__tabGrpStack.pop();
	tabGroup.removeFocusChangeListener(this.__tabGroupChangeListenerObj);
	
	var currTg = null;
	if (this.__tabGrpStack.length > 0) {
		currTg = this.__tabGrpStack[this.__tabGrpStack.length - 1];
		var focusMember = currTg.getFocusMember();
		if (!focusMember) {
			focusMember = currTg.resetFocusMember(true);
		}
		if (focusMember) {
			this.grabFocus(focusMember);
		}
	}
	this.__currTabGroup = currTg;

	return tabGroup;
};

/**
 * Replaces the current tab group with the given tab group.
 * 
 * @param {DwtTabGroup} tabGroup 	the tab group to use
 * @return {DwtTabGroup}	the old tab group
 */
DwtKeyboardMgr.prototype.setTabGroup = function(tabGroup) {

	var otg = this.popTabGroup();
	this.pushTabGroup(tabGroup);

	return otg;
};

/**
 * Gets the current tab group
 *
 * @return {DwtTabGroup}	current tab group
 */
DwtKeyboardMgr.prototype.getCurrentTabGroup = function() {

    return this.__currTabGroup;
};

/**
 * Adds a default handler to the stack. A handler should define a 'handleKeyAction' method.
 *
 * @param {Object}  handler     default handler
 */
DwtKeyboardMgr.prototype.pushDefaultHandler = function(handler) {

	if (!this.isEnabled() || !handler) {
        return;
    }
	DBG.println(AjxDebug.FOCUS, "PUSH default handler: " + handler);
		
	this.__defaultHandlerStack.push(handler);
	this.__currDefaultHandler = handler;
};

/**
 * Removes a default handler from the stack.
 *
 * @return {Object}  handler     a default handler
 */
DwtKeyboardMgr.prototype.popDefaultHandler = function() {

	DBG.println(AjxDebug.FOCUS, "POP default handler");
	// we never want an empty stack
	if (this.__defaultHandlerStack.length <= 1) {
        return null;
    }

	DBG.println(AjxDebug.FOCUS, "Default handler stack length: " + this.__defaultHandlerStack.length);
	var handler = this.__defaultHandlerStack.pop();
	this.__currDefaultHandler = this.__defaultHandlerStack[this.__defaultHandlerStack.length - 1];
	DBG.println(AjxDebug.FOCUS, "Default handler is now: " + this.__currDefaultHandler);

	return handler;
};

/**
 * Sets the focus to the given object.
 * 
 * @param {HTMLInputElement|DwtControl|string} focusObj		the object to which to set focus, or its ID
 */ 
DwtKeyboardMgr.prototype.grabFocus = function(focusObj) {

	if (typeof focusObj === "string") {
		focusObj = document.getElementById(focusObj);
	}
    else if (focusObj && focusObj.isDwtTabGroup) {
        focusObj = focusObj.getFocusMember() || focusObj.getFirstMember();
    }

    if (!focusObj) {
        return;
    }

	// Make sure tab group knows what's currently focused
	if (this.__currTabGroup) {
		this.__currTabGroup.setFocusMember(focusObj, false, true);
	}
		
	this.__doGrabFocus(focusObj);
};

/**
 * Tells the keyboard manager that the given control now has focus. That control will handle shortcuts and become
 * the reference point for tabbing.
 *
 * @param {DwtControl|Element}  focusObj    control (or element) that has focus
 */
DwtKeyboardMgr.prototype.updateFocus = function(focusObj, ev) {

    if (!focusObj) {
        return;
    }

    var ctg = this.__currTabGroup;
    if (ctg) {
        this.__currTabGroup.__showFocusedItem(focusObj, "updateFocus");
    }
    var control = focusObj.isDwtControl ? focusObj : DwtControl.findControl(focusObj);

    // Set the keyboard mgr's focus obj, which will be handed shortcuts. It must be a DwtControl.
    if (control) {
        this.__focusObj = control;
        DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr UPDATEFOCUS kbMgr focus obj: " + control);
    }

    // Update the current (usually root) tab group's focus member to whichever of these it contains: the focus obj,
    // its tab group member, or its control.
    var tgm = this._findTabGroupMember(ev || focusObj);
    if (tgm && ctg) {
        ctg.setFocusMember(tgm, false, true);
    }
};

// Goes up the DOM looking for something (element or control) that is in the current tab group.
DwtKeyboardMgr.prototype._findTabGroupMember = function(obj) {

    var ctg = this.__currTabGroup;
    if (!obj || !ctg) {
        return;
    }

    var htmlEl = (obj.isDwtControl && obj.getHtmlElement()) || DwtUiEvent.getTarget(obj, false) || obj;

    try {
        while (htmlEl) {
            if (ctg.contains(htmlEl)) {
                return htmlEl;
            }
            else {
                var control = DwtControl.ALL_BY_ID[htmlEl.id];
                if (control && ctg.contains(control)) {
                    return control;
                }
                else {
                    var tgm = control && control.getTabGroupMember && control.getTabGroupMember();
                    if (tgm && ctg.contains(tgm)) {
                        return tgm;
                    }
                }
            }
            htmlEl = htmlEl.parentNode;
        }
    } catch(e) {
    }

    return null;
};

/**
 * Gets the object that has focus.
 *
 * @return {HTMLInputElement|DwtControl} focusObj		the object with focus
 */
DwtKeyboardMgr.prototype.getFocusObj = function(focusObj) {

	return this.__focusObj;
};

/**
 * This method is used to register an application key handler. If registered, this
 * handler must support the following methods:
 * <ul>
 * <li><i>getKeyMapName</i>: This method returns a string representing the key map 
 * to be used for looking up actions
 * <li><i>handleKeyAction</i>: This method should handle the key action and return
 * true if it handled it else false. <i>handleKeyAction</i> has two formal parameters
 *    <ul>
 *    <li><i>actionCode</i>: The action code to be handled</li>
 *    <li><i>ev</i>: the {@link DwtKeyEvent} corresponding to the last key event in the sequence</li>
 *    </ul>
 * </ul>
 * 
 * @param 	{function}	hdlr	the handler function. This method should have the following
 * 									signature <code>Boolean hdlr(Int actionCode DwtKeyEvent event);</code>
 * 
 * @see DwtKeyEvent
 */
DwtKeyboardMgr.prototype.registerDefaultKeyActionHandler = function(hdlr) {

	if (this.isEnabled()) {
        this.__defaultKeyActionHdlr = hdlr;
    }
};

/**
 * Registers a keymap with the shell. A keymap typically
 * is a subclass of {@link DwtKeyMap} and defines the mappings from key sequences to
 * actions.
 *
 * @param {DwtKeyMap} keyMap		the key map to register
 * 
 */
DwtKeyboardMgr.prototype.registerKeyMap = function(keyMap) {

	if (this.isEnabled()) {
	    this.__keyMapMgr = new DwtKeyMapMgr(keyMap);
    }
};

/**
 * Sets the timeout (in milliseconds) between key presses for handling multi-keypress sequences.
 * 
 * @param 	{number}	timeout		the timeout (in milliseconds)
 */
DwtKeyboardMgr.prototype.setKeyTimeout = function(timeout) {
	this.__keyTimeout = timeout;
};

/**
 * Clears the key sequence. The next key event will begin a new one.
 * 
 */
DwtKeyboardMgr.prototype.clearKeySeq = function() {

	this.__killKeySeqTimedActionId = -1;
	this.__keySequence = [];
};

/**
 * Enables/disables keyboard nav (shortcuts).
 * 
 * @param 	{boolean}	enabled		if <code>true</code>, enable keyboard nav
 */
DwtKeyboardMgr.prototype.enable = function(enabled) {

	DBG.println(AjxDebug.DBG2, "keyboard shortcuts enabled: " + enabled);
	this.__shortcutsEnabled = enabled;
};

DwtKeyboardMgr.prototype.isEnabled = function() {
	return this.__shortcutsEnabled;
};

/**
 * Adds a global key event listener.
 *
 * @param {constant}	ev			key event type
 * @param {AjxListener}	listener	listener to notify
 */
DwtKeyboardMgr.prototype.addListener = function(ev, listener) {
	this._evtMgr.addListener(ev, listener);
};

/**
 * Removes a global key event listener.
 *
 * @param {constant}	ev			key event type
 * @param {AjxListener}	listener	listener to remove
 */
DwtKeyboardMgr.prototype.removeListener = function(ev, listener) {
	this._evtMgr.removeListener(ev, listener);
};

DwtKeyboardMgr.prototype.__doGrabFocus = function(focusObj) {

	if (!focusObj) {
        return;
    }

    var curFocusObj = this.getFocusObj();
    if (curFocusObj && curFocusObj.blur) {
        DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr DOGRABFOCUS cur focus obj: " + [curFocusObj, curFocusObj._htmlElId || curFocusObj.id].join(' / '));
        curFocusObj.blur();
    }

    DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr DOGRABFOCUS new focus obj: " + [focusObj, focusObj._htmlElId || focusObj.id].join(' / '));
    if (focusObj.focus) {
        // focus handler should lead to focus update, but just in case ...
        this.updateFocus(focusObj.focus() || focusObj);
    }
};

/**
 * @private
 */
DwtKeyboardMgr.__keyUpHdlr = function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	DBG.println(AjxDebug.KEYBOARD, "keyup: " + ev.keyCode);

	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	if (kbMgr._evtMgr.notifyListeners(DwtEvent.ONKEYUP, ev) === false) {
		return false;
	}

	// clear saved Gecko key
	if (AjxEnv.isMac && AjxEnv.isGeckoBased && ev.keyCode === 0) {
		return DwtKeyboardMgr.__keyDownHdlr(ev);
	}
    else {
		return DwtKeyboardMgr.__handleKeyEvent(ev);
	}
};

/**
 * @private
 */
DwtKeyboardMgr.__keyPressHdlr = function(ev) {

	ev = DwtUiEvent.getEvent(ev);
	DBG.println(AjxDebug.KEYBOARD, "keypress: " + (ev.keyCode || ev.charCode));

	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	if (kbMgr._evtMgr.notifyListeners(DwtEvent.ONKEYPRESS, ev) === false) {
		return false;
	}

	DwtKeyEvent.geckoCheck(ev);

	return DwtKeyboardMgr.__handleKeyEvent(ev);
};

/**
 * @private
 */
DwtKeyboardMgr.__handleKeyEvent =
function(ev) {

	if (DwtKeyboardMgr.__shell._blockInput) {
        return false;
    }

	ev = DwtUiEvent.getEvent(ev, this);
	DBG.println(AjxDebug.KEYBOARD, [ev.type, ev.keyCode, ev.charCode, ev.which].join(" / "));
	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	var kev = DwtShell.keyEvent;
	kev.setFromDhtmlEvent(ev);

	if (kbMgr.__kbEventStatus != DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED) {
		return kbMgr.__processKeyEvent(ev, kev, false);
	}
};

/**
 * @private
 */
DwtKeyboardMgr.__keyDownHdlr = function(ev) {

	try {

	ev = DwtUiEvent.getEvent(ev, this);
	var kbMgr = DwtKeyboardMgr.__shell.getKeyboardMgr();
	ev.focusObj = null;
	if (kbMgr._evtMgr.notifyListeners(DwtEvent.ONKEYDOWN, ev) === false) {
		return false;
	}

	if (DwtKeyboardMgr.__shell._blockInput) {
        return false;
    }
	DBG.println(AjxDebug.KEYBOARD, [ev.type, ev.keyCode, ev.charCode, ev.which].join(" / "));

	var kev = DwtShell.keyEvent;
	kev.setFromDhtmlEvent(ev);
	var keyCode = DwtKeyEvent.getCharCode(ev);
	DBG.println(AjxDebug.KEYBOARD, "keydown: " + keyCode + " -------- " + ev.target);

	// Popdown any tooltip
	DwtKeyboardMgr.__shell.getToolTip().popdown();

    /********* FOCUS MANAGEMENT *********/

	/* The first thing we care about is the tab key since we want to manage
	 * focus based on the tab groups. 
	 * 
	 * If the tab hit happens in the currently
	 * focused obj, the go to the next/prev element in the tab group. 
	 * 
	 * If the tab happens in an element that is in the tab group hierarchy, but that 
	 * element is not the currently focus element in the tab hierarchy (e.g. the user
	 * clicked in it and we didnt detect it) then sync the tab group's current focus 
	 * element and handle the tab
	 * 
	 * If the tab happens in an object not under the tab group hierarchy, then set
	 * focus to the current focus object in the tab hierarchy i.e. grab back control
	 */
    var ctg = kbMgr.__currTabGroup,
        member;

	if (keyCode == DwtKeyEvent.KEY_TAB) {
	    if (ctg && !DwtKeyMapMgr.hasModifier(kev)) {
			DBG.println(AjxDebug.FOCUS, "Tab");
			// If the tab hit is in an element or if the current tab group has a focus member
			if (ctg.getFocusMember()) {
                member = kev.shiftKey ? ctg.getPrevFocusMember(true) : ctg.getNextFocusMember(true);
			}
            else {
			 	DBG.println(AjxDebug.FOCUS, "DwtKeyboardMgr.__keyDownHdlr: no current focus member, resetting to first in tab group");
			 	// If there is no current focus member, then reset
                member = ctg.resetFocusMember(true);
			}
	    }
        // If we did not handle the Tab, let the browser handle it
        return kbMgr.__processKeyEvent(ev, kev, !member, member ? DwtKeyboardMgr.__KEYSEQ_HANDLED : DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED);
	}
    else if (ctg && AjxEnv.isGecko && kev.target instanceof HTMLHtmlElement) {
	 	/* With FF we focus get set to the <html> element when tabbing in
	 	 * from the address or search fields. What we want to do is capture
	 	 * this here and reset the focus to the first element in the tabgroup
	 	 * 
	 	 * TODO Verify this trick is needed/works with IE/Safari
	 	 */
        member = ctg.resetFocusMember(true);
	}
	 
    // Allow key events to propagate when keyboard manager is disabled (to avoid taking over browser shortcuts). Bugzilla #45469.
    if (!kbMgr.isEnabled()) {
        return true;
    }


    /********* SHORTCUTS *********/

	// Filter out modifier keys. If we're in an input field, filter out legitimate input.
	// (A shortcut from an input field must use a modifier key.)
	if (DwtKeyMap.IS_MODIFIER[keyCode] || (kbMgr.__killKeySeqTimedActionId === -1 &&
		kev.target && DwtKeyMapMgr.isInputElement(kev.target) && !kev.target["data-hidden"] && !DwtKeyboardMgr.isPossibleInputShortcut(kev))) {

	 	return kbMgr.__processKeyEvent(ev, kev, true, DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED);
	}
	 
	/* Cancel any pending time action to kill the keysequence */
	if (kbMgr.__killKeySeqTimedActionId != -1) {
		AjxTimedAction.cancelAction(kbMgr.__killKeySeqTimedActionId);
		kbMgr.__killKeySeqTimedActionId = -1;
	}
		
 	var parts = [];
	if (kev.altKey) 	{ parts.push(DwtKeyMap.ALT); }
	if (kev.ctrlKey) 	{ parts.push(DwtKeyMap.CTRL); }
 	if (kev.metaKey) 	{ parts.push(DwtKeyMap.META); }
	if (kev.shiftKey) 	{ parts.push(DwtKeyMap.SHIFT); }
	parts.push(keyCode);
	kbMgr.__keySequence[kbMgr.__keySequence.length] = parts.join(DwtKeyMap.JOIN);

	DBG.println(AjxDebug.KEYBOARD, "KEYCODE: " + keyCode + " - KEY SEQ: " + kbMgr.__keySequence.join(""));
	
	var handled = DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;

	// First see if the control that currently has focus can handle the key event
	var obj = ev.focusObj || kbMgr.__focusObj;
    var hasFocus = obj && obj.hasFocus && obj.hasFocus();
    DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr::__keyDownHdlr - focus object " + obj + " has focus: " + hasFocus);
	if (hasFocus && obj.handleKeyAction) {
		handled = kbMgr.__dispatchKeyEvent(obj, kev);
		while ((handled === DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED) && obj.parent) {
			obj = obj.parent;
            if (obj.getKeyMapName) {
			    handled = kbMgr.__dispatchKeyEvent(obj, kev);
            }
		}
	}

	// If the currently focused control didn't handle the event, hand it to the default key event handler
	if (handled === DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED && kbMgr.__currDefaultHandler) {
		handled = kbMgr.__dispatchKeyEvent(kbMgr.__currDefaultHandler, kev);
	}

	// see if we should let browser handle the event as well; note that we need to set the 'handled' var rather than
	// just the 'propagate' one below, since the keyboard mgr isn't built for both it and the browser to handle the event.
	if (kev.forcePropagate) {
		handled = DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
		kev.forcePropagate = false;
	}
	
	kbMgr.__kbEventStatus = handled;
	var propagate = (handled == DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED);

	if (handled != DwtKeyboardMgr.__KEYSEQ_PENDING) {
		kbMgr.clearKeySeq();
	}

	return kbMgr.__processKeyEvent(ev, kev, propagate);

	} catch (ex) {
		AjxException.reportScriptError(ex);
	}
};

/**
 * Handles event dispatching
 * 
 * @private
 */
DwtKeyboardMgr.prototype.__dispatchKeyEvent = function(hdlr, ev, forceActionCode) {

	if (hdlr && hdlr.handleKeyEvent) {
		var handled = hdlr.handleKeyEvent(ev);
		return handled ? DwtKeyboardMgr.__KEYSEQ_HANDLED : DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}

	var mapName = (hdlr && hdlr.getKeyMapName) ? hdlr.getKeyMapName() : null;
	if (!mapName) {
		return DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}

	DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__dispatchKeyEvent: handler " + hdlr.toString() + " handling " + this.__keySequence + " for map: " + mapName);
	var actionCode = this.__keyMapMgr.getActionCode(this.__keySequence, mapName, forceActionCode);
	if (actionCode === DwtKeyMapMgr.NOT_A_TERMINAL) {
		DBG.println(AjxDebug.KEYBOARD, "scheduling action to kill key sequence");
		/* setup a timed action to redispatch/kill the key sequence in the event
		 * the user does not press another key in the allotted time */
		this.__hdlr = hdlr;
		this.__mapName = mapName;
		this.__ev = ev;
		this.__killKeySeqTimedActionId = AjxTimedAction.scheduleAction(this.__killKeySeqTimedAction, this.__keyTimeout);
		return DwtKeyboardMgr.__KEYSEQ_PENDING;	
	}
    else if (actionCode != null) {
		/* It is possible that the component may not handle a valid action
		 * particulary actions defined in the default map */
		DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__dispatchKeyEvent: handling action: " + actionCode);
		if (!hdlr.handleKeyAction) {
			return DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
		}
		var result = hdlr.handleKeyAction(actionCode, ev);
		return result ? DwtKeyboardMgr.__KEYSEQ_HANDLED : DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}
    else {
		DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__dispatchKeyEvent: no action code for " + this.__keySequence);
		return DwtKeyboardMgr.__KEYSEQ_NOT_HANDLED;
	}
};

/**
 * This method will reattempt to handle the event in the case that the intermediate
 * node in the keymap may have an action code associated with it.
 * 
 * @private
 */
DwtKeyboardMgr.prototype.__killKeySequenceAction = function() {

	DBG.println(AjxDebug.KEYBOARD, "DwtKeyboardMgr.__killKeySequenceAction: " + this.__mapName);
	this.__dispatchKeyEvent(this.__hdlr, this.__ev, true);
	this.clearKeySeq();
};

/**
 * @private
 */
DwtKeyboardMgr.prototype.__tabGrpChangeListener = function(ev) {
	this.__doGrabFocus(ev.newFocusMember);
};

/**
 * @private
 */
DwtKeyboardMgr.prototype.__processKeyEvent = function(ev, kev, propagate, status) {

	if (status) {
		this.__kbEventStatus = status;
	}
	kev._stopPropagation = !propagate;
	kev._returnValue = propagate;
	kev.setToDhtmlEvent(ev);
	DBG.println(AjxDebug.KEYBOARD, "key event returning: " + propagate);
	return propagate;
};
