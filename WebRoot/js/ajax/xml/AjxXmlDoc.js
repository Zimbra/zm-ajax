/*
 * ***** BEGIN LICENSE BLOCK *****
 * Zimbra Collaboration Suite Web Client
 * Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc.
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
 * All portions of the code are Copyright (C) 2005, 2006, 2007, 2009, 2010, 2012, 2013, 2014, 2015, 2016 Synacor, Inc. All Rights Reserved.
 * ***** END LICENSE BLOCK *****
 */


/**
 * Default constructor.
 * @class
 * Do not directly instantiate {@link AjxXmlDoc}, use one of the create factory methods instead.
 * 
 */
AjxXmlDoc = function() {
	if (!AjxXmlDoc._inited)
		AjxXmlDoc._init();
}

AjxXmlDoc.prototype.isAjxXmlDoc = true;
AjxXmlDoc.prototype.toString = function() {	return "AjxXmlDoc"; }

//
// Constants
//

/**
 * <strong>Note:</strong>
 * Anybody that uses these regular expressions MUST reset the <code>lastIndex</code>
 * property to zero or else the results are not guaranteed to be correct. You should
 * use {@link AjxXmlDoc.replaceInvalidChars} instead.
 * 
 * @private
 */
AjxXmlDoc.INVALID_CHARS_RE = /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE-\uFFFF]/g;
AjxXmlDoc.REC_AVOID_CHARS_RE = /[\u007F-\u0084\u0086-\u009F\uFDD0-\uFDDF]/g;

//
// Data
//

AjxXmlDoc._inited = false;
AjxXmlDoc._msxmlVers = null;
AjxXmlDoc._useDOM =
    Boolean(document.implementation && document.implementation.createDocument);
AjxXmlDoc._useActiveX =
    !AjxXmlDoc._useDOM && Boolean(window.ActiveXObject);

/**
 * Creates an XML doc.
 * 
 * @return	{AjxXmlDoc}	the XML doc
 */
AjxXmlDoc.create =
function() {
	var xmlDoc = new AjxXmlDoc();
	var newDoc = null;
	if (AjxXmlDoc._useActiveX) {
		newDoc = new ActiveXObject(AjxXmlDoc._msxmlVers);
		newDoc.async = true; // Force Async loading
		if (AjxXmlDoc._msxmlVers == "MSXML2.DOMDocument.4.0") {
			newDoc.setProperty("SelectionLanguage", "XPath");
			newDoc.setProperty("SelectionNamespaces", "xmlns:zimbra='urn:zimbra' xmlns:mail='urn:zimbraMail' xmlns:account='urn:zimbraAccount'");
		}
	} else if (AjxXmlDoc._useDOM) {
		newDoc = document.implementation.createDocument("", "", null);
	} else {
		throw new AjxException("Unable to create new Doc", AjxException.INTERNAL_ERROR, "AjxXmlDoc.create");
	}
	xmlDoc._doc = newDoc;
	return xmlDoc;
}

/**
 * Creates an XML doc from a document object.
 * 
 * @param	{Document}		doc		the document object
 * @return	{AjxXmlDoc}		the XML doc
 */
AjxXmlDoc.createFromDom =
function(doc) {
	var xmlDoc = new AjxXmlDoc();
	xmlDoc._doc = doc;
	return xmlDoc;
}

/**
 * Creates an XML doc from an XML string.
 * 
 * @param	{string}		xml		the XML string
 * @return	{AjxXmlDoc}		the XML doc
 */
AjxXmlDoc.createFromXml =
function(xml) {
	var xmlDoc = AjxXmlDoc.create();
	xmlDoc.loadFromString(xml);
	return xmlDoc;
}

/**
 * Replaces invalid characters in the given string.
 * 
 * @param	{string}	s	the string
 * @return	{string}	the resulting string
 */
AjxXmlDoc.replaceInvalidChars = function(s) {
	AjxXmlDoc.INVALID_CHARS_RE.lastIndex = 0;
	return s.replace(AjxXmlDoc.INVALID_CHARS_RE, "?");
};

AjxXmlDoc.getXml = function(node) {

    if (!node) {
        return '';
    }

    var xml = node.xml;
    if (!xml) {
        var ser = new XMLSerializer();
        xml = ser.serializeToString(node);
    }

    return AjxXmlDoc.replaceInvalidChars(xml);
};

/**
 * Gets the document.
 * 
 * @return	{Document}	the document
 */
AjxXmlDoc.prototype.getDoc =
function() {
	return this._doc;
}

