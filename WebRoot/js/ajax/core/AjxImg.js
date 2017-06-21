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
 * @class
 * This static class provides basic image support by using CSS and background 
 * images rather than &lt;img&gt; tags.
 *  
 * @author Conrad Damon
 * @author Ross Dargahi
 * 
 * @private
 */
AjxImg = function() {};

AjxImg.prototype = new Object;
AjxImg.prototype.constructor = null;

AjxImg._VIEWPORT_ID = "AjxImg_VP";

AjxImg.DISABLED = true;

AjxImg.RE_COLOR = /^(.*?),color=(.*)$/;

/**
 * This method will set the image for <i>parentEl</i>. <i>parentEl</i> should 
 * only contain this image and no other children
 *
 * @param parentEl 		the parent element for the image
 * @param imageName 		the name of the image.  The CSS class for the image will be "Img&lt;imageName&gt;".
 * @param useParenEl 	if <code>true</code> will use the parent element as the root for the image and will not create an intermediate DIV
 * @param _disabled		if <code>true</code>, will append " ZDisabledImage" to the CSS class for the image,
 * @param {array}       classes             array of class names to be applied to this image
 *							which will make the image partly transparent
 * @param {string}		altText			alternative text for non-visual users
 */
AjxImg.setImage =
function(parentEl, imageName, useParentEl, _disabled, classes, altText) {
    
    if (!parentEl) { return; }

    classes = classes || [];
    var origImageName = imageName;
    var color, m = imageName && imageName.match(AjxImg.RE_COLOR);
    if (m) {
        imageName = m && m[1];
        color = m && m[2];
    }

    // Get image data based on image name
    var imageData = window.AjxImgData[AjxImg.getClassForImage(imageName)];
    if(!imageData) {
        DBG.println(AjxDebug.IMAGES, "missing image: ", AjxImg.getClassForImage(imageName));

        return;
    }

    var className = AjxImg.getClassForImage(imageName + (imageData.v ? '-svg' : ''), _disabled);
    if (useParentEl) {
        DBG.println(AjxDebug.IMAGES, "No support for vector image when useParentEl is true");
        classes.push(className);
        parentEl.className = classes.join(" ");
        imageData.v && (parentEl.innerHTML = AjxImg.createSVGTag(imageData));
        return;
    }

    var id = parentEl.firstChild && parentEl.firstChild.id;

    if (color) {
        color = (color.match(/^\d$/) ? ZmOrganizer.COLOR_VALUES[color] : color) ||
                ZmOrganizer.COLOR_VALUES[ZmOrganizer.ORG_DEFAULT_COLOR];
        parentEl.innerHTML = AjxImg.getImageHtml({
            imageName: origImageName,
            attrStr: id ? "id='"+id+"'" : null,
            altText: altText,
            disabled: _disabled
        });
        return;
    }

    if (parentEl.firstChild == null || parentEl.firstChild.nodeName.toLowerCase() != "div") {
        var html = [], i = 0;
        html[i++] = "<div ";
        if (id) {
            html[i++] = " id='";
            html[i++] = id;
            html[i++] = "' ";
        }
        // Raster/Vector image using background
        if (className) {
            classes.push(className);
        }
        html[i++] = AjxUtil.getClassAttr(classes);
        html[i++] = ">";
        if (altText) {
            html[i++] = "<div class='ScreenReaderOnly'>";
            html[i++] = AjxStringUtil.htmlEncode(altText);
            html[i++] = "</div>";
        }

        // Vector image using SVG tag
        if(imageData.v) {
            html[i++] = AjxImg.createSVGTag(imageData);
        }

        html[i++] = "</div>";
        parentEl.innerHTML = html.join("");
        return;
    }
    if (className) {
        if (imageData.v) {
            // Vector image using SVG tag
            parentEl.firstChild.innerHTML = AjxImg.createSVGTag(imageData);
        }

        // Raster/Vector image using background
        classes.push(className);

        parentEl.firstChild.className = classes.join(" ");
    }
};

AjxImg.setDisabledImage = function(parentEl, imageName, useParentEl, classes) {
	return AjxImg.setImage(parentEl, imageName, useParentEl, true, classes);
};

AjxImg.getClassForImage =
function(imageName, disabled) {
	var className = imageName ? "Img" + imageName : "";
	if (disabled) className += " ZDisabledImage";
	return className;
};

