/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2008, 2009 Zimbra, Inc.
 * 
 * The contents of this file are subject to the Yahoo! Public License
 * Version 1.0 ("License"); you may not use this file except in
 * compliance with the License.  You may obtain a copy of the License at
 * http://www.zimbra.com/license.
 * 
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * ***** END LICENSE BLOCK *****
 */
/**
 * @constructor
 * @class
 * Creates a control. <i>DwtControl</i> is the root class of the Dwt component hierarchy. All
 * Dwt components either directly or indirectly inherit from this class.
 *
 * A <i>DwtControl</i>l may also be directly instantiated. In this case it is essentially
 * a div into which any content may be "drawn"
 *
 * A control may be created in "deferred" mode, meaning that the UI portion of the control
 * will be created "Just In Time". This is useful for widgets which may want to defer construction
 * of elements (e.g. <i>DwtTreeItem</i>) until such time as is needed, in the interest of efficiency.
 * Note that if the control is a child of the shell, it won't become visible until its z-index is set.
 *
 * <h4>CSS</h4>
 * None
 *
 * <h4>Keyboard Actions</h4>
 * None
 *
 * <h4>Events</h4><ul>
 * <li><i>DwtEvent.CONTROL</i></li>
 * <li><i>DwtEvent.DISPOSE</i></li>
 * <li><i>DwtEvent.HOVEROVER</i></li>
 * <li><i>DwtEvent.HOVEROUT</i></li>
 * <li><i>DwtEvent.ONCONTEXTMENU</i></li>
 * <li><i>DwtEvent.ONDBLCLICK</i></li>
 * <li><i>DwtEvent.ONFOCUS</i></li>
 * <li><i>DwtEvent.ONBLUR</i></li>
 * <li><i>DwtEvent.ONMOUSEDOWN</i></li>
 * <li><i>DwtEvent.ONMOUSEENTER</i></li>
 * <li><i>DwtEvent.ONMOUSELEAVE</i></li>
 * <li><i>DwtEvent.ONMOUSEMOVE</i></li>
 * <li><i>DwtEvent.ONMOUSEOUT</i></li>
 * <li><i>DwtEvent.ONMOUSEOVER</i></li>
 * <li><i>DwtEvent.ONMOUSEUP</i></li>
 * <li><i>DwtEvent.ONMOUSEWHEEL</i></li>
 * <li><i>DwtEvent.ONSELECTSTART</i></li>
 * <li><i>DwtEvent.ONCONTEXTMENU</i></li>
 * </ul>
 *
 * @author Ross Dargahi
 *
 * @param params		[hash]					hash of params:
 *        parent		[DwtComposite] 			Parent widget. Except in the case of <i>DwtShell</i>, the parent will be a control that is a subclass of <i>DwtComposite</i>.
 *        className		[string]*				CSS class
 *        posStyle		[constant]*				Positioning style (absolute, static, or relative). Defaults to <i>DwtControl.STATIC_STYLE</i>.
 *        deferred		[boolean]*				if true, postpone initialization until needed
 *        id			[string]*				An explicit ID to use for the control's HTML element. If not provided, defaults to an auto-generated ID.
 *        parentElement [string|HTMLElement]*	parent element
 *        index 		[int]*					index at which to add this control among parent's children
 */
DwtControl = function(params) {

	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtControl.PARAMS);

	/** parent component. Read-Only */
	var parent = this.parent = params.parent;
	if (parent && !(parent instanceof DwtComposite)) {
		throw new DwtException("Parent must be a subclass of Composite", DwtException.INVALIDPARENT, "DwtControl");
	}

	/** the control's <i>DwtShell</i>*/
	this.shell = null;

	/** Data object used to store "client data" on the widget via the
	 * <code>setData</code> and <code>getData</code> methods
	 * @type object */
	this._data = {};

	/** The event manager controls the mapping between event types and the
	 * registered listeners
	 * @type AjxEventMgr */
	this._eventMgr = new AjxEventMgr();

	/** true if the control is disposed, else false. The public api to this
	 * member is <code>isDisposed</code>.
	 * @type boolean */
	this._disposed = false;

 	if (!parent) { return; }

	/** CSS class name
	 * @type string*/
	this._className = params.className || "DwtControl";

	/** @type private */
	this.__posStyle = params.posStyle;

	/** id of the control's HTML element
	 * @type string */
	if (params.id) {
		this._htmlElId = params.id;
	}

	/** @private */
	this.__index = params.index;

	this.__parentElement = params.parentElement;

	/** enabled state of this control. Public APIs to this member are
	 * <code>getEnabled</code> and <code>setEnabled</code>
	 * @type boolean */
	this._enabled = false;

	/** Indicates the drag state of the control. Valid values are:<ul>
	 * <li>DwtControl._NO_DRAG<li>
	 * <li>DwtControl._DRAGGING<li>
	 * <li>DwtControl._DRAG_REJECTED<li></ul>
	 * @type number */
	this._dragging = null;

	/** Drag n drop icon. Valid when a drag and drop operation is ocurring
	 * @type HTMLElement*/
	this._dndProxy = null;

	/** Flag indicating whether the control has keyboard focus or not
	 * @type boolean*/
	this._hasFocus = false;

	if (!params.deferred) {
		this.__initCtrl();
	}

	/** Hover over listener
	 * @type AjxListener */
	this._hoverOverListener = new AjxListener(this, this.__handleHoverOver);

	/** Hover out listener
	 * @type AjxListener */
	this._hoverOutListener = new AjxListener(this, this.__handleHoverOut);

	// turn this on to receive only the dblclick event (rather than click,
	// click, dblclick); penalty is that single click's timer must expire
	// before it is processed; useful if control has both single and double
	// click actions, and single click action is heavy
	this._dblClickIsolation = false;

	// set to true to ignore OVER and OUT mouse events between elements in the same control
	this._ignoreInternalOverOut = false;

	// override this control's default template
	this.TEMPLATE = params.template || this.TEMPLATE;
};

DwtControl.PARAMS = ["parent", "className", "posStyle", "deferred", "id", "index", "template"];

DwtControl.ALL_BY_ID = {};

/**
 * This method returns the actual class name for the control. Subclasses will
 * override this method to return their own name
 *
 * @return class name
 * @type String
 */
DwtControl.prototype.toString =
function() {
	return "DwtControl";
};

//
// Constants
//

// Display states
DwtControl.NORMAL = "";

DwtControl.ACTIVE = "ZActive";
DwtControl.FOCUSED = "ZFocused";
DwtControl.DISABLED = "ZDisabled";
DwtControl.HOVER = "ZHover";
DwtControl.SELECTED = "ZSelected";
DwtControl.DEFAULT = "ZDefault";
DwtControl.ERROR = "ZError";

DwtControl._RE_STATES = new RegExp(
    "\\b(" +
    [   DwtControl.ACTIVE,  DwtControl.FOCUSED,     DwtControl.DISABLED,
        DwtControl.HOVER,   DwtControl.SELECTED,    DwtControl.DEFAULT,
        DwtControl.ERROR
    ].join("|") +
    ")\\b", "g"
);

// Position styles
/**  Static position style
 * @type String
 * @see  Dwt#STATIC_STYLE*/
DwtControl.STATIC_STYLE = Dwt.STATIC_STYLE;

/** Absolute position style
 * @type String
 * @see Dwt#ABSOLUTE_STYLE*/
DwtControl.ABSOLUTE_STYLE = Dwt.ABSOLUTE_STYLE;

/** Relative position style
 * @type String
 * @see Dwt#RELATIVE_STYLE*/
DwtControl.RELATIVE_STYLE = Dwt.RELATIVE_STYLE;

/** Relative position style
 * @type String
 * @see Dwt#RELATIVE_STYLE*/
DwtControl.FIXED_STYLE = Dwt.FIXED_STYLE;


// Overflow style
/** Clip on overflow
 * @type Int
 * @see Dwt#CLIP*/
DwtControl.CLIP = Dwt.CLIP;

/** Allow overflow to be visible
 * @type Int
 * @see Dwt#VISIBLE*/
DwtControl.VISIBLE = Dwt.VISIBLE;

/** Automatically create scrollbars if content overflows
 * @type Int
 * @see Dwt#SCROLL*/
DwtControl.SCROLL = Dwt.SCROLL;

/** Always have scrollbars whether content overflows or not
 * @type Int
 * @see Dwt#FIXED_SCROLL*/
DwtControl.FIXED_SCROLL = Dwt.FIXED_SCROLL;


/** Default value for sizing/position methods
 * @type Int
 * @see Dwt#DEFAULT*/
DwtControl.DEFAULT = Dwt.DEFAULT;

// DnD states
/** No drag in progress
 * @type number */
DwtControl._NO_DRAG = 1;

/** Drag in progress
 * @type number */
DwtControl._DRAGGING = 2;

/** Drag rejected
 * @type number */
DwtControl._DRAG_REJECTED = 3;

/** @private */
DwtControl.__DRAG_THRESHOLD = 3;

/** @private */
DwtControl.__TOOLTIP_THRESHOLD = 5;

/** @private */
DwtControl.__DND_HOVER_DELAY = 750;

/** @private */
DwtControl.__controlEvent = new DwtControlEvent();

/** @private */
// applies only if control has turned on _doubleClickIsolation (see above)
// want to hit sweet spot where value is more than actual dbl click speed,
// but as low as possible since it also the length of single click pause
DwtControl.__DBL_CLICK_TIMEOUT = 300;

//
// Data
//

DwtControl.prototype._displayState = "";

//
// Public methods
//

/**
 * Registers a control event listener for control events. Control events are essentially
 * resize and coordinate change events
 *
 * @param {AjxListener} listener Listener to be registered (required)
 *
 * @see DwtControlEvent
 * @see AjxListener
 * @see #removeControlListener
 * @see #removeAllListeners
 */
DwtControl.prototype.addControlListener =
function(listener) {
	this.addListener(DwtEvent.CONTROL, listener);
};

/**
 * Removes a control event listener for control events. Control events are essentially
 * resize and coordinate change events
 *
 * @param {AjxListener} listener Listener to be removed
 *
 * @see DwtControlEvent
 * @see AjxListener
 *
 * @see #addControlListener
 * @see #removeAllListeners
 */
DwtControl.prototype.removeControlListener =
function(listener) {
	this.removeListener(DwtEvent.CONTROL, listener);
};

/**
 * Registers a dispose listener for control events. Dispose events are fired when
 * a control is "destroyed" via the <i>dispose</i> method call
 *
 * @param {AjxListener} listener Listener to be registered (required)
 *
 * @see DwtDisposeEvent
 * @see AjxListener
 * @see #removeDisposeListener
 * @see #removeAllListeners
 * @see #dispose
 * @see #isDisposed
 */
DwtControl.prototype.addDisposeListener =
function(listener) {
	this.addListener(DwtEvent.DISPOSE, listener);
};

/**
 * Removes a dispose event listener for control events. Dispose events are fired when
 * a control is "destroyed" via the <i>dispose</i> method call
 *
 * @param {AjxListener} listener Listener to be removed
 *
 * @see DwtDisposeEvent
 * @see AjxListener
 * @see #addDisposeListener
 * @see #removeAllListeners
 * @see #dispose
 * @see #isDisposed
 */
