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
 * @overview
 * This file contains a Dwt composite control.
 * 
 */

/**
 * @class
 * A composite may contain other controls. All controls that need to contain child controls
 * (such as menus, trees) should inherit from this class.
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}	params.parent	the parent widget
 * @param {string}	params.className		the CSS class
 * @param {constant}	params.posStyle		the positioning style
 * @param {boolean}	params.deferred		if <code>true</code>, postpone initialization until needed
 * @param {string}	params.id			an explicit ID to use for the control's HTML element
 * @param {number}	params.index 		the index at which to add this control among parent's children
 * 
 * @extends	DwtControl
 */
DwtComposite = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtComposite.PARAMS);
	
	params.className = params.className || "DwtComposite";
	DwtControl.call(this, params);

	var desc = this.toString();
	if (desc == 'DwtComposite') {
		desc = this.getHTMLElId();
	}

	this._compositeTabGroup = new DwtTabGroup(desc + ' (DwtComposite)');

	/**
	 * Vector of child elements
	 * @type AjxVector
	 */
	this._children = new AjxVector();
}

DwtComposite.PARAMS = DwtControl.PARAMS.concat();

DwtComposite.prototype = new DwtControl;
DwtComposite.prototype.constructor = DwtComposite;

DwtComposite.prototype.isDwtComposite = true;
DwtComposite.prototype.toString = function() { return "DwtComposite"; }



/**
 * Pending elements hash (i.e. elements that have not yet been realized).
 * @private
 */
DwtComposite._pendingElements = new Object();


/**
 * Disposes of the control. This method will remove the control from under the
 * control of it's parent and release any resources associate with the component.
 * The method will also notify any event listeners on registered {@link DwtEvent.DISPOSE} event type.
 * 
 * <p>
 * In the case of {@link DwtComposite} this method will also dispose of all of the composite's
 * children.
 * 
 * <p> 
 * Subclasses may override this method to perform their own dispose functionality but
 * should generally call the parent <code>dispose()</code> method.
 * 
 * @see DwtControl#isDisposed
 * @see DwtControl#addDisposeListener
 * @see DwtControl#removeDisposeListener
 */
DwtComposite.prototype.dispose =
function() {
	if (this._disposed) return;

	var children = this._children.getArray();
	while (children.length > 0) {
        children.pop().dispose();
	}

	if (this._compositeTabGroup) {
		this._compositeTabGroup.removeAllMembers();
	}
	this._compositeTabGroup = null;

	DwtControl.prototype.dispose.call(this);
}

/**
 * Get a list of children of this composite.
 * 
 * @return	{array}		an array of {@link DwtControl} objects
 */
DwtComposite.prototype.getChildren =
function() {
	return this._children.getArray().slice(0);
}

/**
 * Get the Nth child of this composite.
 * 
 * @param {number}	index 		the index of the child.
 *
 * @return	{DwtControl}		the child.
 */
DwtComposite.prototype.getChild =
function(idx) {
	return this._children.get(idx);
};

/**
 * collapses consecutive separators into one. Gets rid of head or tail separators as well .
 * Note that is does not remove the separators, just hides them so they can re-displayed as needed, next time this is called and other elements
 * become visible
 *
 * this would be used on such subclasses as DwtMenu and DwtToolbar .
 * However, currently it does not work with the toolbars, since separators there are not added as children to the toolbar composite.
 * I tried to make it consistent with the DwtMenu approach, but it seemed a bit complicated right now.
 * so for now I try to make it so no complete groups (items between separators) are hidden at one time. It might also be possible
 * to do it for the toolbar using the _items HTML elements array, but probably less elegant than this approach.
 */
DwtComposite.prototype.cleanupSeparators =
function() {
	var items = this.getChildren();
	var previousVisibleIsSeparator = true; // I lie so that upfront separator would be cleaned up
	var lastSeparator;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var isSeparator = item.isStyle && item.isStyle(DwtMenuItem.SEPARATOR_STYLE);

		if (isSeparator) {
			item.setVisible(!previousVisibleIsSeparator);
			if (!previousVisibleIsSeparator || !lastSeparator) { //the !lastSeparator is the edge case of first item is separator. (see comment about lie above)
				//keep track of last visible separator (if it's also last item visible overall)
				previousVisibleIsSeparator = true;
				lastSeparator = item;
			}
			continue;
		}

		//not a separator
		if (item.getVisible()) {
			previousVisibleIsSeparator = false;
		}
	}
	//cleanup tail separator
	if (previousVisibleIsSeparator && lastSeparator) {
		lastSeparator.setVisible(false);
	}
};




/**
 * Gets the number of children of this composite.
 * 
 * @return {number} 		the number of composite children
 */
DwtComposite.prototype.getNumChildren =
function() {
	return this._children.size();
}

/**
 * Removes all of the composite children.
 * 
 */
DwtComposite.prototype.removeChildren =
function() {
	var a = this._children.getArray();
	while (a.length > 0) {
		a[0].dispose();
	}
	if (this._compositeTabGroup) {
		this._compositeTabGroup.removeAllMembers();
	}
}

/**
 * Clears the composite HTML element of content and removes
 * all composite children by calling <code>removeChildren</code>.
 * 
 * @see #removeChildren
 */
DwtComposite.prototype.clear =
function() {
	this.removeChildren();
	this.getHtmlElement().innerHTML = "";
}