AjxImg.getImageClass =
function(parentEl) {
	return parentEl.firstChild ? parentEl.firstChild.className : parentEl.className;
};

AjxImg.getImageElement =
function(parentEl) {
	return parentEl.firstChild ? parentEl.firstChild : parentEl;
};

AjxImg.getParentElement =
function(imageEl) {
	return imageEl.parentNode;
};

AjxImg.GET_IMAGE_HTML_PARAMS = [
	"imageName",
	"styles",
	"attrStr",
	"wrapInTable",
	"disabled",
	"classes",
	"altText"
];

/**
 * Returns the HTML needed to display the given image.
 *
 * @param {object}		params		hash of params:
 * @param {string}		imageName		the image you want to render
 * @param {string}		styles			optional style info (for example, "display:inline")
 * @param {string}		attrStr			optional attributes (for example, "id=X748")
 * @param {boolean}		wrapInTable		if true, wrap the HTML in a TABLE
 * @param {boolean}		disabled		if true, show image as disabled
 * @param {array}		classes			array of class names to be applied to this image
 * @param {string}		altText			alternative text for non-visual users
 * 
 * @return	{string}	the image string
 */
AjxImg.getImageHtml = 
function() {
	var params = Dwt.getParams(arguments, AjxImg.GET_IMAGE_HTML_PARAMS);

	var imageName = params.imageName;
	var styles = params.styles || "";
	var styleStr = styles ? " style='" + styles + "'" : "";
	var attrStr = params.attrStr ? " " + params.attrStr : "";
	var disabled = params.disabled;
	var classes = params.classes || [];
	var altText = params.altText;

	var pre = params.wrapInTable ? "<table style='display:inline' cellpadding=0 cellspacing=0 border=0><tr><td align=center valign=bottom>" : "";
    var html = "";
	var post = params.wrapInTable ? "</td></tr></table>" : "";

	if (imageName) {
        var color, m = imageName.match(AjxImg.RE_COLOR);
        if (m) {
            imageName = m && m[1];
            color = m && m[2];
        }

        // Get image data based on image name
        var imageData = window.AjxImgData[AjxImg.getClassForImage(imageName)];
        if(!imageData) {
            DBG.println(AjxDebug.IMAGES, "missing image: ", AjxImg.getClassForImage(imageName));

            return;
        }

        var className = AjxImg.getClassForImage(imageName + (imageData.v ? '-svg' : ''), disabled);
        if (color) {
            color = (color.match(/^\d$/) ? ZmOrganizer.COLOR_VALUES[color] : color) ||
                    ZmOrganizer.COLOR_VALUES[ZmOrganizer.ORG_DEFAULT_COLOR];

            // we're creating IMG elements here, so we can use the alt attribute
            if (altText) {
                attrStr += " alt='" + AjxStringUtil.encodeQuotes(altText) + "'";
            }

            if(styles) {
                styleStr = " style='" + styles + "; fill: " + color + "'";
            } else {
                styleStr = " style='fill: " + color + "'";
            }

            if(imageData.v) {
                html = AjxImg.createSVGTag(imageData, AjxImg.getClassForImage(imageName + '-svg'), styleStr, attrStr);
            } else {
                DBG.println(AjxDebug.IMAGES, "No support for raster image with specific color ", AjxImg.getClassForImage(imageName));
            }
        }
        else {
            // Raster/Vector image using background
            classes.push(className);

            html = [
                "<div ", AjxUtil.getClassAttr(classes), styleStr, attrStr, ">"
            ];
            if (altText) {
                // alt is invalid on DIVs, so use a hidden element
                html.push(
                    "<span class='ScreenReaderOnly'>",
                    AjxStringUtil.htmlEncode(altText),
                    "</span>"
                );
            };

            // Vector image using SVG tag
            if(imageData.v) {
                html.push(AjxImg.createSVGTag(imageData));
            }

            html.push("</div>");

            html = html.join("");
        }
    }
    else {
        html = [
            "<div", styleStr, attrStr, ">"
        ];
        if (altText) {
            // alt is invalid on DIVs, so use a hidden element
            html.push(
                "<span class='ScreenReaderOnly'>",
                AjxStringUtil.htmlEncode(altText),
                "</span>"
            );
        };
        html.push("</div>");
        html = html.join("");
    }
    return pre || post ? [pre,html,post].join("") : html;
};

