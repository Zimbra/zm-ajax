/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Creates a Tree Item.
 * @constructor
 * @class
 * This class implements a tree item widget.
 *
 * @author Ross Dargahi
 * 
 * @param {hash}	params				a hash of parameters
 * @param {DwtComposite}      params.parent	the parent widget
 * @param {number}      params.index 			the index at which to add this control among parent's children
 * @param {string}      params.text 					the label text for the tree item
 * @param {string}      params.imageInfo			the icon for the left end of the tree item
 * @param {string}      params.extraInfo				the icon for the right end of the tree item
 * @param {string}      params.expandNodeImage		the icon to use for expanding tree item (instead of default)
 * @param {string}      params.collapseNodeImage     the icon to use for collapsing tree item (instead of default)
 * @param {string}      params.className				the CSS class
 * @param {constant}      params.posStyle				the positioning style (see {@link DwtControl})
 * @param {boolean}      params.deferred				if <code>true</code>, postpone initialization until needed.
 * @param {boolean}      params.selectable			if <code>true</code>, this item is selectable
 * @param {boolean}      params.forceNotifySelection	force notify selection even if checked style
 * @param {boolean}      params.forceNotifyAction		force notify action even if checked style
 * @param {boolean}      params.singleClickAction		if <code>true</code>, an action is performed in single click
 * @param {AjxCallback}      params.dndScrollCallback	the callback triggered when scrolling of a drop area for an object being dragged
 * @param {string}      params.dndScrollId			the id
 * @param {boolean}    params.arrowDisabled
 * @param {boolean}     params.dynamicWidth		if <code>true</code>, the table should be width auto instead of the default fixed
 *
 * @extends		DwtComposite		
 */
DwtTreeItem = function(params) {

    if (arguments.length == 0) { return; }    

    params = Dwt.getParams(arguments, DwtTreeItem.PARAMS);
	var parent = params.parent;
	if (parent instanceof DwtTree) {
		this._tree = parent;
	} else if (parent instanceof DwtTreeItem) {
		this._tree = parent._tree;
	} else {
		throw new DwtException("DwtTreeItem parent must be a DwtTree or DwtTreeItem", DwtException.INVALIDPARENT, "DwtTreeItem");
	}

	this._origClassName = params.className || "DwtTreeItem";
	this._textClassName = [this._origClassName, "Text"].join("-");
	this._selectedClassName = this._origClassName + ' ' + [this._origClassName, DwtCssStyle.SELECTED].join("-");
	this._selectedFocusedClassName = this._selectedClassName + ' ' + [this._origClassName, DwtCssStyle.SELECTED, DwtCssStyle.FOCUSED].join("-");
	this._actionedClassName = this._origClassName + ' ' + [this._origClassName, DwtCssStyle.ACTIONED].join("-");
	this._dragOverClassName = this._origClassName + ' ' + [this._origClassName, DwtCssStyle.DRAG_OVER].join("-");
    this._treeItemTextClass = "DwtTreeItem-Text";
    this._treeItemExtraImgClass = "DwtTreeItem-ExtraImg";

	this._dynamicWidth = params.dynamicWidth;

	params.deferred = (params.deferred !== false);
	params.className = 'DwtTreeItem-Control';
	DwtComposite.call(this, params);

	this._imageInfoParam = params.imageInfo;
	this._extraInfo = params.extraInfo;
	this._textParam = params.text;
	this._deferred = params.deferred;
	this._expandNodeImage = params.expandNodeImage || "NodeExpanded";
	this._collapseNodeImage = params.collapseNodeImage || "NodeCollapsed-rev";
	this._itemChecked = false;
	this._initialized = false;
	this._selectionEnabled = Boolean(params.selectable !== false);
	this._forceNotifySelection = Boolean(params.forceNotifySelection);
	this._actionEnabled = true;
	this._forceNotifyAction = Boolean(params.forceNotifyAction);
	this._dndScrollCallback = params.dndScrollCallback;
	this._dndScrollId = params.dndScrollId;
	this._arrowDisabled = params.arrowDisabled;

	if (params.singleClickAction) {
		this._singleClickAction = true;
		this._selectedFocusedClassName = this._selectedClassName = this._textClassName;
		this._hoverClassName = [this._origClassName, DwtCssStyle.HOVER].join("-");
	} else {
		this._hoverClassName = this._textClassName;
	}

	// if our parent is DwtTree or our parent is initialized and is not deferred
	// type or is expanded, then initialize ourself, else wait
	if (parent instanceof DwtTree || (parent._initialized && (!parent._deferred || parent._expanded)) || !params.deferred) {
		this._initialize(params.index);
	} else {
		parent._addDeferredChild(this, params.index);
		this._index = params.index;
	}
};

DwtTreeItem.PARAMS = ["parent", "index", "text", "imageInfo", "deferred", "className", "posStyle",
					  "forceNotifySelection", "forceNotifyAction"];