/**
* Adds the given child control to this composite at the index (if specified).
*
* @param {DwtControl} child		the child control to add
* @param {number}	index		the index at which to add the child (may be <code>null</code>)
*/
DwtComposite.prototype.addChild =
function(child, index) {
	this._children.add(child, index);
	this._compositeTabGroup.addMember(child, index);
	
	// check for a previously removed element
	var childHtmlEl = child.getHtmlElement();
	childHtmlEl.setAttribute("parentId", this._htmlElId);
	if (this instanceof DwtShell && this.isVirtual()) {
		// If we are operating in "virtual shell" mode, then children of the shell's html elements
		// are actually parented to the body
		document.body.appendChild(childHtmlEl);
	} else {
		child.reparentHtmlElement(child.__parentElement || this.getHtmlElement(), index);
		child.__parentElement = null; // don't keep the reference to element, if any
	}
};

/**
* Removes the specified child control from this control. A removed child is no longer retrievable via
* <code>getHtmlElement()</code>, so there is an option to save a reference to the removed child. 
* That way it can be added later using <code>addChild()</code>.
*
* @param {DwtConrol} child		the child control to remove
* @see #addChild
*/
DwtComposite.prototype.removeChild =
function(child) {
	DBG.println(AjxDebug.DBG3, "DwtComposite.prototype.removeChild: " + child._htmlElId + " - " + child.toString());
	// Make sure that the child is initialized. Certain children (such as DwtTreeItems)
	// can be created in a deferred manner (i.e. they will only be initialized if they
	// are becoming visible.
	if (child.isInitialized()) {
		this._children.remove(child);
		this._compositeTabGroup.removeMember(child);
		// Sometimes children are nested in arbitrary HTML so we elect to remove them
		// in this fashion rather than use this.getHtmlElement().removeChild(child.getHtmlElement()
		var childHtmlEl = child.getHtmlElement();
        if (childHtmlEl) {
			childHtmlEl.removeAttribute("parentId");
			if (childHtmlEl.parentNode) {
				var el = childHtmlEl.parentNode.removeChild(childHtmlEl);
			}
		}
	}
}

/**
 * Return this.tabGroupMember if present (it always overrides any other contender), otherwise if this composite has
 * children return the composite tab group, otherwise just return this control (instead of a group with one member).
 *
 * @returns {DwtComposite|DwtTabGroup}
 */
DwtComposite.prototype.getTabGroupMember = function() {

	return this.tabGroupMember || (this.getNumChildren() > 0 ? this._compositeTabGroup : this);
};

/**
 * Allows the user to use the mouse to select text on the control.
 * 
 * @private
 */
DwtComposite.prototype._setAllowSelection =
function() {
	if (!this._allowSelection) {
		this._allowSelection = true;
		this.addListener(DwtEvent.ONMOUSEDOWN, new AjxListener(this, this._mouseDownListener));
		this.addListener(DwtEvent.ONCONTEXTMENU, new AjxListener(this, this._contextMenuListener));
	}
};

/**
 * Sets whether to prevent the browser from allowing text selection.
 * 
 * @see DwtControl#preventSelection
 * @private
 */
DwtComposite.prototype.preventSelection = 
function(targetEl) {
	return this._allowSelection ? false : DwtControl.prototype.preventSelection.call(this, targetEl);
};

/**
 * Determines whether to prevent the browser from displaying its context menu.
 * 
 * @see DwtControl#preventContextMenu
 * @private
 */
DwtComposite.prototype.preventContextMenu =
function(target) {
	if (!this._allowSelection) {
		return DwtControl.prototype.preventContextMenu.apply(this, arguments);
	}
	
	var bObjFound = target ? (target.id.indexOf("OBJ_") == 0) : false;
	var bSelection = false;

	// determine if anything has been selected (IE and mozilla do it differently)
	if (document.selection) {			// IE
		bSelection = document.selection.type == "Text";
	} else if (window.getSelection()) {		// mozilla
		bSelection = window.getSelection().toString().length > 0;
	}

	// if something has been selected and target is not a custom object,
	return (bSelection && !bObjFound) ? false : true;
};

/**
 * Handles focus control when the mouse button is released
 * 
 * @see DwtControl#_focusByMouseUpEvent
 * @private
 */
DwtComposite.prototype._focusByMouseUpEvent =
function()  {
	if (!this._allowSelection) {
		DwtControl.prototype._focusByMouseUpEvent.apply(this, arguments);
	}
	// ...Else do nothing....
	// When text is being selected, we don't want the superclass
	// to give focus to the keyboard input control.
};

/**
 * Event listener that is only registered when this control allows selection
 * 
 * @see _allowSelection
 * @private
 */
DwtComposite.prototype._mouseDownListener =
function(ev) {
	if (ev.button == DwtMouseEvent.LEFT) {
		// reset mouse event to propagate event to browser (allows text selection)
		//todo - look into changing this, it's currently very confusing and inconsistent.
		//bug 23462 change it to stop propagation, so supposedly it should NOT allow selection.
		// (so the above comment is wrong). But it's more complicated than this, since ev._dontCallPreventDefault is more
		// important, and is not set here, so a listener could set it to TRUE thus making it allow selection, despite
		// _stopPropagation being set to true here. (not sure what the meaning is).
		// Note for example the inconsistency with the DwtComposite.prototype._contextMenuListener method below
		// As one cool way to allow selection look at ZmConvView2Header constructor, the line:
		// this.setEventPropagation(true, [DwtEvent.ONMOUSEDOWN, DwtEvent.ONSELECTSTART, DwtEvent.ONMOUSEUP, DwtEvent.ONMOUSEMOVE]);
		// which causes _dontCallPreventDefault to be set to true, not being overriden here, thus selection works.
		ev._stopPropagation = true;
		ev._returnValue = true;
	}
};

/**
 * Event listener that is only registered when this control allows selection
 * 
 * @see _allowSelection
 * @private
 */
DwtComposite.prototype._contextMenuListener =
function(ev) {
	// reset mouse event to propagate event to browser (allows context menu)
	ev._stopPropagation = false;
	ev._returnValue = true;
};
