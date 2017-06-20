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
 * AjxUtil - static class with some utility methods. This is where to
 * put things when no other class wants them.
 *
 * 12/3/2004 At this point, it only needs AjxEnv to be loaded.
 * 
 * @private
 */
AjxUtil = function() {
};

AjxUtil.FLOAT_RE = /^[+\-]?((\d+(\.\d*)?)|((\d*\.)?\d+))([eE][+\-]?\d+)?$/;
AjxUtil.NOTFLOAT_RE = /[^\d\.]/;
AjxUtil.NOTINT_RE = /[^0-9]+/;
AjxUtil.LIFETIME_FIELD = /^([0-9])+([dhms]|ms)?$/;
AjxUtil.INT_RE = /^\-?(0|[1-9]\d*)$/;

AjxUtil.isSpecified 		= function(aThing) { return ((aThing !== void 0) && (aThing !== null)); };
AjxUtil.isUndefined 		= function(aThing) { return (aThing === void 0); };
AjxUtil.isNull 				= function(aThing) { return (aThing === null); };
AjxUtil.isBoolean 			= function(aThing) { return (typeof(aThing) === 'boolean'); };
AjxUtil.isString 			= function(aThing) { return (typeof(aThing) === 'string'); };
AjxUtil.isNumber 			= function(aThing) { return (typeof(aThing) === 'number'); };
AjxUtil.isObject 			= function(aThing) { return ((typeof(aThing) === 'object') && (aThing !== null)); };
AjxUtil.isArray 			= function(aThing) { return AjxUtil.isInstance(aThing, Array); };
AjxUtil.isArrayLike			= function(aThing) { return typeof aThing !== 'string' && typeof aThing.length === 'number'; };
AjxUtil.isFunction 			= function(aThing) { return (typeof(aThing) === 'function'); };
AjxUtil.isDate 				= function(aThing) { return AjxUtil.isInstance(aThing, Date); };
AjxUtil.isLifeTime 			= function(aThing) { return AjxUtil.LIFETIME_FIELD.test(aThing); };
AjxUtil.isNumeric 			= function(aThing) { return (!isNaN(parseFloat(aThing)) && AjxUtil.FLOAT_RE.test(aThing) && !AjxUtil.NOTFLOAT_RE.test(aThing)); };
AjxUtil.isInt				= function(aThing) { return AjxUtil.INT_RE.test(aThing); };
AjxUtil.isPositiveInt		= function(aThing) { return AjxUtil.isInt(aThing) && parseInt(aThing, 10) > 0; }; //note - assume 0 is not positive
AjxUtil.isLong = AjxUtil.isInt;
AjxUtil.isNonNegativeLong	= function(aThing) { return AjxUtil.isLong(aThing) && parseInt(aThing, 10) >= 0; };
AjxUtil.isEmpty				= function(aThing) { return ( AjxUtil.isNull(aThing) || AjxUtil.isUndefined(aThing) || (aThing === "") || (AjxUtil.isArray(aThing) && (aThing.length==0))); };
// REVISIT: Should do more precise checking. However, there are names in
//			common use that do not follow the RFC patterns (e.g. domain
//			names that start with digits).
AjxUtil.IPv4_ADDRESS_RE = /^\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?$/;
AjxUtil.IPv4_ADDRESS_WITH_PORT_RE = /^\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?:\d{1,5}$/;
AjxUtil.IPv6_ADDRESS_RE = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|(?:%[-\w.~]+)?$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})(?:%[-\w.~]+)?$/i;
AjxUtil.IPv6_ADDRESS_WITH_PORT_RE = new RegExp(AjxUtil.IPv6_ADDRESS_RE.source.replace('^', '^\\[').replace('$', '\\]:\\d{1,5}$'), 'i');
AjxUtil.SUBNET_RE = /^\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?\/\d{1,2}$/;
AjxUtil.DOMAIN_NAME_SHORT_RE = /^[A-Za-z0-9\-]{2,}$/;
AjxUtil.DOMAIN_NAME_FULL_RE = /^[A-Za-z0-9\-]{1,}(\.[A-Za-z0-9\-]{2,}){1,}$/;
AjxUtil.HOST_NAME_RE = /^[A-Za-z0-9\-]{2,}(\.[A-Za-z0-9\-]{1,})*(\.[A-Za-z0-9\-]{2,})*$/;
AjxUtil.HOST_NAME_WITH_PORT_RE = /^[A-Za-z0-9\-]{2,}(\.[A-Za-z0-9\-]{2,})*:([0-9])+$/;
AjxUtil.EMAIL_SHORT_RE = /^[^@\s]+$/;
AjxUtil.EMAIL_FULL_RE = /^[^@\s]+@[A-Za-z0-9\-]{2,}(\.[A-Za-z0-9\-]{2,})+$/;
AjxUtil.FULL_URL_RE = /^[A-Za-z0-9]{2,}:\/\/[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*(:([0-9])+)?(\/[\w\.\|\^\*\[\]\{\}\(\)\-<>~,'#_;@:!%]+)*(\/)?(\?[\w\.\|\^\*\+\[\]\{\}\(\)\-<>~,'#_;@:!%&=]*)?$/;
AjxUtil.IP_FULL_URL_RE = /^[A-Za-z0-9]{2,}:\/\/\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?(:([0-9])+)?(\/[\w\.\|\^\*\[\]\{\}\(\)\-<>~,'#_;@:!%]+)*(\/)?(\?[\w\.\|\^\*\+\[\]\{\}\(\)\-<>~,'#_;@:!%&=]*)?$/;
AjxUtil.SHORT_URL_RE = /^[A-Za-z0-9]{2,}:\/\/[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*(:([0-9])+)?$/;
AjxUtil.IP_SHORT_URL_RE = /^[A-Za-z0-9]{2,}:\/\/\d{1,3}(\.\d{1,3}){3}(\.\d{1,3}\.\d{1,3})?(:([0-9])+)?$/;

AjxUtil.isHostName 			= function(s) { return AjxUtil.HOST_NAME_RE.test(s); };
AjxUtil.isDomainName = 
function(s, shortMatch) {
	return shortMatch 
		? AjxUtil.DOMAIN_NAME_SHORT_RE.test(s) 
		: AjxUtil.DOMAIN_NAME_FULL_RE.test(s);
};

AjxUtil.isEmailAddress = 
function(s, nameOnly) {
	return nameOnly 
		? AjxUtil.EMAIL_SHORT_RE.test(s) 
		: AjxUtil.EMAIL_FULL_RE.test(s);
};

AjxUtil.isValidEmailNonReg = 
function(s) {
	return ((s.indexOf ("@") > 0) && (s.lastIndexOf ("@") == s.indexOf ("@")) && (s.indexOf (".@") < 0));
};

/**
 * Return true if the given object is a plain hash.
 *
 * @param aThing	The object for testing.
 */
AjxUtil.isHash =
function(aThing) {
	// Note: can't just look at prototype since that fails cross-window.
	// See http://stackoverflow.com/questions/10741618/how-to-check-if-argument-is-an-object-and-not-an-array, esp the part with isPlainObject()
	var str = aThing && aThing.toString ? aThing.toString() : Object.prototype.toString.call(aThing);
	return AjxUtil.isObject(aThing) && str === '[object Object]';
};

AjxUtil.SIZE_GIGABYTES = "GB";
AjxUtil.SIZE_MEGABYTES = "MB";
AjxUtil.SIZE_KILOBYTES = "KB";
AjxUtil.SIZE_BYTES = "B";

/**
 * Formats a size (in bytes) to the largest whole unit. For example,
 * AjxUtil.formatSize(302132199) returns "288 MB".
 *
 * @param size      The size (in bytes) to be formatted.
 * @param round     True to round to nearest integer. Default is true.
 * @param fractions Number of fractional digits to display, if not rounding.
 *                  Trailing zeros after the decimal point are trimmed.
 */
AjxUtil.formatSize = 
function(size, round, fractions) {
	if (round == null) round = true;
	if (fractions == null) fractions = 20; // max allowed for toFixed is 20

	var formattedUnits = AjxMsg.sizeBytes;
	var units = AjxMsg.SIZE_BYTES;
	if (size >= 1073741824) {
		formattedUnits = AjxMsg.sizeGigaBytes;
		units = AjxUtil.SIZE_GIGABYTES;
	}
	else if (size >= 1048576) {
		formattedUnits = AjxMsg.sizeMegaBytes;
		units = AjxUtil.SIZE_MEGABYTES;
	}
	else if (size > 1023) {
		formattedUnits = AjxMsg.sizeKiloBytes;
		units = AjxUtil.SIZE_KILOBYTES;
	}


	var formattedSize = AjxUtil.formatSizeForUnits(size, units, round, fractions);
	return AjxMessageFormat.format(AjxMsg.formatSizeAndUnits, [formattedSize, formattedUnits]);
};

/**
 * Formats a size (in bytes) to a specific unit. Since the unit size is
 * known, the unit is not shown in the returned string. For example,
 * AjxUtil.formatSizeForUnit(302132199, AjxUtil.SIZE_MEGABYTES, false, 2) 
 * returns "288.13".
 *
 * @param size      The size (in bytes) to be formatted.
 * @param units     The unit of measure.
 * @param round     True to round to nearest integer. Default is true.
 * @param fractions Number of fractional digits to display, if not rounding.
 *                  Trailing zeros after the decimal point are trimmed.
 */
AjxUtil.formatSizeForUnits = 
function(size, units, round, fractions) {
	if (units == null) units = AjxUtil.SIZE_BYTES;
	if (round == null) round = true;
	if (fractions == null) fractions = 20; // max allowed for toFixed is 20

	switch (units) {
		case AjxUtil.SIZE_GIGABYTES: { size /= 1073741824; break; }
		case AjxUtil.SIZE_MEGABYTES: { size /= 1048576; break; }
		case AjxUtil.SIZE_KILOBYTES: { size /= 1024; break; }
	}
	var dot = I18nMsg.numberSeparatorDecimal !='' ? I18nMsg.numberSeparatorDecimal : '.';
	var pattern = I18nMsg.formatNumber.replace(/\..*$/, ""); // Strip off decimal, we'll be adding one anyway
	pattern = pattern.replace(/,/, "");       // Remove the ,
	if (!round && fractions) {
		pattern = pattern += dot;
		for (var i = 0; i < fractions; i++) {
			pattern += "#";
		}
	}
	return AjxNumberFormat.format(pattern, size);
};

/**
 * Performs the opposite of AjxUtil.formatSize in that this function takes a 
 * formatted size.
 *
 * @param units Unit constant: "GB", "MB", "KB", "B". Must be specified 
 *              unless the formatted size ends with the size marker, in
 *				which case the size marker in the formattedSize param
 *				overrides this parameter.
 */
AjxUtil.parseSize = 
function(formattedSize, units) {
	// NOTE: Take advantage of fact that parseFloat ignores bad chars
	//       after numbers
	if (typeof formattedSize != _STRING_) {
		formattedSize = formattedSize.toString() ;
	}
	var size = parseFloat(formattedSize.replace(/^\s*/,""));

	var marker = /[GMK]?B$/i;
	var result = marker.exec(formattedSize);
	if (result) {
		//alert("units: "+units+", result[0]: '"+result[0]+"'");
		units = result[0].toUpperCase();
	}
	
	switch (units) {
		case AjxUtil.SIZE_GIGABYTES: size *= 1073741824; break;
		case AjxUtil.SIZE_MEGABYTES: size *= 1048576; break; 
		case AjxUtil.SIZE_KILOBYTES: size *= 1024; break;
	}
	
	//alert("AjxUtil#parseSize: formattedSize="+formattedSize+", size="+size);
	return size;
};

AjxUtil.isInstance = 
function(aThing, aClass) { 
	return !!(aThing && aThing.constructor && (aThing.constructor === aClass)); 
};

AjxUtil.assert = 
function(aCondition, aMessage) {
	if (!aCondition && AjxUtil.onassert) AjxUtil.onassert(aMessage);
};

AjxUtil.onassert = 
function(aMessage) {
	// Create an exception object and set the message
	var myException = new Object();
	myException.message = aMessage;
	
	// Compile a stack trace
	var myStack = new Array();
	if (AjxEnv.isIE) {
		// On IE, the caller chain is on the arguments stack
		var myTrace = arguments.callee.caller;
		var i = 0; // stop at 20 since there might be somehow an infinite loop here. Maybe in case of a recursion. 
		while (myTrace && i++ < 20) {
		    myStack[myStack.length] = myTrace;
	    	myTrace = myTrace.caller;
		}
	} else {
		try {
			var myTrace = arguments.callee.caller;
			while (myTrace) {
				myStack[myStack.length] = myTrace;
				if (myStack.length > 2) break;
				myTrace = myTrace.caller;
		    }
		} catch (e) {
		}
	}
	myException.stack = myStack;
	
	// Alert with the message and a description of the stack
	var stackString = '';
	var MAX_LEN = 170;
	for (var i = 1; i < myStack.length; i++) {
		if (i > 1) stackString += '\n';
		if (i < 11) {
			var fs = myStack[i].toString();
			if (fs.length > MAX_LEN) {
				fs = fs.substr(0,MAX_LEN) + '...';
				fs = fs.replace(/\n/g, '');
			}
			stackString += i + ': ' + fs;
		} else {
			stackString += '(' + (myStack.length - 11) + ' frames follow)';
			break;
		}
	}
	alert('assertion:\n\n' + aMessage + '\n\n---- Call Stack ---\n' + stackString);
	
	// Now throw the exception
	throw myException;
};

// IE doesn't define Node type constants
AjxUtil.ELEMENT_NODE		= 1;
AjxUtil.TEXT_NODE			= 3;
AjxUtil.DOCUMENT_NODE		= 9;

AjxUtil.getInnerText = 
function(node) {
 	if (AjxEnv.isIE)
 		return node.innerText;

	function f(n) {
		if (n) {
			if (n.nodeType == 3 /* TEXT_NODE */)
				return n.data;
			if (n.nodeType == 1 /* ELEMENT_NODE */) {
				if (/^br$/i.test(n.tagName))
					return "\r\n";
				var str = "";
				for (var i = n.firstChild; i; i = i.nextSibling)
					str += f(i);
				return str;
			}
		}
		return "";
	};
	return f(node);
};

/**
 * This method returns a proxy for the specified object. This is useful when
 * you want to modify properties of an object and want to keep those values
 * separate from the values in the original object. You can then iterate
 * over the proxy's properties and use the <code>hasOwnProperty</code>
 * method to determine if the property is a new value in the proxy.
 * <p>
 * <strong>Note:</strong>
 * A reference to the original object is stored in the proxy as the "_object_" 
 * property.
 *
 * @param object [object] The object to proxy.
 * @param level  [number] The number of property levels deep to proxy.
 *						  Defaults to zero.
 */
AjxUtil.createProxy = 
function(object, level) {
	var proxy;
	var proxyCtor = function(){}; // bug #6517 (Safari doesnt like 'new Function')
	proxyCtor.prototype = object;
	if (object instanceof Array) {
		proxy  = new Array();
		var cnt  = object.length;
		for(var ix = 0; ix < cnt; ix++) {
			proxy[ix] = object[ix];
		}
	} else {
		proxy = new proxyCtor;
	}
	
	if (level) {
		for (var prop in object) {
			if (typeof object[prop] == "object" && object[prop] !== null)
				proxy[prop] = AjxUtil.createProxy(object[prop], level - 1);
		}
	}	
	
	proxy._object_ = object;
	return proxy;
};

AjxUtil.unProxy =
function(proxy) {
	var object = proxy && proxy._object_;
	if (object) {
		for (var prop in proxy) {
			if (proxy.hasOwnProperty(prop) && prop!="_object_") {
				object[prop] = proxy[prop];
			}
		}
		return object;
	}
	return null;
}

/**
* Returns a copy of a list with empty members removed.
*
* @param list	[array]		original list
*/
AjxUtil.collapseList =
function(list) {
	var newList = [];
	for (var i = 0; i < list.length; i++) {
		if (list[i]) {
			newList.push(list[i]);
		}
	}
	return newList;
};

AjxUtil.arrayAsHash =
function(array, valueOrFunc) {
	array = AjxUtil.toArray(array);
	var hash = {};
	var func = typeof valueOrFunc == "function" && valueOrFunc;
	var value = valueOrFunc || true; 
	for (var i = 0; i < array.length; i++) {
		var key = array[i];
		hash[key] = func ? func(key, hash, i, array) : value;
	}
	return hash;
};

AjxUtil.arrayAdd = function(array, member, index) {

    array = array || [];

	if (index == null || index < 0 || index >= array.length) {
		// index absent or is out of bounds - append object to the end
		array.push(member);
	} else {
		// otherwise, insert object
		array.splice(index, 0, member);
	}
};

AjxUtil.arrayRemove =
function(array, member) {
	if (array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i] == member) {
				array.splice(i, 1);
				return true;
			}
		}
	}
	return false;
};

AjxUtil.indexOf =
function(array, object, strict) {
	if (array) {
		for (var i = 0; i < array.length; i++) {
			var item = array[i];
			if ((strict && item === object) || (!strict && item == object)) {
				return i;
			}
		}
	}
	return -1;
};

AjxUtil.arrayContains =
function(array, object, strict) {
	return AjxUtil.indexOf(array, object, strict) != -1;
};

AjxUtil.keys = function(object, acceptFunc) {
    var keys = [];
    for (var p in object) {
	    if (acceptFunc && !acceptFunc(p, object)) continue;
        keys.push(p);
    }
    return keys;
};
AjxUtil.values = function(object, acceptFunc) {
    var values = [];
    for (var p in object) {
	    if (acceptFunc && !acceptFunc(p, object)) continue;
        values.push(object[p]);
    }
    return values;
};

/**
 * Generate another hash mapping property values to their names. Each value
 * should be unique; otherwise the results are undefined.
 *
 * @param obj                   An object, treated as a hash.
 * @param func [function]       An optional function for filtering properties.
 */
AjxUtil.valueHash = function(obj, acceptFunc) {
    // don't rely on the value in the object itself
    var hasown = Object.prototype.hasOwnProperty.bind(obj);

    var r = {};
    for (var k in obj) {
        var v = obj[k];

        if (!hasown(k) || (acceptFunc && !acceptFunc(k, obj)))
            continue;
        r[v] = k;
    }
    return r;
};
AjxUtil.backMap = AjxUtil.valueHash;

/**
 * Call a function with the the items in the given object, which special logic
 * for handling of arrays.
 *
 * @param obj                   Array or other object
 * @param func [function]       Called with index or key and value.
 */
AjxUtil.foreach = function(obj, func) {

    if (!func || !obj) {
        return;
    }

    if (AjxUtil.isArrayLike(obj)) {
        var array = obj;

        for (var i = 0; i < array.length; i++) {
            func(array[i], i);
        }
    }
    else {
        // don't rely on the value in the object itself
        var hasown = Object.prototype.hasOwnProperty.bind(obj);

        for (var k in obj) {
            if (hasown(k)) {
                func(obj[k], k)
            }
        }
    }
};

AjxUtil.map = function(array, func) {

    if (!array) {
        return [];
    }

	var narray = new Array(array.length);
	for (var i = 0; i < array.length; i++) {
		narray[i] = func ? func(array[i], i) : array[i];
	}

	return narray;
};

AjxUtil.uniq = function(array) {

    if (!array) {
        return [];
    }

    var object = {};
	for (var i = 0; i < array.length; i++) {
		object[array[i]] = true;
	}

	return AjxUtil.keys(object);
};


/**
 * Remove duplicates from the given array,
 * <strong>in-place</strong>. Stable with regards to ordering.
 *
 * Please note that this method is O(n^2) if Array is backed by an
 * array/vector data structure.
 *
 * @param array [array]     array to process
 * @param keyfn [function]  used to extract a comparison key from each
 *                          list element, default is to compare
 *                          elements directly. if the comparison key
 *                          is 'undefined', the element is always
 *                          retained
 */
AjxUtil.dedup = function(array, keyfn) {

    if (!array) {
        return [];
    }

    if (!keyfn) {
		keyfn = function(v) { return v; };
    }

	var seen = {};

	for (var i = 0; i < array.length; i++) {
		var key = keyfn(array[i]);

		if (key !== undefined && seen[key]) {
			array.splice(i, 1);
			i -= 1;
		}

		seen[key] = true;
	}
};


AjxUtil.concat = function(array1 /* ..., arrayN */) {

	var array = [];
	for (var i = 0; i < arguments.length; i++) {
		array.push.apply(array, arguments[i]);
	}
	return array;
};

AjxUtil.union = function(array1 /* ..., arrayN */) {
	var array = [];
	return AjxUtil.uniq(array.concat.apply(array, arguments));
};

AjxUtil.intersection = function(array1 /* ..., arrayN */) {
	var array = AjxUtil.concat.apply(this, arguments);
	var object = AjxUtil.arrayAsHash(array, AjxUtil.__intersection_count);
	for (var p in object) {
		if (object[p] == 1) {
			delete object[p];
		}
	}
	return AjxUtil.keys(object);
};

AjxUtil.__intersection_count = function(key, hash, index, array) {
	return hash[key] != null ? hash[key] + 1 : 1;
};

AjxUtil.complement = function(array1, array2) {
	var object1 = AjxUtil.arrayAsHash(array1);
	var object2 = AjxUtil.arrayAsHash(array2);
	for (var p in object2) {
		if (p in object1) {
			delete object2[p];
		}
	}
	return AjxUtil.keys(object2);
};

/**
 * Returns an array with all the members of the given array for which the filtering function returns true.
 *
 * @param {Array}       array       source array
 * @param {Function}    func        filtering function
 * @param {Object}      context     scope for filtering function
 *
 * @returns {Array} array of members for which the filtering function returns true
 */
AjxUtil.filter = function(array, func, context) {

	var results = [];
	if (array == null) {
		return results;
	}

	var nativeFilter = Array.prototype.filter;
	if (nativeFilter && array.filter === nativeFilter) {
		return array.filter(func, context);
	}

	AjxUtil.foreach(array, function(value, index) {
		if (func.call(context, value, index)) {
			results.push(value);
		}
	});

	return results;
};

AjxUtil.getFirstElement = function(parent, ename, aname, avalue) {
    for (var child = parent.firstChild; child; child = child.nextSibling) {
        if (child.nodeType != AjxUtil.ELEMENT_NODE) continue;
        if (ename && child.nodeName != ename) continue;
        if (aname) {
            var attr = child.getAttributeNode(aname);
            if (attr.nodeName != aname) continue;
            if (avalue && attr.nodeValue != avalue) continue;
        }
        return child;
    }
    return null;
};

/**
 * @param params	[hash]		hash of params:
 *        relative	[boolean]*	if true, return a relative URL
 *        protocol	[string]*	protocol (trailing : is optional)
 *        host		[string]*	server hostname
 *        port		[int]*		server port
 *        path		[string]*	URL path
 *        qsReset	[boolean]*	if true, clear current query string
 *        qsArgs	[hash]*		set of query string names and values
 */
AjxUtil.formatUrl =
function(params) {
	params = params || {};
	var url = [];
	var i = 0;
	if (!params.relative) {
		var proto = params.protocol || location.protocol;
		if (proto.indexOf(":") == -1) {
			proto = proto + ":";
		}
		url[i++] = proto;
		url[i++] = "//";
		url[i++] = params.host || location.hostname;
		var port = Number(params.port || location.port);
		if (port &&
			((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT) ||
			 (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT))) {
			url[i++] =  ":";
			url[i++] = port;
		}
	}
	url[i++] = params.path || location.pathname;
	var qs = "";
	if (params.qsArgs) {
		qs = AjxStringUtil.queryStringSet(params.qsArgs, params.qsReset);
	} else {
		qs = params.qsReset ? "" : location.search;
	}
	url[i++] = qs;
	
	return url.join("");
};

AjxUtil.byNumber = function(a, b) {
	return Number(a) - Number(b);
};

/**
 * <strong>Note:</strong>
 * This function <em>must</em> be wrapped in a closure that passes
 * the property name as the first argument.
 *
 * @param {string}  prop    Property name.
 * @param {object}  a       Object A.
 * @param {object}  b       Object B.
 */
AjxUtil.byStringProp = function(prop, a, b) {
    return a[prop].localeCompare(b[prop]);
};

/**
 * returns the size of the given array, i.e. the number of elements in it, regardless of whether the array is associative or not.
 * so for example for array that is set simply by a = []; a[50] = "abc"; arraySize(a) == 1. For b = []; b["abc"] = "def"; arraySize(b) == 1 too.
 * Incredibly JavasCript does not have a built in simple way to get that.
 * @param arr
 */
AjxUtil.arraySize =
function(a) {
	var size = 0;
	for(var e in a) {
		if (a.hasOwnProperty(e)) {
			size ++;
		}
	}
	return size;
};

/**
 * mergesort+dedupe
**/
AjxUtil.mergeArrays =
function(arr1, arr2, orderfunc) {
	if(!orderfunc) {
		orderfunc = AjxUtil.__mergeArrays_orderfunc;
	}
 	var tmpArr1 = [];
 	var cnt1 = arr1.length;
 	for(var i = 0; i < cnt1; i++) {
 		tmpArr1.push(arr1[i]);
 	}

 	var tmpArr2 = [];
 	var cnt2 = arr2.length;
 	for(var i = 0; i < cnt2; i++) {
 		tmpArr2.push(arr2[i]);
 	} 	
	var resArr = [];
	while (tmpArr1.length>0 && tmpArr2.length>0) {
		if (orderfunc(tmpArr1[0],resArr[resArr.length-1])==0) {
			tmpArr1.shift();
			continue;
		}
		
		if (orderfunc(tmpArr2[0],resArr[resArr.length-1])==0) {
			tmpArr2.shift();
			continue;
		}		
			
		if (orderfunc(tmpArr1[0], tmpArr2[0])<0) {
			resArr.push(tmpArr1.shift());
		} else if (orderfunc(tmpArr1[0],tmpArr2[0])==0) {
			resArr.push(tmpArr1.shift());
			tmpArr2.shift();
		} else {
			resArr.push(tmpArr2.shift());
		}
	}
		
	while (tmpArr1.length>0) {
		if (orderfunc(tmpArr1[0],resArr[resArr.length-1])==0) {
			tmpArr1.shift();
			continue;
		}		
		resArr.push(tmpArr1.shift());
	}
		
	while (tmpArr2.length>0) {
		if (orderfunc(tmpArr2[0], resArr[resArr.length-1])==0) {
			tmpArr2.shift();
			continue;
		}			
		resArr.push(tmpArr2.shift());
	}
	return resArr;	
};

AjxUtil.__mergeArrays_orderfunc = function (val1,val2) {
    if(val1>val2)    return  1;
    if (val1 < val2) return -1;
    if(val1 == val2) return  0;
};

AjxUtil.arraySubtract = function (arr1, arr2, orderfunc) {
	if(!orderfunc) {
		orderfunc = function (val1,val2) {
			if(val1>val2)
				return 1;
			if (val1 < val2)
				return -1;
			if(val1 == val2)
				return 0;
		}
	}
 	var tmpArr1 = [];
 	var cnt1 = arr1.length;
 	for(var i = 0; i < cnt1; i++) {
 		tmpArr1.push(arr1[i]);
 	}

 	var tmpArr2 = [];
 	var cnt2 = arr2.length;
 	for(var i = 0; i < cnt2; i++) {
 		tmpArr2.push(arr2[i]);
 	} 	
 	tmpArr2.sort(orderfunc);
 	tmpArr1.sort(orderfunc);
	var resArr = [];
	while(tmpArr1.length > 0 && tmpArr2.length > 0) {
		if(orderfunc(tmpArr1[0],tmpArr2[0])==0) {
			tmpArr1.shift();
			tmpArr2.shift();
			continue;
		}
		
		if(orderfunc(tmpArr1[0],tmpArr2[0]) < 0) {
			resArr.push(tmpArr1.shift());
			continue;
		}
		
		if(orderfunc(tmpArr1[0],tmpArr2[0]) > 0) {
			tmpArr2.shift();
			continue;
		}
	}
	
	while(tmpArr1.length > 0) {
		resArr.push(tmpArr1.shift());
	}
	
	return resArr;
};

// Support deprecated, misspelled version
AjxUtil.arraySubstract = AjxUtil.arraySubtract;

/**
 * Returns the keys of the given hash as a sorted list.
 *
 * @param hash		[hash]
 */
AjxUtil.getHashKeys =
function(hash) {

	var list = [];
	for (var key in hash) {
		list.push(key);
	}
	list.sort();

	return list;
};

/**
 * Does a shallow comparison of two arrays.
 *
 * @param arr1	[array]
 * @param arr2	[array]
 */
AjxUtil.arrayCompare =
function(arr1, arr2) {
	if ((!arr1 || !arr2) && (arr1 != arr2)) {
		return false;
	}
	if (arr1.length != arr2.length) {
		return false;
	}
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] != arr2[i]) {
			return false;
		}
	}
	return true;
};

