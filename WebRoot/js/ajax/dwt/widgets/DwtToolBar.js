/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014 Zimbra, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014 Zimbra, Inc. All Rights Reserved. 
 * ***** END LICENSE BLOCK *****
 */

/**
 * @overview
 * This file defines a toolbar.
 *
 */

/**
 * Creates a toolbar.
 * @constructor
 * @class
 * Creates a toolbar. Components must be added via the <code>add*()</code> functions.
 * A toolbar is a horizontal or vertical strip of widgets (usually buttons).
 *
 * @author Ross Dargahi
 * 
 * @param {hash}	params		a hash of parameters
 * @param	{DwtComposite}	params.parent	the parent widget
 * @param	{string}	params.className				the CSS class
 * @param	{DwtToolBar.HORIZ_STYLE|DwtToolBar.VERT_STYLE}	params.posStyle		the positioning style
 * @param	{constant}	params.style					the menu style
 * @param	{number}	params.index 				the index at which to add this control among parent's children
 * 
 * @extends	DwtComposite
 */
DwtToolBar = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtToolBar.PARAMS);

	params.className = params.className || "ZToolbar";
	DwtComposite.call(this, params);

	// since we attach event handlers at the toolbar level, make sure we don't double up on
	// handlers when we have a toolbar within a toolbar
	if (params.parent instanceof DwtToolBar) {
		this._hasSetMouseEvents = params.parent._hasSetMouseEvents;
	}
	if (params.handleMouse !== false && !this._hasSetMouseEvents) {
		var events = [DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP, DwtEvent.ONCLICK];
		if (!AjxEnv.isIE) {
			events.push(DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT);
		}
		this._setEventHdlrs(events);
		this._hasSetMouseEvents = true;
	}

	this._style = params.style || DwtToolBar.HORIZ_STYLE;
    this._createHtml();

    this._numFillers = 0;
	this._curFocusIndex = 0;

	this._keyMapName = (this._style == DwtToolBar.HORIZ_STYLE) ? DwtKeyMap.MAP_TOOLBAR_HORIZ : DwtKeyMap.MAP_TOOLBAR_VERT;
};

DwtToolBar.PARAMS = ["parent", "className", "posStyle", "style", "index", "id"];

DwtToolBar.prototype = new DwtComposite;
DwtToolBar.prototype.constructor = DwtToolBar;
DwtToolBar.prototype.role = 'toolbar';

DwtToolBar.prototype.isDwtToolBar = true;
DwtToolBar.prototype.toString = function() { return "DwtToolBar"; };

//
// Constants
//

/**
 * Defines the "horizontal" style.
 */
DwtToolBar.HORIZ_STYLE	= 1;
/**
 * Defines the "vertical" style.
 */
DwtToolBar.VERT_STYLE	= 2;

DwtToolBar.FIRST_ITEM    = "ZFirstItem";
DwtToolBar.LAST_ITEM     = "ZLastItem";
DwtToolBar.SELECTED_NEXT = DwtControl.SELECTED + "Next";
DwtToolBar.SELECTED_PREV = DwtControl.SELECTED + "Prev";
DwtToolBar._NEXT_PREV_RE = new RegExp(
    "\\b" +
    [ DwtToolBar.SELECTED_NEXT, DwtToolBar.SELECTED_PREV ].join("|") +
    "\\b", "g"
);

//
// Data
//

// main template

DwtToolBar.prototype.TEMPLATE = "dwt.Widgets#ZToolbar";

// item templates

DwtToolBar.prototype.ITEM_TEMPLATE = "dwt.Widgets#ZToolbarItem";
DwtToolBar.prototype.SEPARATOR_TEMPLATE = "dwt.Widgets#ZToolbarSeparator";
DwtToolBar.prototype.SPACER_TEMPLATE = "dwt.Widgets#ZToolbarSpacer";
DwtToolBar.prototype.FILLER_TEMPLATE = "dwt.Widgets#ZToolbarFiller";

// static data

DwtToolBar.__itemCount = 0;

//
// Public methods
//