DwtControl.prototype.removeDisposeListener =
function(listener) {
	this.removeListener(DwtEvent.DISPOSE, listener);
};

/**
 * Registers a listener with the control. The listener will be call when events
 * of type <code>eventType</code> fire
 *
 * @param {String} eventType Event type for which to listen (required)
 * @param {AjxListener} listener Listener to be registered (required)
 * @param index		[int]*			index at which to add listener
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #removeListener
 * @see #removeAllListeners
 * @see #notifyListeners
 */
DwtControl.prototype.addListener =
function(eventType, listener, index) {
	return this._eventMgr.addListener(eventType, listener, index);
};

/**
 * Removes a listener from the control.
 *
 * @param {String} eventType Event type for which to remove the listener (required)
 * @param {AjxListener} listener Listener to be removed (required)
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #addListener
 * @see #removeAllListeners
 */
DwtControl.prototype.removeListener =
function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
};


/**
 * Removes all listeners for a particular event type.
 *
 * @param {String} eventType Event type for which to remove listeners (required)
 *
 * @see DwtEvent
 * @see AjxListener
 * @see #addListener
 * @see #removeListener
 */
DwtControl.prototype.removeAllListeners =
function(eventType) {
	return this._eventMgr.removeAll(eventType);
};

/**
 * Queries to see if there are any listeners registered for a particular event type
 *
 * @param {String} eventType Event type for which to check for listener registration (required)
 *
 * @return True if there is an listener registered for the specified event type
 *
 * @see DwtEvent
 */
DwtControl.prototype.isListenerRegistered =
function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
};

/**
 * Notifys all listeners of type <code>eventType</code> with <code>event</code>
 *
 * @param {String} eventType Event type for which to send notifications (required)
 * @param {DwtEvent} event Event with which to notify. Typically a subclass of
 * 		DwtEvent
 *
 * @see DwtEvent
 */
DwtControl.prototype.notifyListeners =
function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
};

/**
 * Disposes of the control. This method will remove the control from under the
 * control of its parent and release any resources associate with the compontent
 * it will also notify any event listeners on registered  <i>DwtEvent.DISPOSE</i> event type
 *
 * Subclasses may override this method to perform their own dispose functionality but
 * should generallly call up to the parent method
 *
 * @see #isDisposed
 * @see #addDisposeListener
 * @see #removeDisposeListener
 */
DwtControl.prototype.dispose =
function() {
	if (this._disposed) { return; }

	if (this.parent != null && this.parent instanceof DwtComposite) {
		this.parent.removeChild(this);
	}
	this._elRef = null;
	
	if (DwtControl.ALL_BY_ID) {
		DwtControl.ALL_BY_ID[this._htmlElId] = null;
		delete DwtControl.ALL_BY_ID[this._htmlElId];
	}

	this._disposed = true;
	var ev = new DwtDisposeEvent();
	ev.dwtObj = this;
	this.notifyListeners(DwtEvent.DISPOSE, ev);
};

/**
 * This method is deprecated. Please use "document" directly.
 * @deprecated
 */
DwtControl.prototype.getDocument =
function() {
	return document;
};

/**
 * Returns the tab group member for this control. Tab group members can
 * be a native HTML form element, a DwtControl, or a DwtTabGroup (for more
 * complex or explicit tab-ordering.
 * <p>
 * By default, returns this object.
 */
DwtControl.prototype.getTabGroupMember = function() {
	return this;
};

/**
 * return the data associated with <code>key</code>. This data is set with the
 * <i>setData</i>
 * method
 *
 * @param {String} key
 *
 * @return data associated with <code>key</code>
 * @type Object
 *
 * @see #setData
 */
DwtControl.prototype.getData =
function(key) {
	return this._data[key];
};

/**
 * Associate data with a key. This method is useful for hanging client data off of
 * a control.
 *
 * @param {String} key The key with which to associate data
 * @param {Object} value The data
 *
 * @see #getData
 */
DwtControl.prototype.setData =
function(key, value) {
  this._data[key] = value;
};

/**
 * @return true if the control is in a disposed state, else return false
 * @type Boolean
 *
 * @see #dispose
 * @see #addDisposeListener
 * @see #removeDisposeListener
 */
DwtControl.prototype.isDisposed =
function() {
	return this._isDisposed;
};

/**
 * @return true if the control is in a initialized, else return false. In general
 * 		a control will not be initialized if it has been created in deffered mode
 * 		and has not yet been initialized
 * @type Boolean
 */
DwtControl.prototype.isInitialized =
function() {
	return this.__ctrlInited;
};

/**
 * This method is called to explicitly set keyboard focus to this component.
 */
DwtControl.prototype.focus =
function() {
	DwtShell.getShell(window).getKeyboardMgr().grabFocus(this);
};

/**
 * @return true if this control has keyboard focus, else return false
 * @type Boolean
 */
DwtControl.prototype.hasFocus =
function() {
	return this._hasFocus;
};

/**
 * This method is called by the keyboard navigation framework. It should be overriden
 * by derived classes to provide behaviour for supported key actions.
 *
 * @param {Int}	actionCode Action code on which to act. Action codes are typically
 * 		defined the the appropriate keymap
 * @param {DwtKeyEvent}	ev keyboard event (last keyboard event in sequence)
 *
 * @return true if the action is handled else return false
 *
 * @see DwtKeyMap
 * @see DwtKeyEvent
 */
DwtControl.prototype.handleKeyAction =
function(actionCode, ev) {
	return false;
};

/**
 * Reparents the control within the component hierarchy. Unlike <i>reparentHtmlElement</i>
 * which reparents the controls <i>div</i> within the DOM hierarchy, this method reparents
 * the whole control
 *
 * @param {DwtComposite} newParent The control's new parent
 *
 * @see #reparentHtmlElement
 */
DwtControl.prototype.reparent =
function(newParent, index) {
	if (!this._checkState()) { return; }

	var htmlEl = this.getHtmlElement();
	this.parent.removeChild(this, true);
	DwtComposite._pendingElements[this._htmlElId] = htmlEl;
	newParent.addChild(this, index);
	this.parent = newParent;
	// TODO do we need a reparent event?
};

/**
 * Reparents the HTML element of the control to the html element supplied as the
 * parameter to this method. Note this method only reparents the control's <i>div</i>
 * element and does not affect the component hierarchy. To reparent the control within
 * the component hierarchy, use the <i>reparent</i> method.
 *
 * @param {String|HTMLElement} htmlEl Either a string representing an ID, or an html element
 * @param {Number|HTMLElement} position (optional) Specify where to insert the element
 *
 * @see #reparent
 */
DwtControl.prototype.reparentHtmlElement =
function(htmlEl, position) {

	// If htmlEl is a string, then it is an ID so lookup the html element that
	// has the corresponding ID
	if (typeof htmlEl == "string") {
		htmlEl = document.getElementById(htmlEl);
	}
	if (!htmlEl) { return; }

	var el = this.getHtmlElement();
	if (position == null) {
		htmlEl.appendChild(el);
	} else if (typeof position == "object") {
		htmlEl.insertBefore(el, position);
	} else {
		if (htmlEl.childNodes[position]) {
			htmlEl.insertBefore(el, htmlEl.childNodes[position]);
		} else {
			htmlEl.appendChild(el);
		}
	}
};

/**
 * This method sets the event handling function for a given event type. This method
 * should be used judiciously as it can lead to unexpected results (for example if
 * overriding the control's mouse handlers). This method calls through to <i>Dwt.setHandler</i>
 *
 * @param {String} eventType Event type to override. Most of these are defined in
 * 		<i>DwtEvent</i>
 * @param {function} hdlrFunc Event handler function
 *
 * @see DwtEvent
 */
DwtControl.prototype.setHandler =
function(eventType, hdlrFunc) {
	if (!this._checkState()) { return; }

	var htmlElement = this.getHtmlElement();
	Dwt.setHandler(htmlElement, eventType, hdlrFunc);
};

/**
 * This method sets the event handling function for a given event type. This method
 * should be used judiciously as it can lead to unexpected results (for example if
 * overriding the control's mouse handlers)
 *
 * @param {String} eventType Event type to override. Most of these are defined in
 * 		DwtEvent
 * @param {function} hdlrFunc Event handler function
 *
 * @see DwtEvent
 */
DwtControl.prototype.clearHandler =
function(eventType) {
	if (!this._checkState()) { return; }

	var htmlElement = this.getHtmlElement();
	Dwt.clearHandler(htmlElement, eventType);
};

/**
 * Gets the bounds of the component. Bounds includes the location (not relevant for
 * statically position elements) and dimensions of the control (i.e. its <i>div</i>
 * element).
 *
 * @return The control's bounds
 * @type DwtRectangle
 *
 * @see DwtRectangle
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getBounds =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getBounds(this.getHtmlElement());
};

/**
 * Sets the bounds of a control. The position type of the control must
 * be absolute or else an exception is thrown. To omit setting a value set the
 * actual parameter value to <i>Dwt.DEFAULT</i>
 *
 * @param {Int|String} x x coordinate of the element. e.g. 10, "10px", Dwt.DEFAULT
 * @param {Int|String} y y coordinate of the element. e.g. 10, "10px", Dwt.DEFAULT
 * @param {Int|String} width width of the element e.g. 100, "100px", "75%", Dwt.DEFAULT
 * @param {Int|String} height height of the element  e.g. 100, "100px", "75%", Dwt.DEFAULT
 *
 * @return this
 * @type DwtControl
 *
 * @throws DwtException
 *
 * @see DwtRectangle
 * @see #getBounds
 * @see #setSize
 * @see #setLocation
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 */
DwtControl.prototype.setBounds =
function(x, y, width, height) {
	if (!this._checkState()) { return; }

	var htmlElement = this.getHtmlElement();
	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		this.__controlEvent.reset(DwtControlEvent.RESIZE | DwtControlEvent.MOVE);
		var bds = Dwt.getBounds(htmlElement);
		this.__controlEvent.oldX = bds.x;
		this.__controlEvent.oldY = bds.y;
		this.__controlEvent.oldWidth = bds.width;
		this.__controlEvent.oldHeight = bds.height;
		this.setLocation(x, y);
		this.setSize(width, height);
		bds = Dwt.getBounds(htmlElement);
		this.__controlEvent.newX = bds.x;
		this.__controlEvent.newY = bds.y;
		this.__controlEvent.newWidth = bds.width;
		this.__controlEvent.newHeight = bds.height;
		this.__controlEvent.requestedWidth = width;
		this.__controlEvent.requestedHeight = height;
		this.notifyListeners(DwtEvent.CONTROL, this.__controlEvent);
	} else {
		this.setLocation(x, y);
		this.setSize(width, height);
	}

	return this;
}

/**
 * Returns the class name of this control. The class name may be set
 * when constructing the control. If it is not passed into the constructor, it
 * defaults to the control's class name. The class name is generally used as the
 * CSS class name for the control, although control's that change visual behaviour
 * based on state may append (or even use different) class names. See the documentation
 * of the specific component for details.
 *
 * @return control's class name
 * @type String
 *
 * @see #setClassName
 */