/**
 * Does a shallow comparison of two hashes.
 *
 * @param hash1	[hash]
 * @param hash2	[hash]
 */
AjxUtil.hashCompare =
function(hash1, hash2) {

	var keys1 = AjxUtil.getHashKeys(hash1);
	var keys2 = AjxUtil.getHashKeys(hash2);
	if (!AjxUtil.arrayCompare(keys1, keys2)) {
		return false;
	}
	for (var i = 0, len = keys1.length; i < len; i++) {
		var key = keys1[i];
		if (hash1[key] != hash2[key]) {
			return false;
		}
	}
	return true;
};

/**
 * Returns a shallow copy of the given hash.
 *
 * @param {Object}  hash    source hash
 * @param {Array}   omit    Keys to skip (blacklist)
 * @param {Array}   keep 	Keys to keep (whitelist)
 */
AjxUtil.hashCopy = function(hash, omit, keep) {

    omit = omit && AjxUtil.arrayAsHash(omit);
    keep = keep && AjxUtil.arrayAsHash(keep);

	var copy = {};
	for (var key in hash) {
        if ((!omit || !omit[key]) && (!keep || keep[key])) {
    		copy[key] = hash[key];
        }
	}

	return copy;
};

/**
 * Updates one hash with values from another.
 *
 * @param {Object}  hash1		Hash to be updated
 * @param {Object}  hash2 		Hash to update from (values from hash2 will be copied to hash1)
 * @param {Boolean} overwrite 	Set to true if existing values in hash1 should be overwritten when keys match (defaults to false)
 * @param {Array}   omit 	    Keys to skip (blacklist)
 * @param {Array}   keep        Keys to keep (whitelist)
 */
