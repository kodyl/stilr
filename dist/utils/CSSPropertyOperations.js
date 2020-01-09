"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMarkupForStyles = createMarkupForStyles;
exports.setValueForStyles = setValueForStyles;

var _CSSProperty = require("./CSSProperty");

var _dangerousStyleValue = _interopRequireDefault(require("./dangerousStyleValue"));

var _fbjs = require("./fbjs");

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSPropertyOperations
 */
// var ExecutionEnvironment = require('fbjs/lib/ExecutionEnvironment');
// var camelizeStyleName = require('fbjs/lib/camelizeStyleName');
// var hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');
// var memoizeStringOnly = require('fbjs/lib/memoizeStringOnly');
// var warning = require('fbjs/lib/warning');
var processStyleName = (0, _fbjs.memoizeStringOnly)(function (styleName) {
  return (0, _fbjs.hyphenateStyleName)(styleName);
});
var hasShorthandPropertyBug = false;
var styleFloatAccessor = 'cssFloat';

if (_fbjs.ExecutionEnvironment.canUseDOM) {
  var tempStyle = document.createElement('div').style;

  try {
    // IE8 throws "Invalid argument." if resetting shorthand style properties.
    tempStyle.font = '';
  } catch (e) {
    hasShorthandPropertyBug = true;
  } // IE8 only supports accessing cssFloat (standard) as styleFloat


  if (document.documentElement.style.cssFloat === undefined) {
    styleFloatAccessor = 'styleFloat';
  }
}

if (process.env.NODE_ENV !== 'production') {
  // 'msTransform' is correct, but the other prefixes should be capitalized
  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/; // style values shouldn't contain a semicolon

  var badStyleValueWithSemicolonPattern = /;\s*$/;
  var warnedStyleNames = {};
  var warnedStyleValues = {};
  var warnedForNaNValue = false;

  var warnHyphenatedStyleName = function warnHyphenatedStyleName(name, owner) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    (0, _fbjs.warning)(false, 'Unsupported style property %s. Did you mean %s?%s', name, (0, _fbjs.camelizeStyleName)(name), checkRenderMessage(owner));
  };

  var warnBadVendoredStyleName = function warnBadVendoredStyleName(name, owner) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    (0, _fbjs.warning)(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?%s', name, name.charAt(0).toUpperCase() + name.slice(1), checkRenderMessage(owner));
  };

  var warnStyleValueWithSemicolon = function warnStyleValueWithSemicolon(name, value, owner) {
    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return;
    }

    warnedStyleValues[value] = true;
    (0, _fbjs.warning)(false, "Style property values shouldn't contain a semicolon.%s " + 'Try "%s: %s" instead.', checkRenderMessage(owner), name, value.replace(badStyleValueWithSemicolonPattern, ''));
  };

  var warnStyleValueIsNaN = function warnStyleValueIsNaN(name, value, owner) {
    if (warnedForNaNValue) {
      return;
    }

    warnedForNaNValue = true;
    (0, _fbjs.warning)(false, '`NaN` is an invalid value for the `%s` css style property.%s', name, checkRenderMessage(owner));
  };

  var checkRenderMessage = function checkRenderMessage(owner) {
    if (owner) {
      var name = owner.getName();

      if (name) {
        return ' Check the render method of `' + name + '`.';
      }
    }

    return '';
  };
  /**
   * @param {string} name
   * @param {*} value
   * @param {ReactDOMComponent} component
   */


  var warnValidStyle = function warnValidStyle(name, value, component) {
    var owner;

    if (component) {
      owner = component._currentElement._owner;
    }

    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName(name, owner);
    } else if (badVendoredStyleNamePattern.test(name)) {
      warnBadVendoredStyleName(name, owner);
    } else if (badStyleValueWithSemicolonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value, owner);
    }

    if (typeof value === 'number' && isNaN(value)) {
      warnStyleValueIsNaN(name, value, owner);
    }
  };
}
/**
 * Operations for dealing with CSS properties.
 */

/**
 * Serializes a mapping of style properties for use as inline styles:
 *
 *   > createMarkupForStyles({width: '200px', height: 0})
 *   "width:200px;height:0;"
 *
 * Undefined values are ignored so that declarative programming is easier.
 * The result should be HTML-escaped before insertion into the DOM.
 *
 * @param {object} styles
 * @param {ReactDOMComponent} component
 * @return {?string}
 */


function createMarkupForStyles(styles, component) {
  var serialized = '';

  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }

    var styleValue = styles[styleName];

    if (process.env.NODE_ENV !== 'production') {
      warnValidStyle(styleName, styleValue, component);
    }

    if (styleValue != null) {
      serialized += processStyleName(styleName) + ':';
      serialized += (0, _dangerousStyleValue["default"])(styleName, styleValue, component) + ';';
    }
  }

  return serialized || null;
}
/**
 * Sets the value for multiple styles on a node.  If a value is specified as
 * '' (empty string), the corresponding style property will be unset.
 *
 * @param {DOMElement} node
 * @param {object} styles
 * @param {ReactDOMComponent} component
 */


function setValueForStyles(node, styles, component) {
  var style = node.style;

  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }

    if (process.env.NODE_ENV !== 'production') {
      warnValidStyle(styleName, styles[styleName], component);
    }

    var styleValue = (0, _dangerousStyleValue["default"])(styleName, styles[styleName], component);

    if (styleName === 'float' || styleName === 'cssFloat') {
      styleName = styleFloatAccessor;
    }

    if (styleValue) {
      style[styleName] = styleValue;
    } else {
      var expansion = hasShorthandPropertyBug && _CSSProperty.shorthandPropertyExpansions[styleName];

      if (expansion) {
        // Shorthand property that IE8 won't like unsetting, so unset each
        // component to placate it
        for (var individualStyleName in expansion) {
          style[individualStyleName] = '';
        }
      } else {
        style[styleName] = '';
      }
    }
  }
}