DwtTreeItem.prototype = new DwtComposite;
DwtTreeItem.prototype.constructor = DwtTreeItem;

DwtTreeItem.prototype.isDwtTreeItem = true;
DwtTreeItem.prototype.toString = function() { return "DwtTreeItem"; };

DwtTreeItem.prototype.TEMPLATE = "dwt.Widgets#ZTreeItem";

DwtTreeItem.prototype.role = "treeitem";
DwtTreeItem.prototype.isFocusable = true;

DwtTreeItem.prototype._checkBoxVisible = true; // Assume it's shown, if check style

// Consts

DwtTreeItem._processedMouseDown = false;

// Public Methods

DwtTreeItem.prototype.dispose =
function() {
    DwtComposite.prototype.dispose.call(this);
	this._itemDiv = null;
	this._nodeCell = null;
	this._checkBoxCell = null;
	this._checkedImg = null;
	this._checkBox = null;
	this._imageCell = null;
	this._textCell = null;
	this._childDiv = null;
	this._initialized = false;
};

/**
 * override DwtControl.prototype.getData to take care of special case of KEY_OBJECT of type ZmOrganizer. See bug 82027
 * @param key
 * @return {*}
 */
DwtTreeItem.prototype.getData =
function(key) {
	var obj = this._data[key];
	if (key !== Dwt.KEY_OBJECT || !obj || !obj.isZmOrganizer) {
		return obj;
	}
	//special case for ZmOrganizer instance of the Dwt.KEY_OBJECT attribute.
	//bug 82027 - the folder attributes such as name could be wrong after refresh block+ rename when new instance was created but not set to the item Dwt.KEY_OBJECT attribute.
	var cachedOrganizer = obj && appCtxt.cacheGet(obj.id);
	return cachedOrganizer || obj; //just in case somehow it's no longer cached. No idea if could happen.
};

/**
 * Checks if the item is checked.
 * 
 * @return	{boolean}	<code>true</code> if the item is checked
 */
DwtTreeItem.prototype.getChecked =
function() {
	return this._itemChecked;
};

/**
 * Sets the checked flag.
 * 
 * @param	{boolean}	checked		if <code>true</code>, check the item
 * @param	{boolean}	force		if <code>true</code>, force the setting
 */
DwtTreeItem.prototype.setChecked =
function(checked, force) {
	if ((this._itemChecked != checked) || force) {
		this._itemChecked = checked;
		if (this._checkBox != null &&
			(this._checkBoxCell && Dwt.getVisible(this._checkBoxCell)))
		{
			Dwt.setVisible(this._checkedImg, checked);
		}
	}
};

DwtTreeItem.prototype._handleCheckboxOnclick =
function(ev) {
	this.setChecked(!Dwt.getVisible(this._checkedImg));

	ev = ev || window.event;
	ev.item = this;
	this._tree._itemChecked(this, ev);
};

DwtTreeItem.prototype.getExpanded =
function() {
	return this._expanded;
};

/**
 * Expands or collapses this tree item.
 *
 * @param {boolean}	expanded		if <code>true</code>, expands this node; otherwise collapses it
 * @param {boolean}	recurse		if <code>true</code>, expand children recursively (does not apply to collapsing)
 * @param	{boolean}	skipNotify		if <code>true</code>, do not notify the listeners
 */
DwtTreeItem.prototype.setExpanded =
function(expanded, recurse, skipNotify) {
	// Go up the chain, ensuring that parents are expanded/initialized
	if (expanded) {
		var p = this.parent;
		while (p instanceof DwtTreeItem && !p._expanded) {
			p.setExpanded(true);
			p = p.parent;
		}
		// Realize any deferred children
		this._realizeDeferredChildren();
	}
		
	// If we have children, then allow for expanding/collapsing
	if (this.getNumChildren()) {
		if (expanded && recurse) {
			if (!this._expanded) {
				this._expand(expanded, null, skipNotify);
			}
			var a = this.getChildren();
			for (var i = 0; i < a.length; i++) {
				if (a[i] instanceof DwtTreeItem) {
					a[i].setExpanded(expanded, recurse, skipNotify);
				}
			}
		} else if (this._expanded != expanded) {
			this._expand(expanded, null, skipNotify);
		}
	}
};

/**
 * Gets the child item count.
 * 
 * @return	{number}	the child item count
 */
DwtTreeItem.prototype.getItemCount =
function() {
	return this._children.size();
};

/**
 * Gets the items.
 * 
 * @return	{array}	an array of child {@link DwtTreeItem} objects
 */
DwtTreeItem.prototype.getItems =
function() {
	return this._children.getArray();
};

DwtTreeItem.prototype.getChildIndex =
function(item) {
	return this._children.indexOf(item);
};