AjxUtil.hashUpdate = function(hash1, hash2, overwrite, omit, keep) {

    omit = omit && AjxUtil.arrayAsHash(omit);
    keep = keep && AjxUtil.arrayAsHash(keep);

    for (var key in hash2) {
		if ((overwrite || !(key in hash1)) && (!omit || !omit[key]) && (!keep || keep[key])) {
			hash1[key] = hash2[key];
		}
	}
};

// array check that doesn't rely on instanceof, since type info
// can get lost in new window
AjxUtil.isArray1 =
function(arg) {
	return !!(arg && (arg.length != null) && arg.splice && arg.slice);
};

// converts the arg to an array if it isn't one
AjxUtil.toArray =
function(arg) {
	if (!arg) {
		return [];
	}
	else if (AjxUtil.isArray1(arg)) {
		return arg;
	}
	else if (AjxUtil.isArrayLike(arg)) {
		return Array.prototype.slice.call(arg);
	}
	else if (arg.isAjxVector) {
        return arg.getArray();
	}
	else {
		return [arg];
	}
};

/**
 * Returns a sub-property of an object. This is useful to avoid code like
 * the following:
 * <pre>
 * resp = resp && resp.BatchResponse;
 * resp = resp && resp.GetShareInfoResponse;
 * resp = resp && resp[0];
 * </pre>
 * <p>
 * The first argument to this function is the source object while the
 * remaining arguments are the property names of the path to follow.
 * This is done instead of as a path string (e.g. "foo/bar[0]") to
 * avoid unnecessary parsing.
 *
 * @param {object}          object  The source object.
 * @param {string|number}   ...     The property of the current context object.
 */