DwtControl.prototype.getClassName =
function() {
	return this._className;
};

/**
 * Sets the control's classname. This also autmatically sets the control's CSS
 * class name (i.e. the control's htmlElement's class name). Subclasses of <i>DwtControl</i>
 * may override this method to perform a different behaviour.
 *
 * @param {String} className The new class name for the control
 *
 * @see #getClassName
 */
DwtControl.prototype.setClassName =
function(className) {
	if (!this._checkState()) { return; }

	this._className = className;
    var el = this.getHtmlElement();
    el.className = className;
    Dwt.addClass(el, this._displayState);
};

/**
 * Adds a class name to this control's HTML element.
 *
 * @param {String} className
 */
DwtControl.prototype.addClassName = function(className) {
	Dwt.addClass(this.getHtmlElement(), className);
};

/**
 * Removes a class name from this control's HTML element.  Optionally adds a
 * new class name.
 *
 * @param {String} delClass Class to remove
 * @param {String} addClass Class to add (optional)
 */
DwtControl.prototype.delClassName = function(delClass, addClass) {
	Dwt.delClass(this.getHtmlElement(), delClass, addClass);
};

/**
 * Conditionally adds or removes a class name to this control's HTML element.
 *
 * @param {boolean} condition
 * @param {String} classWhenTrue Class name to add when condition is true
 * @param {String} classWhenFalse Class name to add when contition is false (optional)
 *
 * The class names are used exclusively, that is: when condition is true,
 * classWhenTrue is added and classWhenFalse is removed (if present and
 * specified).  When condition is false, classWhenTrue is removed and
 * classWhenFalse is added (again, if present and specified).
 */
DwtControl.prototype.condClassName = function(condition, classWhenTrue, classWhenFalse) {
	Dwt.condClass(this.getHtmlElement(), condition, classWhenTrue, classWhenFalse);
};

DwtControl.prototype.setDisplayState =
function(state) {
    if (!this._enabled) state = DwtControl.DISABLED;

    if (arguments.length > 1) {
        var a = [];
        for (var i = 0; i < arguments.length; i++) {
            a.push(arguments[i]);
        }
        state = a.join(" ");
    }
    if (this._displayState != state) {
        this._displayState = state;
        Dwt.delClass(this.getHtmlElement(), DwtControl._RE_STATES, state);
    }
};

/**
* Adds an alert style to the control, for example to indicate that a new message has arrived.
*/
DwtControl.prototype.showAlert =
function(alert) {
	if (alert && !this._alert) {
		this.delClassName(null, "ZAlert");
	} else if (!alert && this._alert) {
		this.delClassName("ZAlert", null);
	}
	this._alert = alert;
};

/**
* Returns true if the control is showing an alert.
*/
DwtControl.prototype.isAlertShown =
function() {
	return this._alert;
};

DwtControl.prototype._createHtmlFromTemplate =
function(templateId, data) {
    // set html content
    this.getHtmlElement().innerHTML = AjxTemplate.expand(templateId, data);

    // set container class name, if needed
    var params = AjxTemplate.getParams(templateId);
    var className = params && params["class"];
    if (className) {
        className = [ this._className, className ].join(" ");
        this.setClassName(className);
    }
};

/**
 * @return the control's cursor
 * @type String
 *
 * @see #setCursor
 */
DwtControl.prototype.getCursor =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getCursor(this.getHtmlElement());
};

/**
 * Sets the control's cursor
 *
 * @param {String} cursorName name of the new cursor
 *
 * @see #getCursor
 */
DwtControl.prototype.setCursor =
function(cursorName) {
	if (!this._checkState()) { return; }

	Dwt.setCursor(this.getHtmlElement(), cursorName);
};

/**
 * @return the controls drag source. May be null
 * @type DwtDragSource
 *
 * @see #setDragSource
 * @see DwtDragSource
 */
DwtControl.prototype.getDragSource =
function() {
	return this._dragSource;
};

/**
 * Set the drag source for the control. The drag source binds the Drag drop system with
 * an application. Setting a control's drag source makes the control draggable
 *
 * @param {DwtDragSource} dragSource the control's drag source
 *
 * @see #getDragSource
 * @see DwtDragSource
 */
DwtControl.prototype.setDragSource =
function(dragSource) {
	this._dragSource = dragSource;
	if (dragSource != null && this._ctrlCaptureObj == null) {
		this._ctrlCaptureObj = new DwtMouseEventCapture({
			targetObj:this,
			id:"DwtControl",
			mouseOverHdlr:DwtControl.__mouseOverHdlr,
			mouseDownHdlr:DwtControl.__mouseDownHdlr,
			mouseMoveHdlr:DwtControl.__mouseMoveHdlr,
			mouseUpHdlr:DwtControl.__mouseUpHdlr,
			mouseOutHdlr:DwtControl.__mouseOutHdlr
		});
		this._dndHoverAction = new AjxTimedAction(null, this.__dndDoHover);
	}
};

/**
 * @return the controls drop target. May be null
 * @type DwtDropTarget
 *
 * @see #setDropTarget
 * @see DwtDropTarget
 */
DwtControl.prototype.getDropTarget =
function() {
	return this._dropTarget;
};

/**
 * Set the drop target for the control. The drop target binds the Drag drop system with
 * an application. Setting a control's drop target makes the control a potential drop
 * target within an application
 *
 * @param {DwtDropTarget} dropTarget the control's drop target
 *
 * @see #getDropTarget
 * @see DwtDropTarget
 */
DwtControl.prototype.setDropTarget =
function(dropTarget) {
	this._dropTarget = dropTarget;
};

/**
 * @return The enabled state of the control
 * @type Boolean
 *
 * @see #setEnabled
 */
DwtControl.prototype.getEnabled =
function() {
	if (!this._checkState()) { return; }

	return this._enabled;
};

/**
 * Sets the control's enabled state. If <code>setHtmlElement</code> is true, then
 * this method will also set the control's html element disabled attribute
 *
 * @param {Boolean} enabled true the control is enabled
 * @param {Boolean} setHtmlElement true, then set the control's html element
 * 		disabled attribute (optional)
 */
DwtControl.prototype.setEnabled =
function(enabled, setHtmlElement) {
	if (!this._checkState()) { return; }

	if (enabled != this._enabled) {
		this._enabled = enabled;
        this.setDisplayState(enabled ? DwtControl.NORMAL : DwtControl.DISABLED);
        if (setHtmlElement)
			this.getHtmlElement().disabled = !enabled;
	}
};

/**
 * Returns the ID of the control's containing HTML element.
 *
 * @return the ID of the control's containing HTML element
 * @type String
 */
DwtControl.prototype.getHTMLElId =
function () {
	return this._htmlElId;
};

/**
 * Returns the control's containing HTML element. By default this is a div element
 *
 * @return The control's containing HTML element
 * @type HTMLElement
 */
DwtControl.prototype.getHtmlElement =
function() {
	if (!this._checkState()) { return; }

	var htmlEl = this._elRef || document.getElementById(this._htmlElId);
	if (htmlEl == null) {
		htmlEl = DwtComposite._pendingElements[this._htmlElId];
	} else if (!htmlEl._rendered) {
		delete DwtComposite._pendingElements[this._htmlElId];
		htmlEl._rendered = true;
	}
	return this._elRef = htmlEl;
};

/**
 * Returns the control associated with the given element, if any.
 * 
 * @param htmlEl	[Element]	an HTML element
 */
DwtControl.fromElement =
function(htmlEl)  {
	return DwtControl.ALL_BY_ID && DwtControl.ALL_BY_ID[htmlEl.id];
};

/**
 * Returns the control associated with the given element ID, if any.
 * 
 * @param htmlElId	[string]	an HTML element ID
 */
DwtControl.fromElementId =
function(htmlElId)  {
	return DwtControl.ALL_BY_ID && DwtControl.ALL_BY_ID[htmlElId];
};

/**
 * Starts with an element and works its way up the element chain until it finds one
 * with an ID that maps to a DwtControl.
 * 
 * @param htmlEl	[Element]	element to start with
 */
DwtControl.findControl =
function(htmlEl)  {
	while (htmlEl) {
		try {
			// catch Firefox bug that throws "Permission denied" exception
			if (htmlEl.id && DwtControl.ALL_BY_ID && DwtControl.ALL_BY_ID[htmlEl.id]) {
				return DwtControl.ALL_BY_ID[htmlEl.id];
			}
		} catch (ex) { return null; }
		htmlEl = htmlEl.parentNode;
	}
	return null;
};

/**
 * Returns the control associated with the given event. Starts with the
 * event target and works its way up the element chain until it finds one
 * with an ID that maps to a DwtControl.
 * 
 * @param ev				[Event]		DHTML event
 * @param useRelatedTarget	[boolean]*	if true, use element that was related to this event
 */
DwtControl.getTargetControl =
function(ev, useRelatedTarget)  {
	var htmlEl = DwtUiEvent.getTarget(ev, useRelatedTarget);
	return htmlEl ? DwtControl.findControl(htmlEl) : null;
};

/**
 * Sets the control's  HTML element's id attribute
 *
 * @param {String} id New id
 */
DwtControl.prototype.setHtmlElementId =
function(id) {
	if (this._disposed) { return; }

	if (this.__ctrlInited) {
		var htmlEl = this.getHtmlElement();
		if (!htmlEl._rendered) {
			delete DwtComposite._pendingElements[this._htmlElId];
			DwtComposite._pendingElements[id] = htmlEl;
		}
		htmlEl.id = id;
	}
	this._htmlElId = id;
};

/**
 * @return the x coordinate of the control (if it is absolutely positioned)
 * @type Int
 *
 * @see #getBounds
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getX =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getLocation(this.getHtmlElement()).x;
};

/**
 * @return the horizontal extent of the control (if it is absolutely positioned)
 * @type Int
 *
 * @see #getBounds
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getXW =
function() {
	if (!this._checkState()) { return; }

    var bounds = this.getBounds();
	return bounds.x+bounds.width;
};

/**
 * @return the y coordinate of the control (if it is absolutely positioned)
 * @type Int
 *
 * @see #getBounds
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getY =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getLocation(this.getHtmlElement()).y;
};

/**
 * @return the vertical extent of the control (if it is absolutely positioned)
 * @type Int
 *
 * @see #getBounds
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getYH =
function() {
	if (!this._checkState()) { return; }

    var bounds = this.getBounds();
	return bounds.y+bounds.height;
};

/**
 * Returns the location of the control
 *
 * @return the location of <code>htmlElement</code>
 *
 * @see #getBounds
 * @see #getSize
 * @see #setLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #setBounds
 * @see #setSize
 * @see Dwt
 */
DwtControl.prototype.getLocation =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getLocation(this.getHtmlElement());
};