/**
 * Get the nesting level; the toplevel tree is zero, and each lower layer
 * increases by one.
 * 
 * @return	{number}	the child item count
 */
DwtTreeItem.prototype.getNestingLevel =
function() {
	return this.parent.getNestingLevel() + 1;
};

/**
 * Gets the image.
 * 
 * @return	{string}	the image
 */
DwtTreeItem.prototype.getImage =
function() {
	return this._imageInfo;
};

/**
 * Sets the image.
 * 
 * @param	{string}	imageInfo		the image
 */
DwtTreeItem.prototype.setImage =
function(imageInfo) {
	if (this._initialized) {
		if (this._imageCell) {
			AjxImg.setImage(this._imageCell, imageInfo);
		}
		this._imageInfo = imageInfo;
	} else {
		this._imageInfoParam = imageInfo;
	}	
};

DwtTreeItem.prototype.setDndImage =
function(imageInfo) {
	this._dndImageInfo = imageInfo;
};

DwtTreeItem.prototype.getSelected =
function() {
	return this._selected;
};

DwtTreeItem.prototype.getActioned =
function() {
	return this._actioned;
};

/**
 * Gets the text.
 * 
 * @return	{string}	the text
 */
DwtTreeItem.prototype.getText =
function() {
	return this._text;
};

/**
 * Sets the text.
 * 
 * @param	{string}	text		the text
 */
DwtTreeItem.prototype.setText =
function(text) {
	if (this._initialized && this._textCell) {
		if (!text) text = "";
		this._text = this._textCell.innerHTML = text;
	} else {
		this._textParam = text;
	}
};

/**
 * Sets the drag-and-drop text.
 * 
 * @param	{string}	text		the text
 */
DwtTreeItem.prototype.setDndText =
function(text) {
	this._dndText = text;
};

/**
 * Shows (or hides) the check box.
 * 
 * @param	{boolean}	show		if <code>true</code>, show the check box
 */
DwtTreeItem.prototype.showCheckBox =
function(show) {
	this._checkBoxVisible = show;
	if (this._checkBoxCell) {
		Dwt.setVisible(this._checkBoxCell, show);
	}
};

/**
 * Shows (or hides) the expansion icon.
 * 
 * @param	{boolean}	show		if <code>true</code>, show the expansion icon
 */
DwtTreeItem.prototype.showExpansionIcon =
function(show) {
	if (this._nodeCell) {
		Dwt.setVisible(this._nodeCell, show);
	}
};

/**
 * Enables (or disables) the selection.
 * 
 * @param	{boolean}	enable		if <code>true</code>, enable selection
 */
DwtTreeItem.prototype.enableSelection =
function(enable) {
	this._selectionEnabled = enable;
	this._selectedClassName = enable
		? this._origClassName + "-" + DwtCssStyle.SELECTED
		: this._origClassName;

};

DwtTreeItem.prototype.isSelectionEnabled =
function() {
	return this._selectionEnabled;
};


DwtTreeItem.prototype.enableAction =
function(enable) {
	this._actionEnabled = enable;
};

/**
 * Adds a separator at the given index. If no index is provided, adds it at the
 * end. A separator cannot currently be added as the first item (the child DIV will
 * not have been created).
 *
 * @param {number}	index		the position at which to add the separator
 */
DwtTreeItem.prototype.addSeparator =
function(index) {
	this._children.add((new DwtTreeItemSeparator(this)), index);
};

/**
 * Makes this tree item, or just part of it, visible or hidden.
 *
 * @param {boolean}	visible		if <code>true</code>, item (or part of it) becomes visible
 * @param {boolean}	itemOnly		if <code>true</code>, apply to this item's DIV only; child items are unaffected
 * @param {boolean}	childOnly		if <code>true</code>, apply to this item's child items only
 */
DwtTreeItem.prototype.setVisible =
function(visible, itemOnly, childOnly) {
	if (itemOnly && !childOnly) {
		Dwt.setVisible(this._itemDiv, visible);
	} else if (childOnly && !itemOnly) {
		Dwt.setVisible(this._childDiv, visible);
	} else {
		DwtComposite.prototype.setVisible.call(this, visible);
	}
};

DwtTreeItem.prototype.removeChild =
function(child) {
	if (child._initialized) {
		this._tree._deselect(child);
		if (this._childDiv) {
			this._childDiv.removeChild(child.getHtmlElement());
		}
	}
	this._children.remove(child);

	// if we have no children and we are expanded, then mark us a collapsed.
	// Also if there are no deferred children, then make sure we remove the
	// expand/collapse icon and replace it with a blank16Icon.
	if (this._children.size() == 0) {
		if (this._expanded)
			this._expanded = false;

		this._expandable = false;
		this.removeAttribute('aria-expanded')
		
		if (this._initialized && this._nodeCell) {
            this._nodeCell.style.display = "none";
			AjxImg.setImage(this._nodeCell, "Blank_16");
			var imgEl = AjxImg.getImageElement(this._nodeCell);
			if (imgEl)
				Dwt.clearHandler(imgEl, DwtEvent.ONMOUSEDOWN);
		}
	}
};