AjxUtil.get = function(object /* , propName1, ... */) {
    for (var i = 1; object && i < arguments.length; i++) {
        object = object[arguments[i]];
    }
    return object;
};


/**
 *  Convert non-ASCII characters to valid HTML UNICODE entities 
 * @param {string}
 * 
*/
AjxUtil.convertToEntities = function (source){
	var result = '';
	var length = 0;
    
    if (!source || !(length = source.length)) return source;
    
	for (var i = 0; i < length; i++) {
		var charCode = source.charCodeAt(i);
		// Encode non-ascii or double quotes
		if ((charCode > 127) || (charCode == 34)) {
			var temp = charCode.toString(10);
			while (temp.length < 4) {
				temp = '0' + temp;
			}
			result += '&#' + temp + ';';
		} else {
			result += source.charAt(i);
		}
	}
	return result;
};

/**
 *  Get the class attribute string from the given class.
 * @param {array} - An array of class names to be converted to a class attribute.
 * returns the attribute string with the class names or empty string if no class is passed.
	*
 */
AjxUtil.getClassAttr = function (classes){
	var attr = [];
	if (classes && classes.length > 0) {
		//remove duplicate css classes
		classes = AjxUtil.uniq(classes);
		return ["class='" , classes.join(" "), "'"].join("");
	}
	return "";
};

