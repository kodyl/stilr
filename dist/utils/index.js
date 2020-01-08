"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.sortObject = sortObject;
exports.createHash = createHash;
exports.stringifyObject = stringifyObject;
exports.extendedToString = extendedToString;
exports.createClassName = createClassName;
exports.createMarkup = createMarkup;
exports.isEmpty = isEmpty;
exports.isPseudo = isPseudo;
exports.isMediaQuery = isMediaQuery;
exports.seperateStyles = seperateStyles;

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _parseInt2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-int"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-integer"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _CSSPropertyOperations = require("./CSSPropertyOperations");

function sortObject(obj) {
  var _context, _context2;

  return (0, _reduce["default"])(_context = (0, _sort["default"])(_context2 = (0, _keys["default"])(obj)).call(_context2)).call(_context, function (acc, key) {
    var val = obj[key];
    if (val || val === 0) acc[key] = val;
    return acc;
  }, {});
}

function createHash(str) {
  var i = str.length;
  if (i === 0) return 0;
  var hash = 5381;

  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i);
  }

  return hash >>> 0;
}

function stringifyObject(obj) {
  var keys = (0, _keys["default"])(obj);
  var str = '';

  for (var i = 0, len = keys.length; i < len; i++) {
    str += keys[i] + obj[keys[i]];
  }

  return str;
}

var SYMBOL_SET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function extendedToString(num, base) {
  var _context3;

  var conversion = '';
  if (base > SYMBOL_SET.length || base <= 1 || !(0, _isInteger["default"])(base)) throw new Error((0, _concat["default"])(_context3 = "".concat(base, " should be an integer between 1 and ")).call(_context3, SYMBOL_SET.length));

  while (num >= 1) {
    conversion = SYMBOL_SET[num - base * Math.floor(num / base)] + conversion;
    num = Math.floor(num / base);
  }

  return base < 11 ? (0, _parseInt2["default"])(conversion) : conversion;
}

function createClassName(obj) {
  var hash = extendedToString(createHash(stringifyObject(obj)), 62);
  return hash ? '_' + hash : undefined;
}

function createMarkup(obj) {
  return (0, _CSSPropertyOperations.createMarkupForStyles)(obj);
}

function isEmpty(obj) {
  return !(0, _keys["default"])(obj).length;
}

function isPseudo(_ref) {
  var style = _ref.style,
      rule = _ref.rule;
  return rule.charAt(0) === ':' && (0, _typeof2["default"])(style) === 'object';
}

function isMediaQuery(_ref2) {
  var style = _ref2.style,
      rule = _ref2.rule;
  return rule.charAt(0) === '@' && (0, _typeof2["default"])(style) === 'object';
}

function handle(type, acc, _ref3) {
  var _context4, _context5;

  var style = _ref3.style,
      rule = _ref3.rule;
  var pseudos = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var hash = createClassName(sortObject(style));
  var rules = pseudos.length ? [(0, _concat["default"])(_context4 = []).call(_context4, rule, style, pseudos)] : rule;
  acc[type] = (0, _concat["default"])(_context5 = acc[type]).call(_context5, rules);
  acc.style[rule] = hash;
  return acc;
}

function seperateStyles(styles) {
  var _context6;

  return (0, _reduce["default"])(_context6 = (0, _keys["default"])(styles)).call(_context6, function (acc, rule) {
    var content = {
      style: styles[rule],
      rule: rule
    };

    if (isPseudo(content)) {
      return handle('pseudos', acc, content);
    }

    if (isMediaQuery(content)) {
      var _seperateStyles = seperateStyles(content.style),
          style = _seperateStyles.style,
          pseudos = _seperateStyles.pseudos;

      return handle('mediaQueries', acc, {
        rule: rule,
        style: style
      }, pseudos);
    }

    acc.style[rule] = content.style;
    return acc;
  }, {
    style: {},
    pseudos: [],
    mediaQueries: []
  });
}