DwtTreeItem.prototype.getKeyMapName =
function() {
	return DwtKeyMap.MAP_TREE;
};

DwtTreeItem.prototype.handleKeyAction =
function(actionCode, ev) {

	switch (actionCode) {
		
		case DwtKeyMap.ENTER:
			this._tree.setEnterSelection(this, true);
			break;


		case DwtKeyMap.NEXT: {
			var ti = this._tree._getNextTreeItem(true);
			if (ti) {
				ti._tree.setSelection(ti, false, true);
			}
			break;
		}

		case DwtKeyMap.PREV: {
			var ti = this._tree._getNextTreeItem(false);
			if (ti) {
				ti._tree.setSelection(ti, false, true);
			}
			break;
		}

		case DwtKeyMap.SELECT_FIRST:
		case DwtKeyMap.SELECT_LAST: {
			var ti = (actionCode === DwtKeyMap.SELECT_FIRST) ?
				this._tree._getFirstTreeItem() : this._tree._getLastTreeItem();
			if (ti) {
				ti._tree.setSelection(ti, false, true);
			}
			break;
		}

		case DwtKeyMap.EXPAND: {
			if (!this._expanded) {
				this.setExpanded(true, false, true);
			} else if (this._children.size() > 0) {
				// Select first child node
				var firstChild = this._children.get(0);
				this._tree.setSelection(firstChild, false, true);
			}
			break;
		}

		case DwtKeyMap.COLLAPSE: {
			if (this._expanded) {
				this.setExpanded(false, false, true);
			} else if (this.parent.isDwtTreeItem) {
				// select parent
				this._tree.setSelection(this.parent, false, true);
			}
			break;
		}

		case DwtKeyMap.SUBMENU: {
			var target = this.getHtmlElement();
			var p = Dwt.toWindow(target, 0, 0);
			var s = this.getSize();
			var docX = p.x + s.x / 4;
			var docY = p.y + s.y / 2;
			this._gotMouseDownRight = true;
			this._emulateSingleClick({dwtObj:this, target:target, button:DwtMouseEvent.RIGHT,
									  docX:docX, docY:docY, kbNavEvent:true});
			break;
		}

		default:
			return false;

	}

	return true;
};

DwtTreeItem.prototype.addNodeIconListeners =
function() {
	var imgEl = AjxImg.getImageElement(this._nodeCell);
	if (imgEl) {
		Dwt.setHandler(imgEl, DwtEvent.ONMOUSEDOWN, DwtTreeItem._nodeIconMouseDownHdlr);
		Dwt.setHandler(imgEl, DwtEvent.ONMOUSEUP, DwtTreeItem._nodeIconMouseUpHdlr);
	}
};

DwtTreeItem.prototype._initialize =
function(index, realizeDeferred, forceNode) {
	this._checkState();
	if (AjxEnv.isIE) {
		this._setEventHdlrs([DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE]);
	}
	if (AjxEnv.isSafari) {	// bug fix #25016
		this._setEventHdlrs([DwtEvent.ONCONTEXTMENU]);
	}
	var data = {
		id: this._htmlElId,
		divClassName: this._origClassName,
		isCheckedStyle: this._tree.isCheckedStyle,
		textClassName: this._textClassName
	};

	this._createHtmlFromTemplate(this.TEMPLATE, data);

	// add this object's HTML element to the DOM
	this.parent._addItem(this, index, realizeDeferred);

	// cache DOM objects here
	this._itemDiv = document.getElementById(data.id + "_div");
	this._nodeCell = document.getElementById(data.id + "_nodeCell");
	this._checkBoxCell = document.getElementById(data.id + "_checkboxCell");
	this._checkBox = document.getElementById(data.id + "_checkbox");
	this._checkedImg = document.getElementById(data.id + "_checkboxImg");
	this._imageCell = document.getElementById(data.id + "_imageCell");
	this._textCell = document.getElementById(data.id + "_textCell");
	this._extraCell = document.getElementById(data.id + "_extraCell");

	/* assign the ARIA level */
	this.setAttribute("aria-level", this.getNestingLevel());

	/* add a label for screenreaders, so that they don't read the entire
	   element */
	if (this._textCell) {
		this.setAttribute("aria-labelledby", this._textCell.id);
	}

	if (this._dynamicWidth){
		var tableNode = document.getElementById(data.id + "_table");
		if (tableNode) {
			tableNode.style.tableLayout = "auto";
		}
	}

	this._expandable = false;
	this.removeAttribute('aria-expanded');

	// If we have deferred children, then make sure we set up accordingly
	if (this._nodeCell) {
		if (this._children.size() > 0 || forceNode) {
			this._expandable = true;
            this._nodeCell.style.display = 'table-cell';
			AjxImg.setImage(this._nodeCell, this._collapseNodeImage);
			this.addNodeIconListeners();
		}
	}

	if (this._extraCell) {
		AjxImg.setImage(this._extraCell, (this._extraInfo ||  "Blank_16"));
		this._extraCell.className = this._treeItemExtraImgClass;
	}

	// initialize checkbox
	if (this._tree.isCheckedStyle && this._checkBox) {
		this._checkBox.onclick = AjxCallback.simpleClosure(this._handleCheckboxOnclick, this);
		this.showCheckBox(this._checkBoxVisible);
		this.setChecked(this._tree.isCheckedByDefault, true);
	}

	// initialize icon
	if (this._imageCell && this._imageInfoParam) {
		AjxImg.setImage(this._imageCell, this._imageInfoParam);
		this._imageInfo = this._imageInfoParam;
	}

	// initialize text
	if (this._textCell && this._textParam) {
		this._textCell.innerHTML = this._text = this._textParam;
	}
	this._expanded = this._selected = this._actioned = false;
	this._gotMouseDownLeft = this._gotMouseDownRight = false;
	this._addMouseListeners();

	this._initialized = true;
};