/**
 * converts datauri string to blob object used for uploading the image
 * @param {dataURI} - datauri string  data:image/png;base64,iVBORw0
 *
 */
AjxUtil.dataURItoBlob =
function (dataURI) {

    if (!(dataURI && typeof window.atob === "function" && typeof window.Blob === "function")) {
        return;
    }

    var dataURIArray = dataURI.split(",");
    if (dataURIArray.length === 2) {
        if (dataURIArray[0].indexOf('base64') === -1) {
            return;
        }
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs
        try{
            var byteString = window.atob(dataURIArray[1]);
        }
        catch(e){
            return;
        }
        if (!byteString) {
            return;
        }
        // separate out the mime component
        var mimeString = dataURIArray[0].split(':');
        if (!mimeString[1]) {
            return;
        }
        mimeString = mimeString[1].split(';')[0];
        if (mimeString) {
            // write the bytes of the string to an ArrayBuffer
            var byteStringLength = byteString.length,
                ab = new ArrayBuffer(byteStringLength),
                ia = new Uint8Array(ab);
            for (var i = 0; i < byteStringLength; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {"type" : mimeString});
        }
    }

};

AjxUtil.reduce = function(array, callback, opt_initialValue) {
	/* left-over from IE8 support */
	return Array.prototype.reduce.call(array, callback, opt_initialValue);
};