/**
 * Sets the location of the control. The position style of the control must
 * be absolute or else an exception is thrown. To only set one of the coordinates,
 * pass in a value of <i>Dwt.DEFAULT</i> for the coordinate for which the value is
 * not to be set.
 *
 * If there are any <i>DwtEvent.CONTROL</i> listeners registered on the control, they
 * will be called.
 *
 * @param {Int|String} x x coordinate of the element. e.g. 10, "10px", Dwt.DEFAULT
 * @param {Int|String} y y coordinate of the element. e.g. 10, "10px", Dwt.DEFAULT
 *
 * @return this
 * @type DwtControl
 *
 * @throws DwtException
 *
 * @see #getBounds
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #setBounds
 * @see #setSize
 * @see Dwt
 */
DwtControl.prototype.setLocation =
function(x, y) {
	if (!this._checkState()) { return; }

	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		var htmlElement = this.getHtmlElement();
		this.__controlEvent.reset(DwtControlEvent.MOVE);
		var loc = Dwt.getLocation(htmlElement);
		this.__controlEvent.oldX = loc.x;
		this.__controlEvent.oldY = loc.y;
		Dwt.setLocation(htmlElement, x, y);
		loc = Dwt.getLocation(htmlElement);
		this.__controlEvent.newX = loc.x;
		this.__controlEvent.newY = loc.y;
		this.notifyListeners(DwtEvent.CONTROL, this.__controlEvent);
	} else {
		Dwt.setLocation(this.getHtmlElement(), x, y);
	}
	return this;
};

/**
 * Returns the control's scroll style. The scroll style determines the control's
 * behaviour when content overflows its div's boundries. Possible values are:
 * <ul>
 * <li><i>Dwt.CLIP</i> - Clip on overflow</li>
 * <li><i>Dwt.VISIBLE</i> - Allow overflow to be visible</li>
 * <li><i>Dwt.SCROLL</i> - Automatically create scrollbars if content overflows</li>
 * <li><i>Dwt.FIXED_SCROLL</i> - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @return the control's scroll style
 * @type Int
 */
DwtControl.prototype.getScrollStyle =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getScrollStyle(this.getHtmlElement());
};

/**
 * Sets the control's scroll style. The scroll style determines the control's
 * behaviour when content overflows its div's boundries. Possible values are:
 * <ul>
 * <li><i>Dwt.CLIP</i> - Clip on overflow</li>
 * <li><i>Dwt.VISIBLE</i> - Allow overflow to be visible</li>
 * <li><i>Dwt.SCROLL</i> - Automatically create scrollbars if content overflows</li>
 * <li><i>Dwt.FIXED_SCROLL</i> - Always have scrollbars whether content overflows or not</li>
 * </ul>
 *
 * @param {Int} scrollStyle the control's new scroll style
 */
DwtControl.prototype.setScrollStyle =
function(scrollStyle) {
	if (!this._checkState()) { return; }

	Dwt.setScrollStyle(this.getHtmlElement(), scrollStyle);
};

/**
 * Sets the control's position. The position determines the control's
 * location within the context of which it was created. Possible values are:
 * <ul>
 * <li><i>DwtControl.STATIC_STYLE</i> - Allow browser to control content flow</li>
 * <li><i>DwtControl.ABSOLUTE_STYLE</i> - Allow content to be positioned relative to parent or body</li>
 * <li><i>DwtControl.RELATIVE_STYLE</i> - Allow browser to control content flow but relative to parent</li>
 * </ul>
 *
 * @param {Int} position the control's new position
 */

DwtControl.prototype.setPosition =
function(position) {
	if (!this._checkState()) { return; }

	if (position == DwtControl.STATIC_STYLE ||
		position == DwtControl.ABSOLUTE_STYLE ||
		position == DwtControl.RELATIVE_STYLE)
	{
		this.__posStyle = position;
		Dwt.setPosition(this.getHtmlElement(), position);
	}
};

/**
 * @return the width of the control
 * @type Int
 *
 * @see #getBounds
 * @see #getSize
 * @see #getLocation
 * @see #getH
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getW =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getSize(this.getHtmlElement()).x;
};

/**
 * @return the height of the control
 * @type Int
 *
 * @see #getBounds
 * @see #getSize
 * @see #getLocation
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setLocation
 * @see #setSize
 */
DwtControl.prototype.getH =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getSize(this.getHtmlElement()).y;
};

/**
 * @return The size of the control. The x value of the returned point is the width
 * 		and the y is the height
 * @type DwtPoint
 *
 * @see #getBounds
 * @see #getLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 * @see #setSize
 * @see #setLocation
 */
DwtControl.prototype.getSize =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getSize(this.getHtmlElement());
};

/**
 * Sets the size of the control
 *
 * @param {Int|String} width width of the control e.g. 100, "100px", "75%", Dwt.DEFAULT
 * @param {Int|String} height height of the control  e.g. 100, "100px", "75%", Dwt.DEFAULT
 *
 * @return this
 * @type DwtControl
 *
 * @see #getBounds
 * @see #getSize
 * @see #setLocation
 * @see #getH
 * @see #getW
 * @see #getX
 * @see #getXW
 * @see #getY
 * @see #getYH
 * @see #setBounds
 */
DwtControl.prototype.setSize =
function(width, height) {
	if (!this._checkState()) { return; }

	if (this.isListenerRegistered(DwtEvent.CONTROL)) {
		var htmlElement = this.getHtmlElement();
		this.__controlEvent.reset(DwtControlEvent.RESIZE);
		var sz = Dwt.getSize(htmlElement);
		this.__controlEvent.oldWidth = sz.x;
		this.__controlEvent.oldHeight = sz.y;
		Dwt.setSize(htmlElement, width, height);
		sz = Dwt.getSize(htmlElement);
		this.__controlEvent.newWidth = sz.x;
		this.__controlEvent.newHeight = sz.y;
		this.notifyListeners(DwtEvent.CONTROL, this.__controlEvent);
	} else {
		Dwt.setSize(this.getHtmlElement(), width, height);
	}
	return this;
};

/**
 * Returns static tooltip content (typically set using setToolTipContent). Controls
 * that want to return dynamic tooltip content should override this method.
 *
 * @param ev	[DwtEvent]		mouseover event
 * @return the tooltip content set for the control
 * @type String
 */
DwtControl.prototype.getToolTipContent =
function(ev) {
	if (this._disposed) { return; }

	return this.__toolTipContent;
};

/**
 * Sets static tooltip content for the control. The content may be plain text or HTML.
 *
 * @param {String|AjxCallback} tooltip content or callback that specifies the content
 */
DwtControl.prototype.setToolTipContent =
function(text) {
	if (this._disposed) { return; }

	this.__toolTipContent = text;
};

/**
 * @return true if the control is visible (i.e. its HTML elements display style
 * 		attribute is not none)
 * @type Boolean
 *
 * @see Dwt#getVisibile
 */
DwtControl.prototype.getVisible =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getVisible(this.getHtmlElement());
};

/**
 * Sets the the visible state of the control's HTML element.
 *
 * @param {boolean} false if the control should not be displayed (gets style
 * "display: none", don't confuse with setVisibility).  true if the control
 * should be displayed.
 *
 * @see Dwt#setVisible
 */
DwtControl.prototype.setVisible =
function(visible) {
	if (!this._checkState()) { return; }

	Dwt.setVisible(this.getHtmlElement(), visible);
};

/**
 * Sets the visibility of the control's HTML element
 *
 * @param {Boolean} visible If true then the control is visible
 *
 * @see Dwt#setVisibility
 */
DwtControl.prototype.setVisibility =
function(visible) {
	if (!this._checkState()) { return; }

	Dwt.setVisibility(this.getHtmlElement(), visible);
};

/**
 * @return true if the control is visible (i.e. its HTML elements visibility play style
 * 		attribute is not hiddeen)
 * @type Boolean
 *
 * @see Dwt#getVisibility
 */
DwtControl.prototype.getVisibility =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getVisiblility(this.getHtmlElement());
};


/**
 * Returns the control's z-index value.
 *
 * @return z-index value
 * @type Int
 */
DwtControl.prototype.getZIndex =
function() {
	if (!this._checkState()) { return; }

	return Dwt.getZIndex(this.getHtmlElement());
};

/**
 * Sets the z-index for the control's HTML element. Since z-index is only relevant among peer
 * elements, we make sure that all elements that are being displayed via z-index hang off the
 * main shell.
 *
 * @param {Int} idx The new z-index for this element
 */
DwtControl.prototype.setZIndex =
function(idx) {
	if (!this._checkState()) { return; }

	Dwt.setZIndex(this.getHtmlElement(), idx);
};

/**
 * Convenience function to toggle visibility using z-index. It uses the two lowest level
 * z-indexes (<i>Dwt.Z_VIEW</i> and <i>Dwt.Z_HIDDEN</i> respectively). Any further
 * stacking will have to use setZIndex() directly.
 *
 * @param {Boolean} show true if we want to show the element, false if we want to hide it
 *
 * @see #setZIndex
 */
DwtControl.prototype.zShow =
function(show) {
	this.setZIndex(show ? Dwt.Z_VIEW : Dwt.Z_HIDDEN);
};

/**
 * TODO
 */
DwtControl.prototype.setDisplay =
function(value) {
	if (!this._checkState()) { return; }

	Dwt.setDisplay(this.getHtmlElement(), value);
};

/**
 * TODO
 */
DwtControl.prototype.preventSelection =
function(targetEl) {
	return !this.__isInputEl(targetEl);
};

/**
 * TODO
 */
DwtControl.prototype.preventContextMenu =
function(targetEl) {
	return targetEl ? (!this.__isInputEl(targetEl)) : true;
};

/**
 * This method sets the content of the control's HTML element to the provided
 * content. Care should be taken when using this method as it can blow away all
 * the content of the control which can be particularly bad if the control is
 * a <i>DwtComposite</i> with children. Generally this method should be used
 * controls which are being directly instantiated and used as a canvas
 *
 * @param {String} content HTML content
 */
DwtControl.prototype.setContent =
function(content) {
	if (content)
		this.getHtmlElement().innerHTML = content;
};

/**
 * This method clears the content of the control's HTML element.
 * Care should be taken when using this method as it can blow away all
 * the content of the control which can be particularly bad if the control is
 * a <i>DwtComposite</i> with children. Generally this method should be used
 * controls which are being directly instantiated and used as a canvas
 */
DwtControl.prototype.clearContent =
function() {
	this.getHtmlElement().innerHTML = "";
};

/**
 * Appends this control's element to the specified element.
 *
 * @param elemOrId  [Element|string]    DOM element or element id.
 */
DwtControl.prototype.appendElement =
function(elemOrId) {
    var el = AjxUtil.isString(elemOrId) ? document.getElementById(elemOrId) : elemOrId;
    if (el) {
        el.appendChild(this.getHtmlElement(), el);
    }
};

/**
 * Replaces the specified element with this control's element.
 *
 * @param elemOrId  [Element|string]    DOM element or element id.
 */
DwtControl.prototype.replaceElement =
function(elemOrId, inheritClass, inheritStyle) {
    var oel = AjxUtil.isString(elemOrId) ? document.getElementById(elemOrId) : elemOrId;
    if (oel) {
        var nel = this.getHtmlElement();
        oel.parentNode.replaceChild(nel, oel);
        this._replaceElementHook(oel, nel, inheritClass, inheritStyle);
    }
};