/**
 * Sets the tree item color.
 * 
 * @param	{string}	className		the class name
 */
DwtTreeItem.prototype.setTreeItemColor = 
function(className) {
	var id = this._htmlElId +"_table";
	var treeItemTableEl = document.getElementById(id);
	var treeItemDivEl = document.getElementById(this._htmlElId + "_div");
	var treeItemEl = this.getHtmlElement();

	var newClassName = this._origClassName + " " + className;
	if (treeItemDivEl) {
		treeItemDivEl.className = newClassName;
	} else if (treeItemEl) {
		treeItemEl.className =  className;
	}
};

DwtTreeItem.prototype._addMouseListeners =
function() {
	var events = [DwtEvent.ONMOUSEDOWN, DwtEvent.ONMOUSEUP, DwtEvent.ONDBLCLICK];
	if (AjxEnv.isIE) {
		events.push(DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE);
	} else {
		events.push(DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT);
	}
	if (AjxEnv.isSafari) {
		events.push(DwtEvent.ONCONTEXTMENU);
	}
	for (var i = 0; i < events.length; i++) {
		this.addListener(events[i], DwtTreeItem._listeners[events[i]]);
	}
};

DwtTreeItem.prototype._addDeferredChild =
function(child, index) {
	// If we are initialized, then we need to add a expansion node
	if (this._initialized && this._children.size() == 0) {
		if (this._nodeCell) {
            this._nodeCell.style.display = 'table-cell';
			AjxImg.setImage(this._nodeCell, this._collapseNodeImage);
			var imgEl = AjxImg.getImageElement(this._nodeCell);
			if (imgEl) {
				this._expandable = true;
				this.setAttribute('aria-expanded', this._expanded);
				Dwt.setHandler(imgEl, DwtEvent.ONMOUSEDOWN, DwtTreeItem._nodeIconMouseDownHdlr);
				Dwt.setHandler(imgEl, DwtEvent.ONMOUSEUP, DwtTreeItem._nodeIconMouseUpHdlr);
			}
		}
	}
	this._children.add(child, index);
};

DwtTreeItem.prototype.addChild =
function(child) { /* do nothing since we add to the DOM our own way */ };

DwtTreeItem.prototype._addItem =
function(item, index, realizeDeferred) {
	if (!this._children.contains(item)) {
		this._children.add(item, index);
	}
	this._expandable = true;

	if (this._childDiv == null) {
		this._childDiv = document.createElement("div");
		this._childDiv.className = (this.parent != this._tree)
			? "DwtTreeItemChildDiv" : "DwtTreeItemLevel1ChildDiv";
		this._childDiv.setAttribute('role', 'group');
		this._childDiv.setAttribute('aria-labelledby', this._itemDiv.id);
		this._childDiv.setAttribute('aria-expanded', this._expanded);
		this.getHtmlElement().appendChild(this._childDiv);
		if (!this._expanded) {
			this._childDiv.style.display = "none";
		}
	}

	if (realizeDeferred && this._nodeCell) {
		if (AjxImg.getImageClass(this._nodeCell) == AjxImg.getClassForImage("Blank_16")) {
            this._nodeCell.style.display = 'table-cell';
			AjxImg.setImage(this._nodeCell, this._expanded ? this._expandNodeImage : this._collapseNodeImage);
			var imgEl = AjxImg.getImageElement(this._nodeCell);
			if (imgEl) {
				Dwt.setHandler(imgEl, DwtEvent.ONMOUSEDOWN, DwtTreeItem._nodeIconMouseDownHdlr);
			}
		}
	}

	var childDiv = this._childDiv;
	var numChildren = childDiv.childNodes.length;
	if (index == null || index >= numChildren || numChildren == 0) {
		childDiv.appendChild(item.getHtmlElement());
	} else {
		childDiv.insertBefore(item.getHtmlElement(), childDiv.childNodes[index]);
	}
};