DwtToolBar.prototype.dispose =
function() {
	DwtComposite.prototype.dispose.call(this);
	this._itemsEl = null;
	this._prefixEl = null;
	this._suffixEl = null;
};

/**
 * Gets the item.
 * 
 * @param	{int}		index	the index
 * @return	{Object}	the item
 */
DwtToolBar.prototype.getItem =
function(index) {
	return this._children.get(index);
};

/**
 * Gets the item count.
 * 
 * @return	{number}	the size of the children items
 */
DwtToolBar.prototype.getItemCount =
function() {
	return this._children.size();
};

/**
 * Gets the items.
 * 
 * @return	{array}	an array of children items
 */
DwtToolBar.prototype.getItems =
function() {
	return this._children.getArray();
};

// item creation
/**
 * Adds a spacer.
 * 
 * @param	{string}	className	the spacer CSS class name
 * @param	{number}	index		the index for the spacer
 * @return	{Object}	the newly added element
 */
DwtToolBar.prototype.addSpacer =
function(className, index) {
	var spacer = new DwtToolBarSpacer({
		parent: this,
		index: index,
		className: className,
		toolbarItemTemplate: this.SPACER_TEMPLATE,
		id: this._htmlElId + '_spacer' + DwtToolBar.__itemCount
	});

	return spacer;
};

/**
 * Adds a separator.
 * 
 * @param	{string}	className	the separator CSS class name
 * @param	{number}	index		the index for the separator
 * @return	{Object}	the newly added element
 */
DwtToolBar.prototype.addSeparator =
function(className, index) {
	var sep = new DwtToolBarSpacer({
		parent: this,
		index: index,
		className: className,
		toolbarItemTemplate: this.SEPARATOR_TEMPLATE,
		id: this._htmlElId + '_separator' + DwtToolBar.__itemCount
	});

	return sep;
};

/**
 * Adds a filler.
 * 
 * @param	{string}	className	the CSS class name
 * @param	{number}	index		the index for the filler
 * @return	{Object}	the newly added element
 */
DwtToolBar.prototype.addFiller =
function(className, index) {
	var filler = new DwtToolBarSpacer({
		parent: this,
		index: index,
		className: className,
		toolbarItemTemplate: this.FILLER_TEMPLATE,
		id: this._htmlElId + '_filler' + DwtToolBar.__itemCount
	});

	return filler;
};

// DwtComposite methods

/**
 * Adds a child item.
 * 
 * @param	{Object}	child	the child item
 * @param	{number}	index		the index for the child
 */
DwtToolBar.prototype.addChild =
function(child, index) {
	// get the reference element for insertion
	var placeControl = this.getChild(index);
	var placeEl = placeControl ?
		placeControl.getHtmlElement().parentNode : this._suffixEl;

	// actually add the child
	DwtComposite.prototype.addChild.apply(this, arguments);

	// create and insert the item element
	var itemEl = this._createItemElement(child.toolbarItemTemplate);
	this._itemsEl.insertBefore(itemEl, placeEl);

	// finally, move the child to the item
	child.reparentHtmlElement(itemEl);
};

DwtToolBar.prototype.removeChild =
function(child) {
	var item = child.getHtmlElement().parentNode;

	DwtComposite.prototype.removeChild.apply(this, arguments);

	this._itemsEl.removeChild(item);
};

// keyboard nav

/**
 * Gets the key map name.
 * 
 * @return	{string}	the key map name
 */
DwtToolBar.prototype.getKeyMapName =
function() {
    return this._keyMapName;
};

DwtToolBar.prototype.handleKeyAction =
function(actionCode, ev) {

	var item = this.getItem(this._curFocusIndex);
	var numItems = this.getItemCount();
	if (numItems < 2) {
		return false;
	}

	switch (actionCode) {

		case DwtKeyMap.PREV:
			if (this._curFocusIndex > 0) {
				this._moveFocus(true);
				return true;
			}
			break;

		case DwtKeyMap.NEXT:
			if (this._curFocusIndex < (numItems - 1)) {
				this._moveFocus();
				return true;
			}
			break;

		default:
			// pass everything else to currently focused item
			if (item) {
				return item.handleKeyAction(actionCode, ev);
			}
	}
};