AjxXmlDoc.prototype.loadFromString =
function(str) {
	var doc = this._doc;
	doc.loadXML(str);
	if (AjxXmlDoc._useActiveX) {
		if (doc.parseError.errorCode != 0)
			throw new AjxException(doc.parseError.reason, AjxException.INVALID_PARAM, "AjxXmlDoc.loadFromString");
	}
}

AjxXmlDoc.prototype.loadFromUrl =
function(url) {
	if(AjxEnv.isChrome || AjxEnv.isSafari) {
		var xmlhttp = new window.XMLHttpRequest();
		xmlhttp.open("GET", url, false);
		xmlhttp.send(null);
		var xmlDoc = xmlhttp.responseXML;
		this._doc = xmlDoc;
	} else {
		this._doc.load(url);
	}
}

/**
 * This function tries to create a JavaScript representation of the DOM. In some cases,
 * it is easier to work with JS objects rather than do DOM lookups.
 *
 * <p>
 * Rules:
 * <ol>
 * <li>The top-level tag gets lost; only it's content is seen important.</li>
 * <li>Each node will be represented as a JS object.  It's textual content
 *      will be saved in node.__msh_content (returned by <code>toString()</code>).</li>
 * <li>Attributes get discarded.</li>
 * <li>Each subnode will map to a property with its tagName in the parent
 *      node <code>parent[subnode.tagName] == subnode</code></li>
 * <li>If multiple nodes with the same tagName have the same parent node, then
 *      <code>parent[tagName]</code> will be an array containing the objects, rather than a
 *      single object.</li>
 * </ol>
 * 
 * So what this function allows us to do is for instance this, starting with this XML doc:
 *
 * <pre>
 * &lt;error>
 *   &lt;code>404&lt;/code>
 *   &lt;name>Not Found&lt;/name>
 *   &lt;description>Page wasn't found on this server.&lt;/description>
 * &lt;/error>
 * </pre>
 * 
 * <pre>
 * var obj = AjxXmlDoc.createFromXml(XML).toJSObject();
 * alert(obj.code + " " + obj.name + " " + obj.description);
 * </pre>
 * 
 * Here's an array example:
 * <pre>
 * &lt;return>
 *   &lt;item>
 *     &lt;name>John Doe&lt;/name>
 *     &lt;email>foo@bar.com&lt;/email>
 *   &lt;/item>
 *   &lt;item>
 *     &lt;name>Johnny Bravo&lt;/name>
 *     &lt;email>bravo@cartoonnetwork.com&lt;/email>
 *   &lt;/item>
 * &lt;/return>
 * </pre>
 * 
 * <pre>
 * var obj = AjxXmlDoc.createFromXml(XML).toJSObject();
 * for (var i = 0; i < obj.item.length; ++i) {
 *   alert(obj.item[i].name + " / " + obj.item[i].email);
 * }
 * </pre>
 *
 * Note that if there's only one &lt;item> tag, then obj.item will be an object
 * rather than an array.  And if there is no &lt;item> tag, then obj.item will be
 * undefined.  These are cases that the calling application must take care of.
 */
AjxXmlDoc.prototype.toJSObject = 
function(dropns, lowercase, withAttrs) {
	var _node = function() { this.__msh_content = ''; };
	_node.prototype.toString = function() { return this.__msh_content; };
	var rec = function(i, o) {
		var tags = {}, t, n;
		for (i = i.firstChild; i; i = i.nextSibling) {
			if (i.nodeType == 1) {
				t = i.tagName;
				if (dropns)      t = t.replace(/^.*?:/, "");
				if (lowercase)   t = t.toLowerCase();
				n = new _node();
				if (tags[t]) {
					if (tags[t] == 1) {
						o[t] = [ o[t] ];
						tags[t] = 2;
					}
					o[t].push(n);
				} else {
					o[t] = n;
					tags[t] = 1;
				}
				//do attributes
				if(withAttrs) {
					if(i.attributes && i.attributes.length) {
						for(var ix = 0;ix<i.attributes.length;ix++) {
							var attr = i.attributes[ix];
							n[attr.name] = AjxUtil.isNumeric(attr.value) ? attr.value : String(attr.value);
						}
					}
				}
				rec(i, n);
			} else if (i.nodeType == 3)
				o.__msh_content += i.nodeValue;
		}
	};
	var o = new _node();
	rec(this._doc.documentElement, o);
	return o;
};