DwtTreeItem.prototype.sort =
function(cmp) {
	this._children.sort(cmp);
	if (this._childDiv) {
		this._setChildElOrder();
	} else {
		this._needsSort = true;
	}
};

DwtTreeItem.prototype._setChildElOrder =
function(cmp) {
	var df = document.createDocumentFragment();
	this._children.foreach(function(item, i) {
		df.appendChild(item.getHtmlElement());
		item._index = i;
	});
	this._childDiv.appendChild(df);
};

DwtTreeItem.prototype._getDragProxy =
function() {
	var icon = document.createElement("div");
	Dwt.setPosition(icon, Dwt.ABSOLUTE_STYLE); 
	var table = document.createElement("table");
	icon.appendChild(table);
	table.cellSpacing = table.cellPadding = 0;

	var row = table.insertRow(0);
	var i = 0;

	var c = row.insertCell(i++);
	c.noWrap = true;
	if (this._dndImageInfo) {
		AjxImg.setImage(c, this._dndImageInfo);
	} else if (this._imageInfo) {
		AjxImg.setImage(c, this._imageInfo);
	}

	c = row.insertCell(i);
	c.noWrap = true;
	c.className = this._origClassName;
	if (this._dndText) {
		c.innerHTML = this._dndText;
	} else if (this._text) {
		c.innerHTML = this._text;
	}

	this.shell.getHtmlElement().appendChild(icon);
	Dwt.setZIndex(icon, Dwt.Z_DND);
	return icon;
};

DwtTreeItem.prototype._dragEnter =
function() {
	this._preDragClassName = this._itemDiv.className;
	this._itemDiv.className = this._dragOverClassName;
	this._draghovering = true;
};

DwtTreeItem.prototype._dragHover =
function() {
	if (this.getNumChildren() > 0 && !this.getExpanded()) {
		this.setExpanded(true);
	}
};

DwtTreeItem.prototype._dragLeave =
function(ev) {
	if (this._preDragClassName) {
		this._itemDiv.className = this._preDragClassName;
	}
	this._draghovering = false;
};

DwtTreeItem.prototype._drop =
function() {
	if (this._preDragClassName) {
		this._itemDiv.className = this._preDragClassName;
	}
	this._draghovering = false;
};

/**
 *   This is for bug 45129.
 *   In the DwControl's focusByMouseDownEvent, it focuses the TreeItem 
 *   And change TreeItem's color. But sometimes when mousedown and mouseup
 *   haven't been matched on the one element. It will cause multiple selection. 
 *   For in the mouseup handle function, we has done focus if we find both mouse 
 *   down and up happened on the same element. So when the mouse is down, we just
 *   do nothing.
 */
DwtTreeItem.prototype._focusByMouseDownEvent =
function(ev) {
	
}

DwtTreeItem._nodeIconMouseDownHdlr =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, obj);
	if (mouseEv.button == DwtMouseEvent.LEFT) {
		obj._expand(!obj._expanded, mouseEv);
	} else if (mouseEv.button == DwtMouseEvent.RIGHT) {
		mouseEv.dwtObj._tree._itemActioned(mouseEv.dwtObj, mouseEv);
	}

	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

DwtTreeItem._nodeIconMouseUpHdlr = 
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	var mouseEv = DwtShell.mouseEvent;
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

DwtTreeItem.prototype._expand =
function(expand, ev, skipNotify) {
	if (expand !== this._expanded) {
		if (!expand) {
			this._expanded = false;
			this._childDiv.style.display = "none";
			if (this._nodeCell) {
				AjxImg.setImage(this._nodeCell, this._collapseNodeImage);
			}
			this._tree._itemCollapsed(this, ev, skipNotify);
		} else {
			// The first thing we need to do is initialize any deferred children so that they
			// actually have content
			this._realizeDeferredChildren();
			this._expanded = true;
			if(this._childDiv && this._childDiv.style)
				this._childDiv.style.display = "block";
			if (this._nodeCell) {
				AjxImg.setImage(this._nodeCell, this._expandNodeImage);
			}
			this._tree._itemExpanded(this, ev, skipNotify);
		}	

		this.setAttribute('aria-expanded', expand);
		this._childDiv.setAttribute('aria-expanded', expand);
		this._childDiv.setAttribute('aria-hidden', !expand);
	}
};