/**
 * This method is a hook for sub-classes that want to intercept the
 * inheriting of class and style when an element is replaced. By
 * default, the new will will inherit the class and style. In order
 * to prevent this behavior, you must pass in a <code>true</code>
 * or <code>false</code> value.
 */
DwtControl.prototype._replaceElementHook =
function(oel, nel, inheritClass, inheritStyle) {
    if ((inheritClass == null || inheritClass) && oel.className) {
        Dwt.addClass(nel, oel.className);
    }
    if (inheritStyle == null || inheritStyle) {
        var style = oel.getAttribute("style");
        if (style) {
            nel.setAttribute("style", [nel.getAttribute("style"),style].join(";"))
        }
    }
};

/**
 * Applies part of the hack to make the blinking curosor show up in
 * Firefox text input fields. This should be called when some DOM
 * region -- such as a dialog or a tab page -- is being displayed.
 */
DwtControl.prototype.applyCaretHack =
function() {
	if (Dwt.CARET_HACK_ENABLED) {
		var shellElement = this.shell.getHtmlElement();
		var myElement = this.getHtmlElement();

		// Go up the hierarchy and find the element that is a child of the shell.
		var childElement = myElement;
		while (childElement.parentNode && (childElement.parentNode != shellElement)) {
			childElement = childElement.parentNode;
		}
		// Remove the child from the shell, and then put it back exactly where it was.
		if (childElement) {
			var sibling = childElement.nextSibling;
			shellElement.removeChild(childElement);
			shellElement.insertBefore(childElement, sibling);
		}
	}
};

/**
 * This protected method is called by the keyboard navigate infrastructure when a control
 * gains focus. This method should be overridden by derived classes to provide
 * the visual behaviour for the component losing focus
 *
 * @see #_focus
 * @see #_focusByMouseUpEvent
 * @see #focus
 */
DwtControl.prototype._blur =
function() {
};

/**
 * This protected method should be overridden by derived classes to provide
 * behaviour for the component gaining focus e.g. providing a border or
 * highlighting etc...
 *
 * @see #_blur
 * @see #_focusByMouseUpEvent
 * @see #focus
 */
DwtControl.prototype._focus =
function() {
};

/**
 * This protected method is called from mouseUpHdl. Subclasses may override this method
 * if they have their own specialized focus management code.
 *
 * @see #_blur
 * @see #_focus
 * @see #focus
 */
DwtControl.prototype._focusByMouseUpEvent =
function(ev)  {
 	if (this.getEnabled()) {
 		this.focus();
 	}
};

// This is for bug 11827.
// TODO: we should remove _focusByMouseUpEvent and update all classes
// that define it to use _focusByMouseDownEvent instead
DwtControl.prototype._focusByMouseDownEvent =
function(ev) {
	this._focusByMouseUpEvent(ev);
};

/**
 * Subclasses may override this protected method to return an HTML element that will represent
 * the dragging icon. The icon must be created on the DwtShell widget. This means that the
 * icon must be a child of the shells HTML component If this method returns
 * null, it indicates that the drag failed. This method is called when a control is
 * being dragged and it has a valid drag source
 *
 * @return The DnD dragging icon. This is typically a div element
 * @type HTMLElement
 *
 * @see #_setDragProxyState
 * @see #_destroyDragProxy
 * @see #_isValidDragObject
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 */
DwtControl.prototype._getDragProxy =
function(dragOp) {
	DBG.println(AjxDebug.DBG2, "DwtControl.prototype._getDragProxy");
	return null;
};

/**
 * Subclasses may override this method to set the DnD icon properties based on whether drops are
 * allowed. The default implementation sets the class on the HTML element obtained
 * from <code>_getDragProxy</code> to DwtCssStyle.DROPPABLE if <code>dropAllowed</code> is true and
 * to DwtCssStyle.NOT_DROPPABLE if false
 *
 * @param {Boolean} dropAllowed If true, then dropping is allowed on the drop zone so set
 * 		DnD icon to the visually reflect this
 *
 * @see #_getDragProxy
 * @see #_destroyDragProxy
 * @see #_isValidDragObject
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 */
DwtControl.prototype._setDragProxyState =
function(dropAllowed) {
	Dwt.condClass(this._dndProxy, dropAllowed, DwtCssStyle.DROPPABLE, DwtCssStyle.NOT_DROPPABLE);
};


/** @private */
DwtControl.__junkIconId = 0;

/**
 * Subclasses may override this method to destroy the DnD icon HTML element
 *
 * @see #_getDragProxy
 * @see #_setDragProxyState
 * @see #_isValidDragObject
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 */
DwtControl.prototype._destroyDragProxy =
function(icon) {
	if (icon) {
		// not sure why there is no parent node, but if there isn't one,
		// let's try and do our best to get rid of the icon
		if (icon.parentNode) {
			icon.parentNode.removeChild(icon);
		} else {
			// at least hide the icon, and change the id so we can't get it back later
			icon.style.zIndex = -100;
			icon.id = "DwtJunkIcon" + DwtControl.__junkIconId++;
			icon = null;
		}
	}
};

/**
 * Subclasses may override this method to provide feedback as to whether a possibly
 * valid capture is taking place. For example, there are instances such as when a mouse
 * down happens on a scroll bar in a DwtListView that are reported in the context of
 * the DwtListView, but which are not really a valid mouse down i.e. on a list item. In
 * such cases this function would return false
 *
 * @return True if the object is a valid drag obejct
 * @type Boolean
 *
 * @see #_getDragProxy
 * @see #_setDragProxyState
 * @see #_destroyDragProxy
 * @see #_dragEnter
 * @see #_dragOver
 * @see #_dragHover
 * @see #_dragLeave
 * @see #_drop
 * @see #setDragSource
 * @see DwtDropTarget
 * @see DwtDragSource
 */
 DwtControl.prototype._isValidDragObject =
 function(ev) {
 	return true;
 };

/**
 . _dragHover is called multiple times as the user hovers over
 * the control. _dragLeave is called when the drag operation exits the control.
 * _drop is called when the item is dropped on the target.
 */

 /**
  * This protected method is called when a drag operation enters a control. Subclasses
  * supporting drop targets should implement this method to visual indicate that they are a
  * drop target. This could be by changing the background etc. Note that it is the
  * responsibility of the drag source (the control being dragged) to change its icon state
  * to reflect whether the drop target is valid for the drag source
  *
  * @param {DwtMouseEvent} ev mouse event that is associated with the drag op
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragOver
  * @see #_dragHover
  * @see #_dragLeave
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  */
DwtControl.prototype._dragEnter =
function(ev) {
};

 /**
  * This protected method is called multiple times as a dragged control crosses over this control
  * Subclasses supporting drop targets may implement this method for additional visual
  * indication, such as indicating "landing zones" in the control for drop operations
  *
  * @param {DwtMouseEvent} ev mouse event that is associated with the drag op
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_dragLeave
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  */
DwtControl.prototype._dragOver =
function(ev) {
};

 /**
  * This protected method is called every 750ms as an item hovers over this control
  * Subclasses supporting drop targets may implement this method for additional visual
  * indication or actions, such as expanding a collapsed tree node if the user hovers
  * over the node for a period of time.
  *
  * @param {DwtMouseEvent} ev mouse event that is associated with the drag op
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_dragLeave
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  */
DwtControl.prototype._dragHover =
function(ev) {
};

 /**
  * This protected method is called when the drag operation exits the control
  * Subclasses supporting drop targets should implement this method to reset the
  * visual to the default (i.e. reset the actions performed as part of the
  * <code>_dragEnter</code> method.
  *
  * @param {DwtMouseEvent} ev mouse event that is associated with the drag op
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_drop
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  */
DwtControl.prototype._dragLeave =
function(ev) {
};


/**
  * This protected method is called when the a drop occurs on the control
  * Subclasses supporting drop targets may implement this method to provide a
  * visual indication that the drop succeeded (e.g. an animation such as flashing
  * the drop target).
  *
  * @param {DwtMouseEvent} ev mouse event that is associated with the drag op
  *
  * @see #_getDragProxy
  * @see #_setDragProxyState
  * @see #_destroyDragProxy
  * @see #_isValidDragObject
  * @see #_dragEnter
  * @see #_dragHover
  * @see #_dragLeave
  * @see #setDragSource
  * @see DwtDropTarget
  * @see DwtDragSource
  */
DwtControl.prototype._drop =
function(ev) {
};

/**
 * This convenience methods sets or clears the control's event handler for key
 * press events as defined by <i>DwtEvent.ONKEYPRESS</i>
 *
 * @param {Boolean} clear true the keypress events handler is cleared
 */
DwtControl.prototype._setKeyPressEventHdlr =
function(clear) {
	this._setEventHdlrs([DwtEvent.ONKEYPRESS], clear);
};

/**
 * This convenience methods sets or clears the control's event handlers for mouse
 * events as defined by <i>DwtEvent.MOUSE_EVENTS</i>
 *
 * @param {Boolean} clear true the mouse events handlers are cleared
 */
DwtControl.prototype._setMouseEventHdlrs =
function(clear) {
	this._setEventHdlrs(DwtEvent.MOUSE_EVENTS, clear);
};

/**
 * This protected method will set or clear the event handlers for the provided array
 * of events.
 *
 * @param {Array} events This is an array of events for which to set or clear the
 * 		control's event handlers. The set of events supported by the control are:
 * 		<ul>
 * 		<li><i>DwtEvent.ONCONTEXTMENU</i></li>
 * 		<li><i>DwtEvent.ONDBLCLICK</i></li>
 * 		<li><i>DwtEvent.ONMOUSEDOWN</i></li>
 * 		<li><i>DwtEvent.ONMOUSEENTER</i></li>
 * 		<li><i>DwtEvent.ONMOUSELEAVE</i></li>
 * 		<li><i>DwtEvent.ONMOUSEMOVE</i></li>
 * 		<li><i>DwtEvent.ONMOUSEOUT</i></li>
 * 		<li><i>DwtEvent.ONMOUSEOVER</i></li>
 * 		<li><i>DwtEvent.ONMOUSEUP</i></li>
 * 		<li><i>DwtEvent.ONMOUSEWHEEL</i></li>
 * 		<li><i>DwtEvent.ONSELECTSTART</i></li>
 * 		<li><i>DwtEvent.ONKEYPRESS</i></li>
 * 		</ul>
 * @param {Boolean} clear if present and true, then the event handlers are cleared
 * 		for the set of events. Else they are set
 *
 * @see Dwt#setHandler
 * @see Dwt#clearHandler
 */
DwtControl.prototype._setEventHdlrs =
function(events, clear) {
	if (!this._checkState()) { return; }

	var htmlElement = this.getHtmlElement();
	for (var i = 0; i < events.length; i++) {
		if (clear !== true) {
			Dwt.setHandler(htmlElement, events[i], DwtControl.__HANDLER[events[i]]);
		} else {
			Dwt.clearHandler(htmlElement, events[i]);
		}
	}
};