AjxXmlDoc.prototype.getElementsByTagNameNS = 
function(ns, tag) {
	var doc = this.getDoc();
	return !doc.getElementsByTagNameNS
		? doc.getElementsByTagName(ns + ":" + tag)
		: doc.getElementsByTagNameNS(ns, tag);
};

AjxXmlDoc.prototype.getFirstElementByTagNameNS = 
function(ns, tag) {
	return this.getElementsByTagNameNS(ns, tag)[0];
};

AjxXmlDoc.prototype.getElementsByTagName = 
function(tag) {
	var doc = this.getDoc();
	return doc.getElementsByTagName(tag);
};

AjxXmlDoc._init =
function() {
	if (AjxXmlDoc._useActiveX) {
		var msxmlVers = ["MSXML4.DOMDocument", "MSXML3.DOMDocument", "MSXML2.DOMDocument.4.0",
				 "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "MSXML.DOMDocument",
				 "Microsoft.XmlDom"];
		for (var i = 0; i < msxmlVers.length; i++) {
			try {
				new ActiveXObject(msxmlVers[i]);
				AjxXmlDoc._msxmlVers = msxmlVers[i];
				break;
			} catch (ex) {
			}
		}
		if (!AjxXmlDoc._msxmlVers) {
			throw new AjxException("MSXML not installed", AjxException.INTERNAL_ERROR, "AjxXmlDoc._init");
		}
	} else if (!Document.prototype.loadXML) {
		// add loadXML to Document's API
		Document.prototype.loadXML = function(str) {
			var domParser = new DOMParser();
			var domObj = domParser.parseFromString(str, "text/xml");
			// remove old child nodes since we recycle DOMParser and append new
			while (this.hasChildNodes()) {
				this.removeChild(this.lastChild);
			}
			var len = domObj.childNodes.length;
            for (var i = 0; i < len; i++) {
                var importedNode = this.importNode(domObj.childNodes[i], true);
                this.appendChild(importedNode);
            }
		}
		
		if (AjxEnv.isNav) {
			var _NodeGetXml = function() {
				var ser = new XMLSerializer();
				return ser.serializeToString(this);
			}
			Node.prototype.__defineGetter__("xml", _NodeGetXml);
		}
	}
	
	AjxXmlDoc._inited = true;
};

AjxXmlDoc.prototype.set =
function(name, value, element) {
   var p = this._doc.createElement(name);
      if (value != null) {
         var cdata = this._doc.createTextNode("");
         p.appendChild(cdata);
         cdata.nodeValue = value;
      }
      if (element == null) {
         this.root.appendChild(p);
      } else {
         element.appendChild(p);
      }
   return p;
};

AjxXmlDoc.prototype.getXml = function() {
    return AjxXmlDoc.getXml(this.getDoc());
};
AjxXmlDoc.prototype.getDocXml = AjxXmlDoc.prototype.getXml;     // back-compatibility with old name

/**
 * Creates an XML document with a root element.
 * 
 * @param	{string}	rootName	the root name
 * @return	{AjxXmlDoc}	the XML document
 */
AjxXmlDoc.createRoot =
function(rootName) {
   var xmldoc = AjxXmlDoc.create();
   var d = xmldoc.getDoc();
   xmldoc.root = d.createElement(rootName);

   d.appendChild(xmldoc.root);
   return xmldoc;
};

/**
 * Creates an XML document with the element.
 * 
 * @param	{string}	name	the element name
 * @param	{string}	value	the element value
 * @return	{AjxXmlDoc}	the XML document
 */
AjxXmlDoc.createElement =
function(name, value) {
	
   var xmldoc = AjxXmlDoc.create();
   var d = xmldoc.getDoc();
   xmldoc.root = d.createElement(name);
   if (value != null) {
   		//xmldoc.root.nodeValue = value;
   	 	var cdata = d.createTextNode("");
        xmldoc.root.appendChild(cdata);
        cdata.nodeValue = value;
   }
   
   d.appendChild(xmldoc.root);
   return xmldoc;
   
};


AjxXmlDoc.prototype.appendChild =
function(xmldoc){
   //Security Exception WRONG_DOCUMENT_ERR thrown when we append nodes created of diff. documents
   //Chrome/Safari does not like it.
   if(this._doc != xmldoc._doc && ( AjxEnv.isChrome || AjxEnv.isSafari )){
        this.root.appendChild(this.getDoc().importNode(xmldoc.root, true));
   }else{
        this.root.appendChild(xmldoc.root);
   }
};