/**
 * Returns a value for the brightness of the given color.
 *
 * @param   {string}    rgb     RGB value as #RRGGBB
 * @returns {number}    number between 0 and 255 (higher is brighter)
 */
AjxUtil.getBrightness = function(rgb) {

	var r, g, b;

	if (rgb && rgb.length === 7 && rgb.indexOf('#') === 0) {
		rgb = rgb.substr(1);
	}
	else {
		return null;
	}

	r = parseInt(rgb.substr(0, 2), 16);
	g = parseInt(rgb.substr(2, 2), 16);
	b = parseInt(rgb.substr(4, 2), 16);

	// http://alienryderflex.com/hsp.html
	return Math.sqrt(
		r * r * .299 +
			g * g * .587 +
			b * b * .114
	);
};

/**
 * Returns the better foreground color based on contrast with the given background color.
 *
 * @param   {string}    bgColor     RGB value as #RRGGBB
 * @returns {string}    'black' or 'white'
 */
AjxUtil.getForegroundColor = function(bgColor) {
	var brightness = AjxUtil.getBrightness(bgColor);
	return (brightness != null && brightness < 130) ? 'white' : 'black';
};

/**
 * Wrapper function to html encode data, this function handles normal string or array of strings
 * and returns encoded data in same format.
 *
 * @param   {string/array}    obj     array or string to html encode
 * @returns {string/array}    html encoded string or array
 */
AjxUtil.htmlEncode = function(obj) {
	if(AjxUtil.isArray(obj)) {
		obj = obj.map(function(item) {
			return AjxStringUtil.htmlEncode(item);
		});
	} else if (AjxUtil.isString(obj)) {
		obj = AjxStringUtil.htmlEncode(obj);
	}

	return obj;
};

/**
 * Wrapper function to html decode data, this function handles normal string or array of strings
 * and returns decoded data in same format.
 *
 * @param   {string/array}    obj     array or string to html decode
 * @returns {string/array}    html decoded string or array
 */
AjxUtil.htmlDecode = function(obj) {
	if(AjxUtil.isArray(obj)) {
		obj = obj.map(function(item) {
			return AjxStringUtil.htmlDecode(item);
		});
	} else if (AjxUtil.isString(obj)) {
		obj = AjxStringUtil.htmlDecode(obj);
	}

	return obj;
};