DwtTreeItem.prototype._realizeDeferredChildren =
function() {
	var a = this._children.getArray();
	for (var i = 0; i < a.length; i++) {
		var treeItem = a[i];
		if (!treeItem._initialized) {
			treeItem._initialize(treeItem._index, true);
		} else if (treeItem._isSeparator && !treeItem.div && this._childDiv) {
			// Note: separators marked as initialized on construction
			var div = treeItem.div = document.createElement("div");
			div.className = "horizSep";
			this._childDiv.appendChild(div);
			treeItem._initialized = true;
		}
	}
	if (this._needsSort) {
		if (a.length) {
			this._setChildElOrder();
		}
		delete this.__needsSort;
	}
};

DwtTreeItem.prototype._isChildOf =
function(item) {
	var test = this.parent;
	while (test && test != this._tree) {
		if (test == item)
			return true;
		test = test.parent;
	}
	return false;
};

DwtTreeItem.prototype._setTreeElementStyles =
function(img, focused) {
   if (this._arrowDisabled || this._draghovering) {
        return;
   }
   var selected = focused ? "-focused" : "";
   if (this._extraCell) {
        AjxImg.setImage(this._extraCell, img);
        this._extraCell.className = this._treeItemExtraImgClass + selected;
   }
   if (this._textCell)
        this._textCell.className = this._treeItemTextClass + selected;
}

DwtTreeItem.prototype._setSelected =
function(selected, noFocus) {
	if (this._selected != selected && !this._disposed) {
		this._selected = selected;
		if (!this._initialized) {
			this._initialize();
		}
		if (!this._itemDiv) { return; }

		var didSelect;

		if (selected && (this._selectionEnabled || this._forceNotifySelection) /*&& this._origClassName == "DwtTreeItem"*/) {
			this._itemDiv.className = this._selectedClassName;
			//this._setTreeElementStyles("DownArrowSmall", true);
			this._tree.setAttribute('aria-activedescendant', this.getHTMLElId());
            if (!noFocus) {
				this.focus();
			}
			didSelect = true;
		} else {
			this.blur();
			this._setTreeElementStyles("Blank_16", false);
			this._itemDiv.className = this._origClassName;;
			this._tree.removeAttribute('aria-activedescendant');
			didSelect = false;
		}

		this.getHtmlElement().setAttribute('aria-selected', selected);
		/* TODO: disable on IE? screenreaders in IE may announce items twice if
		 * we do the below, which is not strictly necessary */
		var treeEl = this._tree.getHtmlElement();

		if (selected) {
			treeEl.setAttribute('aria-activedescendant', this.getHTMLElId());
		} else {
			treeEl.removeAttribute('aria-activedescendant');
		}

		return didSelect;
	}
};

DwtTreeItem.prototype._setActioned =
function(actioned) {
	if (this._actioned != actioned) {
		this._actioned = actioned;
		if (!this._initialized) {
			this._initialize();
		}

		if (!this._itemDiv) { return; }

		if (actioned && (this._actionEnabled || this._forceNotifyAction) && !this._selected) {
			this._itemDiv.className = this._actionedClassName;
			return true;
		}

		if (!actioned) {
			if (!this._selected) {
				this._itemDiv.className = this._origClassName;
			}
			return false;
		}
	}
};

DwtTreeItem.prototype._focus =
function() {
	if (!this._itemDiv) { return; }
	// focused tree item should always be selected as well
	this._itemDiv.className = this._selectedFocusedClassName;
};

DwtTreeItem.prototype._blur =
function() {
	if (!this._itemDiv) { return; }
	this._itemDiv.className = this._selected
		? this._selectedClassName : this._origClassName;
};

DwtTreeItem._mouseDownListener =
function(ev) {
	var treeItem = ev.dwtObj;
	if (!treeItem) { return false; }
	if (ev.target == treeItem._childDiv) { return; }

	if (ev.button == DwtMouseEvent.LEFT && (treeItem._selectionEnabled || treeItem._forceNotifySelection)) {
		treeItem._gotMouseDownLeft = true;
	} else if (ev.button == DwtMouseEvent.RIGHT && (treeItem._actionEnabled || treeItem._forceNotifyAction)) {
		treeItem._gotMouseDownRight = true;
	}

};

DwtTreeItem._mouseOutListener = 
function(ev) {
	var treeItem = ev.dwtObj;
	if (!treeItem) { return false; }
	if (ev.target == treeItem._childDiv) { return; }

	treeItem._gotMouseDownLeft = false;
	treeItem._gotMouseDownRight = false;
	if (treeItem._singleClickAction && treeItem._textCell) {
		treeItem._textCell.className = treeItem._textClassName;
	}
    treeItem._setTreeElementStyles("Blank_16", false);
};

DwtTreeItem._mouseOverListener =
function(ev) {
	var treeItem = ev.dwtObj;
	if (!treeItem) { return false; }
	if (ev.target == treeItem._childDiv) { return; }

	if (treeItem._singleClickAction && treeItem._textCell) {
		treeItem._textCell.className = treeItem._hoverClassName;
	}
    treeItem._setTreeElementStyles("ColumnDownArrow", true);
};