DwtControl.prototype._setMouseEvents =
function() {
	// add custom mouse handlers to standard ones
	var mouseEvents = [DwtEvent.ONCONTEXTMENU, DwtEvent.ONDBLCLICK, DwtEvent.ONMOUSEDOWN,
					   DwtEvent.ONMOUSEMOVE, DwtEvent.ONMOUSEUP, DwtEvent.ONSELECTSTART];
	if (AjxEnv.isIE) {
		mouseEvents.push(DwtEvent.ONMOUSEENTER, DwtEvent.ONMOUSELEAVE);
	} else {
		mouseEvents.push(DwtEvent.ONMOUSEOVER, DwtEvent.ONMOUSEOUT);
	}
	this._setEventHdlrs(mouseEvents);
};

/**
 * Populates a fake mouse event in preparation for the direct call of a listener (rather
 * than via an event handler).
 * 
 * @param mev		[DwtMouseEvent]		mouse event
 * @param params	[hash]				hash of event properties (see DwtUiEvent.copy)
 */
DwtControl.prototype._setMouseEvent =
function(mev, params) {
	mev.reset();
	params.ersatz = true;
	DwtUiEvent.copy(mev, params);
	mev.button = params.button;
};

/**
 * TODO
 */
DwtControl.prototype._getStopPropagationValForMouseEv =
function(ev) {
	// overload me for dealing w/ browsers w/ weird quirks
	return true;
};

/**
 * TODO
 */
DwtControl.prototype._getEventReturnValForMouseEv =
function(ev) {
	// overload me for dealing w/ browsers w/ weird quirks
	return false;
};


/**
 * Check the state of the control, if it is not disposed and is not initialized, then
 * as a side-effect it will initialize it (meaning it will create the HTML element
 * for the control and insert it into the DOM. This is pertinent for controls that
 * were created <i>deferred</i> (see the constructor documentation)
 *
 * @return true if the control is not disposed, else false
 * @type Boolean
 */
DwtControl.prototype._checkState =
function() {
	if (this._disposed) { return false; }
	if (!this.__ctrlInited) {
		this.__initCtrl();
	}
	return true;
};

/**
 * Positions this control at the given point. If no location is provided, centers it
 * within the shell.
 *
 * @param loc	[DwtPoint]*		point at which to position this control
 */
DwtControl.prototype._position =
function(loc) {
	this._checkState();
	var sizeShell = this.shell.getSize();
	var sizeThis = this.getSize();
	var x, y;
	if (!loc) {
		// if no location, go for the middle
		x = Math.round((sizeShell.x - sizeThis.x) / 2);
		y = Math.round((sizeShell.y - sizeThis.y) / 2);
	} else {
		x = loc.x;
		y = loc.y;
	}
	// try to stay within shell boundaries
	if ((x + sizeThis.x) > sizeShell.x) {
		x = sizeShell.x - sizeThis.x;
	}
	if ((y + sizeThis.y) > sizeShell.y) {
		y = sizeShell.y - sizeThis.y;
	}
	this.setLocation(x, y);
};

/**
 * Resets the scrollTop of container (if necessary) to ensure that element is visible.
 * 
 * @param element		[Element]		the element to be made visible
 * @param container		[Element]		the containing element to possibly scroll
 */
DwtControl._scrollIntoView =
function(element, container) {
	var elementTop = Dwt.toWindow(element, 0, 0, null, null, DwtPoint.tmp).y;
	var containerTop = Dwt.toWindow(container, 0, 0, null, null, DwtPoint.tmp).y + container.scrollTop;

	var diff = elementTop - containerTop;
	if (diff < 0) {
		container.scrollTop += diff;
	} else {
		var containerH = Dwt.getSize(container, DwtPoint.tmp).y;
		var elementH = Dwt.getSize(element, DwtPoint.tmp).y;
		diff = (elementTop + elementH) - (containerTop + containerH);
		if (diff > 0) {
			container.scrollTop += diff;
		}
	}
};

/**
 * Handles scrolling of a drop area for an object being dragged. The scrolling is based on proximity to
 * the top or bottom edge of the area (only vertical scrolling is done). The scrolling is done via a
 * looping timer, so that the scrolling is smooth and does not depend on additional mouse movement.
 *
 * @param params		[hash]			hash of params:
 *        container		[Element]		DOM element that may need to be scrolled
 *        threshold		[int]			if mouse is within this many pixels of top or bottom of container,
 * 										check if scrolling is needed
 *        amount		[int]			number of pixels to scroll at each interval
 *        interval		[int]			number of ms to wait before continuing to scroll
 *        id			[string]		ID for determing if we have moved out of container
 * @param ev
 */
DwtControl._dndScrollCallback =
function(params, ev) {

	var container = params.container;
	if (!container) { return; }

	// stop scrolling if mouse has moved out of the scrolling area, or dnd object has been released;
	// a bit tricky because this callback is run as the mouse moves among objects within the scroll area,
	// so we need to see if mouse has moved from within to outside of scroll area
	var dwtObjId = ev.dwtObj && ev.dwtObj._dndScrollId;
	if (ev.type == "mouseup" || !dwtObjId || (params.id && dwtObjId != params.id)) {
		if (container._dndScrollActionId != -1) {
			AjxTimedAction.cancelAction(container._dndScrollActionId);
			container._dndScrollActionId = -1;
		}
		return;
	}

	container._scrollAmt = 0;
	if (container.clientHeight < container.scrollHeight) {
		var containerTop = Dwt.toWindow(container, 0, 0, null, null, DwtPoint.tmp).y;
		var realTop = containerTop + container.scrollTop;
		var scroll = container.scrollTop;
		var diff = ev.docY - realTop; // do we need to scroll up?
		var scrollAmt = (diff <= params.threshold) ? -1 * params.amount : 0;
		if (scrollAmt == 0) {
			var containerH = Dwt.getSize(container, DwtPoint.tmp).y;
			var containerBottom = realTop + containerH;
			diff = containerBottom - ev.docY; // do we need to scroll down?
			scrollAmt = (diff <= params.threshold) ? params.amount : 0;
		}
		container._scrollAmt = scrollAmt;
		if (scrollAmt) {
			if (!container._dndScrollAction) {
				container._dndScrollAction = new AjxTimedAction(null, DwtControl._dndScroll, [params]);
				container._dndScrollActionId = -1;
			}
			// launch scrolling loop
			if (container._dndScrollActionId == -1) {
				container._dndScrollActionId = AjxTimedAction.scheduleAction(container._dndScrollAction, 0);
			}
		} else {
			// stop scrolling
			if (container._dndScrollActionId != -1) {
				AjxTimedAction.cancelAction(container._dndScrollActionId);
				container._dndScrollActionId = -1;
			}
		}
	}
};

DwtControl._dndScroll =
function(params) {
	var container = params.container;
	var containerTop = Dwt.toWindow(container, 0, 0, null, null, DwtPoint.tmp).y;
	var containerH = Dwt.getSize(container, DwtPoint.tmp).y;
	var scroll = container.scrollTop;
	// if we are to scroll, make sure there is more scrolling to be done
	if ((container._scrollAmt < 0 && scroll > 0) || (container._scrollAmt > 0 && (scroll + containerH < container.scrollHeight))) {
		container.scrollTop += container._scrollAmt;
		container._dndScrollActionId = AjxTimedAction.scheduleAction(container._dndScrollAction, params.interval);
	}
};

/**
 * @private
 */
DwtControl.__keyPressHdlr =
function(ev) {
	var obj = obj ? obj : DwtControl.getTargetControl(ev);
	if (!obj) return false;

	if (obj.__hasToolTipContent()) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
		manager.setHoverOutListener(obj._hoverOutListener);
		manager.hoverOut();
		obj.__tooltipClosed = false;
	}
};

/**
 * Returns true if the control has static tooltip content, or if it has overridden
 * getToolTipContent() to return dynamic content. Essentially, it means that this
 * control provides tooltips and will need to use the hover mgr.
 *
 * @private
 */
DwtControl.prototype.__hasToolTipContent =
function() {
	if (this._disposed) { return false; }

	return Boolean(this.__toolTipContent || (this.getToolTipContent != DwtControl.prototype.getToolTipContent));
};

/**
 * This "private" method is actually called by <i>DwtKeyboardMgr</i> to indicate
 * that the control is being blurred. Subclasses should override the <i>_blur</i>
 * method
 *
 * @private
 */
DwtControl.prototype.__doBlur =
function() {
	this._hasFocus = false;
	if (this.isListenerRegistered(DwtEvent.ONBLUR)) {
		var ev = DwtShell.focusEvent;
		ev.dwtObj = this;
		ev.state = DwtFocusEvent.BLUR;
		obj.notifyListeners(DwtEvent.ONBLUR, mouseEv);
	}
	this._blur();
};

/**
 * This "private" method is actually called by <i>DwtKeyboardMgr</i> to indicate
 * that the control is being focused. Subclasses should override the <i>_focus</i>
 * method
 *
 * @private
 */
DwtControl.prototype.__doFocus =
function() {
	this._hasFocus = true;
	if (this.isListenerRegistered(DwtEvent.ONFOCUS)) {
		var ev = DwtShell.focusEvent;
		ev.dwtObj = this;
		ev.state = DwtFocusEvent.FOCUS;
		obj.notifyListeners(DwtEvent.ONFOCUS, mouseEv);
	}
	this._focus();
};


/**
 * @private
 */
DwtControl.__dblClickHdlr =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	if (obj && obj._dblClickIsolation) {
		obj._clickPending = false;
		AjxTimedAction.cancelAction(obj._dblClickActionId);
	}
	return DwtControl.__mouseEvent(ev, DwtEvent.ONDBLCLICK);
};

/**
 * @private
 */
DwtControl.__mouseOverHdlr =
function(ev, evType) {
	// Check to see if a drag is occurring. If so, don't process the mouse
	// over events.
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	if (captureObj != null) {
		ev = DwtUiEvent.getEvent(ev);
		ev._stopPropagation = true;
		return false;
	}
	var obj = DwtControl.getTargetControl(ev);
	if (!obj) { return false; }
	evType = evType || DwtEvent.ONMOUSEOVER;
	if ((evType == DwtEvent.ONMOUSEOVER) && obj._ignoreInternalOverOut) {
		var otherObj = DwtControl.getTargetControl(ev, true);
		if (obj == otherObj) {
			return false;
		}
	}

	var mouseEv = DwtShell.mouseEvent;
	if (obj._dragging == DwtControl._NO_DRAG) {
		mouseEv.setFromDhtmlEvent(ev, obj);
		if (obj.isListenerRegistered(evType)) {
			obj.notifyListeners(evType, mouseEv);
		}
		// Call the tooltip after the listeners to give them a
		// chance to change the tooltip text.
		if (obj.__hasToolTipContent()) {
			var shell = DwtShell.getShell(window);
			var manager = shell.getHoverMgr();
			if ((!manager.isHovering() || manager.getHoverObject() != obj) && !DwtMenu.menuShowing()) {
				manager.reset();
				manager.setHoverObject(obj);
				manager.setHoverOverData(mouseEv);
				manager.setHoverOverDelay(DwtToolTip.TOOLTIP_DELAY);
				manager.setHoverOverListener(obj._hoverOverListener);
				manager.hoverOver(mouseEv.docX, mouseEv.docY);
			}
		}
	}
	mouseEv._stopPropagation = true;
	mouseEv._returnValue = false;
	mouseEv.setToDhtmlEvent(ev);
	return false;
};