//
// Protected methods
//

// utility

/**
 * @private
 */
DwtToolBar.prototype._createItemId =
function(id) {
    id = id || this._htmlElId;
    var itemId = [id, "item", ++DwtToolBar.__itemCount].join("_");
    return itemId;
};

// html creation

/**
 * @private
 */
DwtToolBar.prototype._createHtml =
function() {
    var data = { id: this._htmlElId };
    this._createHtmlFromTemplate(this.TEMPLATE, data);
    this._itemsEl = document.getElementById(data.id+"_items");
    this._prefixEl = document.getElementById(data.id+"_prefix");
    this._suffixEl = document.getElementById(data.id+"_suffix");
};

/**
 * @private
 */
DwtToolBar.prototype._createItemElement =
function(templateId) {
        templateId = templateId || this.ITEM_TEMPLATE;
        var data = { id: this._htmlElId, itemId: this._createItemId() };
        var html = AjxTemplate.expand(templateId, data);

        // the following is like scratching your back with your heel:
        //     var fragment = Dwt.toDocumentFragment(html, data.itemId);
        //     return (AjxUtil.getFirstElement(fragment));

        var cont = AjxStringUtil.calcDIV();
        cont.innerHTML = html;
        return cont.firstChild.rows[0].cells[0]; // DIV->TABLE->TR->TD
};

/**
 * transfer focus to the current item
 * @private
 */
DwtToolBar.prototype._focus =
function(item) {
	DBG.println(AjxDebug.DBG3, "DwtToolBar: FOCUS");
	// make sure the key for expanding a button submenu matches our style
	if (!this._submenuKeySet) {
		var kbm = this.shell.getKeyboardMgr();
		if (kbm.isEnabled()) {
			var kmm = kbm.__keyMapMgr;
			if (kmm) {
				if (this._style == DwtToolBar.HORIZ_STYLE) {
					kmm.removeMapping(DwtKeyMap.MAP_BUTTON, "ArrowRight");
					kmm.setMapping(DwtKeyMap.MAP_BUTTON, "ArrowDown", DwtKeyMap.SUBMENU);
				} else {
					kmm.removeMapping(DwtKeyMap.MAP_BUTTON, "ArrowDown");
					kmm.setMapping(DwtKeyMap.MAP_BUTTON, "ArrowRight", DwtKeyMap.SUBMENU);
				}
				kmm.reloadMap(DwtKeyMap.MAP_BUTTON);
			}
		}
		this._submenuKeySet = true;
	}

	item = item ? item : this._getFocusItem(this._curFocusIndex);
	if (item) {
		item.focus();
	} else {
		// if current item isn't focusable, find first one that is
		this._moveFocus();
	}
};

/**
 * blur the current item.
 * 
 * @private
 */
DwtToolBar.prototype._blur =
function(item) {
	DBG.println(AjxDebug.DBG3, "DwtToolBar: BLUR");
	item = item ? item : this._getFocusItem(this._curFocusIndex);
	if (item) {
		item.blur();
	}
};

/**
 * Returns the item at the given index, as long as it can accept focus.
 * For now, we only move focus to simple components like buttons. Also,
 * the item must be enabled and visible.
 *
 * @param {number}	index		the index of item within toolbar
 * @return	{Object}	the item
 * 
 * @private
 */
DwtToolBar.prototype._getFocusItem =
function(index) {
	var item = this.getItem(index);
	if (!item)									{ return null; }
	if (item._noFocus)							{ return null; }
	if (item.getEnabled && !item.getEnabled())	{ return null; }
	if (item.getVisible && !item.getVisible())	{ return null; }
	if (item.isDwtText && !item.getText())		{ return null; }
	return item;
};

/**
 * Moves focus to next or previous item that can take focus.
 *
 * @param {boolean}	back		if <code>true</code>, move focus to previous item
 * 
 * @private
 */