/**
 * Creates SVG tag that can be appended to any block level element
 *
 * @param imageData          the image data
 * @param imageName          name of image
 * @param styleStr           optional style info (for example, "display:inline")
 * @param attrStr            optional attributes (for example, "id=X748")
 * @return  {string}         the svg string
 */
AjxImg.createSVGTag = function(imageData, imageName, styleStr, attrStr) {
    styleStr = styleStr || "";
    attrStr = attrStr || "";
    clsStr = 'svg-icon';

    if(imageName) {
        clsStr += ' ' + imageName;
    }

    var retVal = [];
    retVal.push("<svg aria-hidden='true' class='" + clsStr + "' " + styleStr + attrStr + ">");

    // SVG2 has deprecated xlink:href, so in future we need to use href attribute
    retVal.push("<use xlink:href=\"" + imageData.f + "\"></use>");

    retVal.push("</svg>");

    return retVal.join("");
};

/**
 * Gets the "image" as an HTML string.
 *
 * @param imageName		     the image you want to render
 * @param imageStyleStr      optional style info (for example, "display:inline")
 * @param attrStr		     optional attributes (for example, "id=X748")
 * @param label			     the text that follows this image
 * @param containerClassName class to use instead of the default inlineIcon class
 * @return	{string}	     the image string
 */
AjxImg.getImageSpanHtml =
function(imageName, imageStyleStr, attrStr, label, containerClassName) {
    containerClassName = containerClassName || "inlineIcon";
	var html = [
        "<span style='white-space:nowrap'>",
        "<span class='",
        containerClassName,
        "'>",
        AjxImg.getImageHtml(imageName, imageStyleStr, attrStr),
        (label || ""),
        "</span>",
        "</span>"
    ];

    return html.join("");
};

/**
 * Creates circular progress bar
 * 
 * @param percentage: percentage completed
 * @return string: HTML markup for progress-bar
 */
AjxImg.getCircularProgressBar =
function (percentage) {
	percentage = percentage || 0;
	var htmlArr = [],
		idx = 0;  
	if (percentage != 100) {    
		var offset = 100 - percentage;
		var label = AjxMessageFormat.format(AjxMsg.percentageString, percentage);
		htmlArr[idx++] = "<svg class='progress-circle' viewBox='0 0 38 38'>";    
		htmlArr[idx++] = "<text x='19' y='19' font-size='10' text-anchor='middle' alignment-baseline='central'>";    
		htmlArr[idx++] = label;    
		htmlArr[idx++] = "</text>";    
		htmlArr[idx++] = "<circle class='bg' r='16' cx='19' cy='19' stroke-width='2' fill='none'></circle>";    
		htmlArr[idx++] = "<circle class='progress' r='16' cx='19' cy='19' stroke-width='2' transform='rotate(-90, 19, 19)' stroke-width='4' fill='none' stroke-dasharray='100' stroke-dashoffset='";    
		htmlArr[idx++] = offset;    
		htmlArr[idx++] = "'>";    
		htmlArr[idx++] = "</circle>";    
		htmlArr[idx++] = "</svg>";  
	} else {    
		htmlArr[idx++] = "<svg viewBox='0 0 50 50' class='progress-circle tick-inside' enable-background='0 0 50 50'>";    
		htmlArr[idx++] = "<path d='M 25 3 C 12.86158 3 3 12.86158 3 25 C 3 37.13842 12.86158 47 25 47 C 37.13842 47 47 37.13842 47 25 C 47 12.86158 37.13842 3 25 3 z M 25 5 C 36.05754 5 45 13.94246 45 25 C 45 36.05754 36.05754 45 25 45 C 13.94246 45 5 36.05754 5 25 C 5 13.94246 13.94246 5 25 5 z M 34.0625 14.46875 L 23.125 31.46875 L 15.78125 24.84375 L 14.4375 26.34375 L 22.625 33.75 L 23.5 34.53125 L 24.125 33.53125 L 35.75 15.53125 L 34.0625 14.46875 z' overflow='visible'></path>";    
		htmlArr[idx++] = "</svg>";  
	}
	return htmlArr.join("");
}