/**
 * @private
 */
DwtControl.__mouseEnterHdlr =
function(ev) {
	return DwtControl.__mouseOverHdlr(ev, DwtEvent.ONMOUSEENTER);
};

/**
 * @private
 */
DwtControl.__mouseDownHdlr =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	if (!obj) { return false; }

	ev = DwtUiEvent.getEvent(ev);
	obj._focusByMouseDownEvent(ev);

	if (obj.__hasToolTipContent()) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
		manager.setHoverOutListener(obj._hoverOutListener);
		manager.hoverOut();
	}

	// If we have a dragSource, then we need to start capturing mouse events
	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, obj);
	if (obj._dragSource && (mouseEv.button == DwtMouseEvent.LEFT) && obj._isValidDragObject(mouseEv))	{
		try {
			obj._ctrlCaptureObj.capture();
		} catch (ex) {
			DBG.dumpObj(ex);
		}
		obj._dragOp = (mouseEv.ctrlKey) ? Dwt.DND_DROP_COPY : Dwt.DND_DROP_MOVE;
		obj.__dragStartX = mouseEv.docX;
		obj.__dragStartY = mouseEv.docY;
	}

	return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEDOWN, obj, mouseEv);
};

/**
 * @private
 */
DwtControl.__mouseMoveHdlr =
function(ev) {
	// If captureObj == null, then we are not a Draggable control or a
	// mousedown event has not occurred , so do the default behaviour,
	// else do the draggable behaviour
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	var obj = captureObj ? captureObj.targetObj : DwtControl.getTargetControl(ev);
 	if (!obj) { return false; }

	//DND cancel point
	if (obj.__dndHoverActionId != -1) {
		AjxTimedAction.cancelAction(obj.__dndHoverActionId);
		obj.__dndHoverActionId = -1;
	}

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, captureObj ? true : obj);

	// This following can happen during a DnD operation if the mouse moves
	// out the window. This seems to happen on IE only.
	if (mouseEv.docX < 0 || mouseEv.docY < 0) {
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;
	}

	// If we are not draggable or if we have not started dragging and are
	// within the Drag threshold then simply handle it as a move.
	if (obj._dragSource == null || captureObj == null
		|| (obj != null && obj._dragging == DwtControl._NO_DRAG
			&& Math.abs(obj.__dragStartX - mouseEv.docX) <
			   DwtControl.__DRAG_THRESHOLD
			&& Math.abs(obj.__dragStartY - mouseEv.docY) <
			   DwtControl.__DRAG_THRESHOLD)) {
		if (obj.__hasToolTipContent()) {
			var shell = DwtShell.getShell(window);
			var manager = shell.getHoverMgr();
			if (!manager.isHovering() && !obj.__tooltipClosed && !DwtMenu.menuShowing()) {
				// NOTE: mouseOver already init'd other hover settings
				// We do hoverOver() here since the mouse may have moved during
				// the delay, and we want to use latest x,y
				manager.hoverOver(mouseEv.docX, mouseEv.docY);
			} else {
				var deltaX = obj.__lastTooltipX ? Math.abs(mouseEv.docX - obj.__lastTooltipX) : null;
				var deltaY = obj.__lastTooltipY ? Math.abs(mouseEv.docY - obj.__lastTooltipY) : null;
				if ((deltaX != null && deltaX > DwtControl.__TOOLTIP_THRESHOLD) ||
					(deltaY != null && deltaY > DwtControl.__TOOLTIP_THRESHOLD)) {
					manager.setHoverOutListener(obj._hoverOutListener);
					manager.hoverOut();
					obj.__tooltipClosed = true; // prevent tooltip popup during moves in this object
				}
			}
		}
		return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEMOVE, obj, mouseEv);
	} else {
		// Deal with mouse moving out of the window etc...

		// If we are not dragging, then see if we can drag.
		// If we cannot drag this control, then
		// we will set dragging status to DwtControl._DRAG_REJECTED
		if (obj._dragging == DwtControl._NO_DRAG) {
			obj._dragOp = obj._dragSource._beginDrag(obj._dragOp, obj);
			if (obj._dragOp != Dwt.DND_DROP_NONE) {
				obj._dragging = DwtControl._DRAGGING;
				obj._dndProxy = obj._getDragProxy(obj._dragOp);
				Dwt.addClass(obj._dndProxy, "DwtDragProxy");
				if (obj._dndProxy == null)
					obj._dragging = DwtControl._DRAG_REJECTED;
			} else {
				obj._dragging = DwtControl._DRAG_REJECTED;
			}
		}

		// If we are draggable, then see if the control under the mouse
		// (if one exists) will allow us to be dropped on it.
		// This is done by (a) making sure that the drag source data type
		// can be dropped onto the target, and (b) that the application
		// will allow it (i.e. via the listeners on the DropTarget
		if (obj._dragging != DwtControl._DRAG_REJECTED) {
			var destDwtObj = mouseEv.dwtObj;
			if (destDwtObj) {
				// Set up the drag hover event. we will even let this item hover over itself as there may be
				// scenarios where that will hold true
				obj._dndHoverAction.args = [ destDwtObj ];
				obj.__dndHoverActionId = AjxTimedAction.scheduleAction(obj._dndHoverAction, DwtControl.__DND_HOVER_DELAY);
			}

			if (destDwtObj && destDwtObj._dropTarget && destDwtObj != obj) {
				if (destDwtObj != obj.__lastDestDwtObj ||
				    destDwtObj._dropTarget.hasMultipleTargets()) {
					if (destDwtObj._dropTarget._dragEnter(obj._dragOp, destDwtObj,
									      obj._dragSource._getData(),
									      mouseEv, obj._dndProxy))
					{
						obj._setDragProxyState(true);
						obj.__dropAllowed = true;
						destDwtObj._dragEnter(mouseEv);
					} else {
						obj._setDragProxyState(false);
						obj.__dropAllowed = false;
					}
				} else if (obj.__dropAllowed) {
					destDwtObj._dragOver(mouseEv);
				}
			} else {
				obj._setDragProxyState(false);
			}

			if (obj.__lastDestDwtObj && obj.__lastDestDwtObj != destDwtObj
				&& obj.__lastDestDwtObj._dropTarget
				&& obj.__lastDestDwtObj != obj) {

				// check if obj dragged out of scrollable container
				if (destDwtObj && !destDwtObj._dndScrollCallback && obj.__lastDestDwtObj._dndScrollCallback) {
					obj.__lastDestDwtObj._dndScrollCallback.run(mouseEv);
				}

				obj.__lastDestDwtObj._dragLeave(mouseEv);
				obj.__lastDestDwtObj._dropTarget._dragLeave();
			}

			obj.__lastDestDwtObj = destDwtObj;

			if ((destDwtObj != obj) && destDwtObj && destDwtObj._dndScrollCallback) {
				destDwtObj._dndScrollCallback.run(mouseEv);
			}

			Dwt.setLocation(obj._dndProxy, mouseEv.docX + 2, mouseEv.docY + 2);
			// TODO set up timed event to fire off another mouseover event.
			// Also need to cancel
			// any pending event, though we should do the cancel earlier
			// in the code
		} else {
			// XXX: confirm w/ ROSS!
			DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEMOVE, obj, mouseEv);
		}
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
		mouseEv.setToDhtmlEvent(ev);
		return false;
	}
};

/**
 * @private
 */
DwtControl.__mouseUpHdlr =
function(ev) {
	// See if are doing a drag n drop operation
	var captureObj = (DwtMouseEventCapture.getId() == "DwtControl") ? DwtMouseEventCapture.getCaptureObj() : null;
	var obj = captureObj ? captureObj.targetObj : DwtControl.getTargetControl(ev);
	if (!obj) { return false; }

	//DND
	if (obj.__dndHoverActionId != -1) {
		AjxTimedAction.cancelAction(obj.__dndHoverActionId);
		obj.__dndHoverActionId = -1;
	}

	var mouseEv = DwtShell.mouseEvent;
	mouseEv.setFromDhtmlEvent(ev, captureObj ? true : obj);
	if (!obj._dragSource || !captureObj) {
		//obj._focusByMouseUpEvent(ev);
		return DwtControl.__processMouseUpEvent(ev, obj, mouseEv);

	} else {
		captureObj.release();
		if (obj._dragging != DwtControl._DRAGGING) {
			obj._dragging = DwtControl._NO_DRAG;
			//obj._focusByMouseUpEvent(ev);
			return DwtControl.__processMouseUpEvent(ev, obj, mouseEv);
		} else {
			obj.__lastDestDwtObj = null;
			var destDwtObj = mouseEv.dwtObj;
			if (destDwtObj != null && destDwtObj._dropTarget != null &&
				obj.__dropAllowed && destDwtObj != obj) {
				destDwtObj._drop(mouseEv);
				destDwtObj._dropTarget._drop(obj._dragSource._getData(), mouseEv);
				obj._dragSource._endDrag();
				obj._destroyDragProxy(obj._dndProxy);
				obj._dragging = DwtControl._NO_DRAG;
			} else {
				DwtControl.__badDrop(obj, mouseEv);
			}
			if (destDwtObj._dndScrollCallback) {
				destDwtObj._dndScrollCallback.run(mouseEv);
			}
			mouseEv._stopPropagation = true;
			mouseEv._returnValue = false;
			mouseEv.setToDhtmlEvent(ev);
			return false;
		}
	}
};

/**
 * Handles a bad DND drop operation by showing an animation of the icon flying
 * back to its origin.
 * 
 * @param obj		[DwtControl]	control that underlies drag operation
 * @param mouseEv	[DwtMouseEvent]	mouse event
 */
DwtControl.__badDrop =
function(obj, mouseEv) {
	obj._dragSource._cancelDrag();
	// The following code sets up the drop effect for when an
	// item is dropped onto an invalid target. Basically the
	// drag icon will spring back to its starting location.
	obj.__dragEndX = mouseEv.docX;
	obj.__dragEndY = mouseEv.docY;
	if (obj.__badDropAction == null) {
		obj.__badDropAction = new AjxTimedAction(obj, obj.__badDropEffect);
	}

	// Line equation is y = mx + c. Solve for c, and set up d (direction)
	var m = (obj.__dragEndY - obj.__dragStartY) / (obj.__dragEndX - obj.__dragStartX);
	obj.__badDropAction.args = [m, obj.__dragStartY - (m * obj.__dragStartX), (obj.__dragStartX - obj.__dragEndX < 0) ? -1 : 1];
	AjxTimedAction.scheduleAction(obj.__badDropAction, 0);
};

/**
 * Handle double clicks in isolation, if requested (if not, events are handled
 * normally). On the first click, we set a 'click pending' flag and start a timer.
 * If the timer expires before another click arrives, we process the single click.
 * If a double-click event arrives before the timer expires, then we process the
 * double-click event.
 */