DwtTreeItem._mouseUpListener = function(ev) {

	var treeItem = ev.dwtObj;
	if (!treeItem) {
        return false;
    }

	// Ignore any mouse events in the child div i.e. the div which 
	// holds all the items children. In the case of IE, no clicks are
	// reported when clicking in the padding area (note all children
	// are indented using padding-left style); however, mozilla
	// reports mouse events that happen in the padding area
	if (ev.target === treeItem._childDiv) {
        return;
    }

	//ignore the collapse/expand arrow. This is handled in DwtTreeItem._nodeIconMouseDownHdlr. It should only collapse/expand and never select this item, so no point in going on.
	if (treeItem._expandable && ev.target === AjxImg.getImageElement(treeItem._nodeCell)) {
		return;
	}

    var targetElement = DwtUiEvent.getTargetWithProp(ev, "id"),
        isContextCmd = (treeItem._extraCell && targetElement && treeItem._extraCell.id === targetElement.id);

    if ((ev.button === DwtMouseEvent.RIGHT && treeItem._gotMouseDownRight) || isContextCmd) {
        treeItem._tree._itemActioned(treeItem, ev);
    }
    else if (ev.button === DwtMouseEvent.LEFT && treeItem._gotMouseDownLeft) {
		treeItem._tree._itemClicked(treeItem, ev);
	}
};

DwtTreeItem._doubleClickListener =
function(ev) {
	var treeItem = ev.dwtObj;
	if (!treeItem) { return false; }
	// See comment in DwtTreeItem.prototype._mouseDownListener
	if (ev.target == treeItem._childDiv) { return; }

	var obj = DwtControl.getTargetControl(ev);
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, obj);
	if (mouseEv.button == DwtMouseEvent.LEFT || mouseEv.button == DwtMouseEvent.NONE) {	// NONE for IE bug
		mouseEv.dwtObj._tree._itemDblClicked(mouseEv.dwtObj, mouseEv);
	}
};

DwtTreeItem._contextListener =
function(ev) {
	// for Safari, we have to fake a right click
	if (AjxEnv.isSafari) {
		var obj = DwtControl.getTargetControl(ev);
		var prevent = obj ? obj.preventContextMenu() : true;
		if (prevent) {
			obj.notifyListeners(DwtEvent.ONMOUSEDOWN, ev);
			return obj.notifyListeners(DwtEvent.ONMOUSEUP, ev);
		}
	}
};

DwtTreeItem.prototype._emulateSingleClick =
function(params) {
	var mev = new DwtMouseEvent();
	this._setMouseEvent(mev, params);
	mev.kbNavEvent = params.kbNavEvent;
	this.notifyListeners(DwtEvent.ONMOUSEUP, mev);
};

DwtTreeItem.prototype.getTooltipBase =
function(hoverEv) {
	return this._itemDiv;
};

DwtTreeItem._listeners = {};
DwtTreeItem._listeners[DwtEvent.ONMOUSEDOWN] = new AjxListener(null, DwtTreeItem._mouseDownListener);
DwtTreeItem._listeners[DwtEvent.ONMOUSEOUT] = new AjxListener(null, DwtTreeItem._mouseOutListener);
DwtTreeItem._listeners[DwtEvent.ONMOUSELEAVE] = new AjxListener(null, DwtTreeItem._mouseOutListener);
DwtTreeItem._listeners[DwtEvent.ONMOUSEENTER] = new AjxListener(null, DwtTreeItem._mouseOverListener);
DwtTreeItem._listeners[DwtEvent.ONMOUSEOVER] = new AjxListener(null, DwtTreeItem._mouseOverListener);
DwtTreeItem._listeners[DwtEvent.ONMOUSEUP] = new AjxListener(null, DwtTreeItem._mouseUpListener);
DwtTreeItem._listeners[DwtEvent.ONDBLCLICK] = new AjxListener(null, DwtTreeItem._doubleClickListener);
DwtTreeItem._listeners[DwtEvent.ONCONTEXTMENU] = new AjxListener(null, DwtTreeItem._contextListener);


/**
 * Minimal class for a separator (some vertical space) between other tree items.
 * The functions it has are to handle a dispose() call when the containing tree
 * is disposed.
 * 
 * TODO: At some point we should just make this a DwtControl, or find some other
 * 		 way of keeping it minimal.
 * 
 * 
 * @private
 */
DwtTreeItemSeparator = function(parent) {
	this.parent = parent;
	this._isSeparator = true;
	this._initialized = true;
};

DwtTreeItemSeparator.prototype.dispose =
function() {
	DwtComposite.prototype.removeChild.call(this.parent, this);
};

DwtTreeItemSeparator.prototype.isInitialized =
function() {
	return this._initialized;
};

DwtTreeItemSeparator.prototype.getHtmlElement =
function() {
	return this.div;
};