DwtToolBar.prototype._moveFocus =
function(back) {
	var index = this._curFocusIndex;
	var maxIndex = this.getItemCount() - 1;
	var item = null;
	while (!item && index >= 0 && index <= maxIndex) {
		index = back ? index - 1 : index + 1;
		item = this._getFocusItem(index);
	}
	if (item) {
		this._blur();
		this._curFocusIndex = index;
		this._focus(item);
	}
};

/**
 * @private
 */
DwtToolBar.prototype.__markPrevNext =
function(id, opened) {
    var index = this.__getButtonIndex(id);
    var prev = this.getChild(index - 1);
    var next = this.getChild(index + 1);
    if (opened) {
        if (prev) Dwt.delClass(prev.getHtmlElement(), DwtToolBar._NEXT_PREV_RE, DwtToolBar.SELECTED_PREV);
        if (next) Dwt.delClass(next.getHtmlElement(), DwtToolBar._NEXT_PREV_RE, DwtToolBar.SELECTED_NEXT);
    }
    else {
        if (prev) Dwt.delClass(prev.getHtmlElement(), DwtToolBar._NEXT_PREV_RE);
        if (next) Dwt.delClass(next.getHtmlElement(), DwtToolBar._NEXT_PREV_RE);
    }

    // hack: mark the first and last items so we can style them specially
    //	MOW note: this should really not be here, as it only needs to be done once,
    //				but I'm not sure where to put it otherwise
    var first = this.getChild(0);
    if (first) Dwt.addClass(first.getHtmlElement(), DwtToolBar.FIRST_ITEM);

    var last = this.getChild(this.getItemCount()-1);
    if (last) Dwt.addClass(last.getHtmlElement(), DwtToolBar.LAST_ITEM);
};

/**
 * Find the array index of a toolbar button by id.
 *
 * Works only if descendent classes implement the _buttons property as a
 * native Array.
 * @param id {number} Index to check and see if exists in the array.
 * @return {number} Index of the id in the array, or -1 if the id does not
 * exist.
 * @private
 */
DwtToolBar.prototype.__getButtonIndex =
function(id) {
    var toolBarButtons = this.getChildren();
    var button = this._buttons[id];
    if (toolBarButtons && toolBarButtons.length && button)
        return AjxUtil.indexOf(toolBarButtons, button);
    return -1;
};

//
// Classes
//

/**
 * Creates a tool bar button.
 * @constructor
 * @class
 * This class represents a toolbar button.
 * 
 * @param	{hash}		params		a hash of parameters
 * @param {DwtComposite}	parent		the parent widget
 * @param {constant}	style				the menu style
 * @param {string}	className				the CSS class
 * @param {DwtToolBar.HORIZ_STYLE|DwtToolBar.VERT_STYLE}	posStyle		the positioning style
 * @param {Object}	actionTiming 	the action timing
 * @param {string}	id 	the id
 * @param {number}	index 				the index at which to add this control among parent's children
 *
 * @extends	DwtButton
 */
DwtToolBarButton = function(params) {
	if (arguments.length == 0) { return; }
	var params = Dwt.getParams(arguments, DwtToolBarButton.PARAMS);
	params.className = params.className || "ZToolbarButton";
	DwtButton.call(this, params);
};

DwtToolBarButton.PARAMS = ["parent", "style", "className", "posStyle", "actionTiming", "id", "index"];

DwtToolBarButton.prototype = new DwtButton;
DwtToolBarButton.prototype.constructor = DwtToolBarButton;

DwtToolBarButton.prototype.isDwtToolBarButton = true;
DwtToolBarButton.prototype.toString = function() { return "DwtToolBarButton"; };

// Data
DwtToolBarButton.prototype.TEMPLATE = "dwt.Widgets#ZToolbarButton";

DwtToolBarSpacer = function(params) {
	if (arguments.length == 0) { return; }
	this.toolbarItemTemplate = params.toolbarItemTemplate;
	DwtControl.call(this, params);
};

DwtToolBarSpacer.prototype = new DwtControl;

DwtToolBarSpacer.prototype.constructor = DwtToolBarSpacer;
DwtToolBarSpacer.prototype.toString = function() { return 'DwtToolBarSpacer'; };
DwtToolBarSpacer.prototype.role = 'separator';