DwtControl.__processMouseUpEvent =
function(ev, obj, mouseEv) {
	if (obj._dblClickIsolation && mouseEv && (mouseEv.button == DwtMouseEvent.LEFT)) {
		if (obj._clickPending) {
			// wait for real dblclick event
			return false;
		} else {
			obj._clickPending = true;
			var ta = new AjxTimedAction(null, DwtControl.__timedClick, [ev, obj, mouseEv]);
			obj._dblClickActionId = AjxTimedAction.scheduleAction(ta, DwtControl.__DBL_CLICK_TIMEOUT);
			DwtUiEvent.setBehaviour(ev, true, false);
			obj._st = new Date();
			return false;
		}
	} else {
		obj._clickPending = false;
		return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEUP, obj, mouseEv);
	}
};

DwtControl.__timedClick =
function(ev, obj, mouseEv) {
	obj._clickPending = false;
	DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEUP, obj, mouseEv);
};

/**
 * @private
 */
DwtControl.__mouseOutHdlr =
function(ev, evType) {
	var obj = DwtControl.getTargetControl(ev);
	if (!obj) { return false; }
	evType = evType || DwtEvent.ONMOUSEOUT;
	if ((evType == DwtEvent.ONMOUSEOUT) && obj._ignoreInternalOverOut) {
		var otherObj = DwtControl.getTargetControl(ev, true);
		if (obj == otherObj) {
			return false;
		}
	}

	if (obj.__hasToolTipContent()) {
		var shell = DwtShell.getShell(window);
		var manager = shell.getHoverMgr();
			manager.setHoverOutListener(obj._hoverOutListener);
			manager.hoverOut();
			obj.__tooltipClosed = false;
	}
	return DwtControl.__mouseEvent(ev, evType || DwtEvent.ONMOUSEOUT, obj);
};

/**
 * @private
 */
DwtControl.__mouseLeaveHdlr =
function(ev) {
	return DwtControl.__mouseOutHdlr(ev, DwtEvent.ONMOUSELEAVE);
};

/**
 * @private
 */
DwtControl.__mouseWheelHdlr =
function(ev) {
	var obj = DwtControl.getTargetControl(ev);
	if (!obj) return false;
	return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEWHEEL, obj);
};

/**
 * @private
 */
DwtControl.__selectStartHdlr =
function(ev) {
	return DwtControl.__mouseEvent(ev, DwtEvent.ONSELECTSTART);
};

/**
 * @private
 */
DwtControl.__contextMenuHdlr =
function(ev) {
	// for Safari, we have to fake a right click
	if (AjxEnv.isSafari) {
		var obj = DwtControl.getTargetControl(ev);
		var prevent = obj ? obj.preventContextMenu() : true;
		if (prevent) {
			DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEDOWN);
			return DwtControl.__mouseEvent(ev, DwtEvent.ONMOUSEUP);
		}
	}
	return DwtControl.__mouseEvent(ev, DwtEvent.ONCONTEXTMENU);
};

/**
 * @private
 */
DwtControl.__mouseEvent =
function(ev, eventType, obj, mouseEv) {
	var obj = obj ? obj : DwtControl.getTargetControl(ev);
	if (!obj) { return false; }

	if (!mouseEv) {
		mouseEv = DwtShell.mouseEvent;
		mouseEv.setFromDhtmlEvent(ev, obj);
	}

	// By default, we halt event processing. Listeners may override
	var tn = mouseEv.target.tagName.toLowerCase();
	if (tn != "input" && tn != "textarea" && tn != "a") {
		mouseEv._stopPropagation = true;
		mouseEv._returnValue = false;
	} else {
		mouseEv._stopPropagation = false;
		mouseEv._returnValue = true;
	}

	// notify global listeners
	DwtEventManager.notifyListeners(eventType, mouseEv);

	// notify widget listeners
	if (obj.isListenerRegistered && obj.isListenerRegistered(eventType)) {
		obj.notifyListeners(eventType, mouseEv);
	}

	// publish our settings to the DOM
	mouseEv.setToDhtmlEvent(ev);
	return mouseEv._returnValue;
};

// need to populate this hash after methods are defined
/** @private */
DwtControl.__HANDLER = {};
DwtControl.__HANDLER[DwtEvent.ONCONTEXTMENU] = DwtControl.__contextMenuHdlr;
DwtControl.__HANDLER[DwtEvent.ONDBLCLICK] = DwtControl.__dblClickHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEDOWN] = DwtControl.__mouseDownHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEENTER] = DwtControl.__mouseEnterHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSELEAVE] = DwtControl.__mouseLeaveHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEMOVE] = DwtControl.__mouseMoveHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEOUT] = DwtControl.__mouseOutHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEOVER] = DwtControl.__mouseOverHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEUP] = DwtControl.__mouseUpHdlr;
DwtControl.__HANDLER[DwtEvent.ONMOUSEWHEEL] = DwtControl.__mouseWheelHdlr;
DwtControl.__HANDLER[DwtEvent.ONSELECTSTART] = DwtControl.__selectStartHdlr;
DwtControl.__HANDLER[DwtEvent.ONKEYPRESS] = DwtControl.__keyPressHdlr;

/**
 * @private
 */
DwtControl.prototype.__initCtrl =
function() {
	this.shell = this.parent.shell || this.parent;
	var htmlElement = this._elRef = document.createElement("div");
	// __internalId is for back-compatibility (was side effect of Dwt.associateElementWithObject)
	this._htmlElId = htmlElement.id = this.__internalId = this._htmlElId || Dwt.getNextId();
	if (DwtControl.ALL_BY_ID) {
		if (DwtControl.ALL_BY_ID[this._htmlElId]) {
			DBG.println(AjxDebug.DBG1, "Duplicate ID for " + this.toString() + ": " + this._htmlElId);
			this._htmlElId = htmlElement.id = this.__internalId = DwtId._makeId(this._htmlElId, Dwt.getNextId());
		}
		DwtControl.ALL_BY_ID[this._htmlElId] = this;
	}
	DwtComposite._pendingElements[this._htmlElId] = htmlElement;
	if (this.__posStyle == null || this.__posStyle == DwtControl.STATIC_STYLE) {
        htmlElement.style.position = DwtControl.STATIC_STYLE;
	} else {
        htmlElement.style.position = this.__posStyle;
	}
	htmlElement.className = this._className;
	htmlElement.style.overflow = "visible";
	this._enabled = true;
	this.__controlEvent = DwtControl.__controlEvent;
	this._dragging = DwtControl._NO_DRAG;
	this.__ctrlInited = true;

	// Make sure this is the last thing we do
	this.parent.addChild(this, this.__index);
};

/**
 * @private
 */
DwtControl.prototype.__dndDoHover =
function(control) {
	//TODO Add allow hover?
	control._dragHover();
};

/**
 * This method is called when a drop happens on an invalid target. The code will
 * animate the Drag icon back to its source before destroying it via <code>_destroyDragProxy</code>
 * @private
 */
DwtControl.prototype.__badDropEffect =
function(m, c, d) {
	var usingX = (Math.abs(m) <= 1);
	// Use the bigger delta to control the snap effect
	var delta = usingX ? this.__dragStartX - this.__dragEndX : this.__dragStartY - this.__dragEndY;
    if (delta * d > 0 && !(this.__dragEndY == this.__dragStartY || this.__dragEndX == this.__dragStartX) ) {
		if (usingX) {
			this.__dragEndX += (30 * d);
			this._dndProxy.style.top = m * this.__dragEndX + c;
			this._dndProxy.style.left = this.__dragEndX;
		} else {
			this.__dragEndY += (30 * d);
			this._dndProxy.style.top = this.__dragEndY;
			this._dndProxy.style.left = (this.__dragEndY - c) / m;
		}
		AjxTimedAction.scheduleAction(this.__badDropAction, 0);
 	} else {
  		this._destroyDragProxy(this._dndProxy);
		this._dragging = DwtControl._NO_DRAG;
  	}
};

/**
 * Attempts to display a tooltip for this control, triggered by the cursor having been
 * over the control for a period of time. The tooltip may have already been set (if it's
 * a static tooltip). For dynamic tooltip content, the control implements getToolTipContent()
 * to return the content or a callback. It should return a callback if it makes an
 * async server call to get data.
 *
 * @private
 */
DwtControl.prototype.__handleHoverOver =
function(event) {

	if (this._eventMgr.isListenerRegistered(DwtEvent.HOVEROVER)) {
		this._eventMgr.notifyListeners(DwtEvent.HOVEROVER, event);
	}

	var mouseEv = event && event.object;
	var tooltip = this.getToolTipContent(mouseEv);
	var content, callback;
	if (!tooltip) {
		content = "";
	} else if (typeof(tooltip) == "string") {
		content = tooltip;
	} else if (tooltip instanceof AjxCallback) {
		callback = tooltip;
	} else if (typeof(tooltip) == "object") {
		content = tooltip.content;
		callback = tooltip.callback;
	}

	if (!content && callback && tooltip.loading) {
		content = AjxMsg.loading;
	}

	if (content) {
		this.__showToolTip(event, content);
	}

	if (callback) {
		var callback1 = new AjxCallback(this, this.__showToolTip, [event]);
		AjxTimedAction.scheduleAction(new AjxTimedAction(null, function() { callback.run(callback1); }), 0);
	}
};

DwtControl.prototype.__showToolTip =
function(event, content) {

	if (!content) { return; }
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.setContent(content);
	tooltip.popup(event.x, event.y);
	this.__lastTooltipX = event.x;
	this.__lastTooltipY = event.y;
	this.__tooltipClosed = false;
};

/**
 * @private
 */
DwtControl.prototype.__handleHoverOut =
function(event) {
	if (this._eventMgr.isListenerRegistered(DwtEvent.HOVEROUT)) {
		this._eventMgr.notifyListeners(DwtEvent.HOVEROUT, event);
	}
	var shell = DwtShell.getShell(window);
	var tooltip = shell.getToolTip();
	tooltip.popdown();
	this.__lastTooltipX = null;
	this.__lastTooltipY = null;
};

/**@private*/
DwtControl.prototype.__isInputEl =
function(targetEl) {
	var bIsInput = false;
	if(!targetEl || !targetEl.tagName) {
		return bIsInput;
	}
	var tagName = targetEl.tagName.toLowerCase();
	var type = tagName == "input" ? targetEl.type.toLowerCase() : null;

	if (tagName == "textarea" || (type && (type == "text" || type == "password")))
		bIsInput = true;

	return bIsInput;
};


// onunload hacking
DwtControl.ON_UNLOAD =
function() {
	// break widget-element references
	var h = DwtControl.ALL_BY_ID, i;
	for (i in h) {
		h[i]._elRef = null;
	}
	DwtControl.ALL_BY_ID = null;
};

if (AjxEnv.isIE) {
	window.attachEvent("onunload", DwtControl.ON_UNLOAD);
} else {
	window.addEventListener("unload", DwtControl.ON_UNLOAD, false);
}
