"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

var globalStylesheet = new Map();
var _default = {
  create: function create(styles) {
    var stylesheet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : globalStylesheet;
    if (!(stylesheet instanceof Map)) throw new Error("".concat(stylesheet, " should be a Map"));
    return Object.keys(styles).reduce(function (acc, key) {
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
        pseudos.map(function (selector) {
          delete style[selector];
          var pseudoClassName = "".concat(className).concat(selector);
          if (stylesheet.has(pseudoClassName)) return false;
          stylesheet.set(pseudoClassName, styles[key][selector]);
        });
      }

      if (mediaQueries.length) {
        mediaQueries.map(function (selector) {
          var mqSelector = selector;
          var mqStyles = styles[key][selector];
          var mqPseudos = [];
          var mqStylesheet;

          if (Array.isArray(selector)) {
            mqSelector = selector[0];
            mqStyles = selector[1];
            mqPseudos = selector.slice(2);
          }

          delete style[mqSelector];

          if (stylesheet.has(mqSelector)) {
            mqStylesheet = stylesheet.get(mqSelector);
            if (mqStylesheet.has(className)) return false;
          }

          mqStylesheet = mqStylesheet || stylesheet.set(mqSelector, new Map()).get(mqSelector);
          mqStylesheet.set(className, mqStyles);

          if (mqPseudos.length) {
            mqPseudos.map(function (pseudo) {
              delete mqStyles[pseudo];
              var pseudoClassName = "".concat(className).concat(pseudo);
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
    var stylesheetEntries = stylesheet.entries();
    var css = '';
    var mediaQueries = '';
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = stylesheetEntries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var entry = _step.value;
        var className = entry[0];
        var styles = entry[1];
        var isMap = styles instanceof Map;
        if (!isMap && (0, _utils.isEmpty)(styles)) continue;

        if (isMap) {
          var mediaQueryCSS = this.render(options, stylesheet.get(className));
          mediaQueries += options.pretty ? "".concat(className, " {\n").concat(mediaQueryCSS, "}\n") : "".concat(className, "{").concat(mediaQueryCSS, "}");
          continue;
        }

        var markup = (0, _utils.createMarkup)(styles);
        css += options.pretty ? ".".concat(className, " {\n").concat(markup.split(';').join(';\n'), "}\n") : ".".concat(className, "{").concat(markup, "}");
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
  Map: Map,
  __stylesheet: globalStylesheet
};
exports["default"] = _default;