"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _utils = require("./utils");

var globalStylesheet = new _map2["default"]();
var _default = {
  create: function create(styles) {
    var _context;

    var stylesheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : globalStylesheet;
    if (!(stylesheet instanceof _map2["default"])) throw new Error("".concat(stylesheet, " should be a Map"));
    return (0, _reduce["default"])(_context = (0, _keys["default"])(styles)).call(_context, function (acc, key) {
      var _seperateStyles = (0, _utils.seperateStyles)(styles[key]),
          style = _seperateStyles.style,
          pseudos = _seperateStyles.pseudos,
          mediaQueries = _seperateStyles.mediaQueries;

      var className = (0, _utils.createClassName)((0, _utils.sortObject)(style));

      if (className === undefined) {
        acc[key] = '';
        return acc;
      }

      if (!stylesheet.has(className)) stylesheet.set(className, style);

      if (pseudos.length) {
        (0, _map["default"])(pseudos).call(pseudos, function (selector) {
          var _context2;

          delete style[selector];
          var pseudoClassName = (0, _concat["default"])(_context2 = "".concat(className)).call(_context2, selector);
          if (stylesheet.has(pseudoClassName)) return false;
          stylesheet.set(pseudoClassName, styles[key][selector]);
        });
      }

      if (mediaQueries.length) {
        (0, _map["default"])(mediaQueries).call(mediaQueries, function (selector) {
          var mqSelector = selector;
          var mqStyles = styles[key][selector];
          var mqPseudos = [];
          var mqStylesheet;

          if ((0, _isArray["default"])(selector)) {
            mqSelector = selector[0];
            mqStyles = selector[1];
            mqPseudos = (0, _slice["default"])(selector).call(selector, 2);
          }

          delete style[mqSelector];

          if (stylesheet.has(mqSelector)) {
            mqStylesheet = stylesheet.get(mqSelector);
            if (mqStylesheet.has(className)) return false;
          }

          mqStylesheet = mqStylesheet || stylesheet.set(mqSelector, new _map2["default"]()).get(mqSelector);
          mqStylesheet.set(className, mqStyles);

          if (mqPseudos.length) {
            (0, _map["default"])(mqPseudos).call(mqPseudos, function (pseudo) {
              var _context3;

              delete mqStyles[pseudo];
              var pseudoClassName = (0, _concat["default"])(_context3 = "".concat(className)).call(_context3, pseudo);
              if (mqStylesheet.has(pseudoClassName)) return false;
              mqStylesheet.set(pseudoClassName, styles[key][mqSelector][pseudo]);
            });
          }
        });
      }

      acc[key] = className;
      return acc;
    }, {});
  },
  render: function render() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      pretty: false
    };
    var stylesheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : globalStylesheet;
    var stylesheetEntries = (0, _entries["default"])(stylesheet).call(stylesheet);
    var css = '';
    var mediaQueries = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator2["default"])(stylesheetEntries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _context6, _context7;

        var entry = _step.value;
        var className = entry[0];
        var styles = entry[1];
        var isMap = styles instanceof _map2["default"];
        if (!isMap && (0, _utils.isEmpty)(styles)) continue;

        if (isMap) {
          var _context4, _context5;

          var mediaQueryCSS = this.render(options, stylesheet.get(className));
          mediaQueries += options.pretty ? (0, _concat["default"])(_context4 = "".concat(className, " {\n")).call(_context4, mediaQueryCSS, "}\n") : (0, _concat["default"])(_context5 = "".concat(className, "{")).call(_context5, mediaQueryCSS, "}");
          continue;
        }

        var markup = (0, _utils.createMarkup)(styles);
        css += options.pretty ? (0, _concat["default"])(_context6 = ".".concat(className, " {\n")).call(_context6, markup.split(';').join(';\n'), "}\n") : (0, _concat["default"])(_context7 = ".".concat(className, "{")).call(_context7, markup, "}");
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return css + mediaQueries;
  },
  clear: function clear() {
    var stylesheet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : globalStylesheet;
    stylesheet.clear();
    return !stylesheet.size;
  },
  Map: _map2["default"],
  __stylesheet: globalStylesheet
};
exports["default"] = _default;
