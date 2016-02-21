'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _utils = require('./utils');

var globalStylesheet = new Map();

exports['default'] = {
  create: function create(styles) {
    var stylesheet = arguments.length <= 1 || arguments[1] === undefined ? globalStylesheet : arguments[1];

    if (!(stylesheet instanceof Map)) throw new Error(stylesheet + ' should be a Map');

    return Object.keys(styles).reduce(function (acc, key) {
      var _seperateStyles = (0, _utils.seperateStyles)(styles[key]);

      var style = _seperateStyles.style;
      var pseudos = _seperateStyles.pseudos;
      var mediaQueries = _seperateStyles.mediaQueries;

      var className = (0, _utils.createClassName)((0, _utils.sortObject)(style));

      if (className === undefined) {
        acc[key] = '';
        return acc;
      }

      if (!stylesheet.has(className)) stylesheet.set(className, style);

      if (pseudos.length) {
        pseudos.map(function (selector) {
          delete style[selector];
          var pseudoClassName = '' + className + selector;

          if (stylesheet.has(pseudoClassName)) return false;

          stylesheet.set(pseudoClassName, styles[key][selector]);
        });
      }

      if (mediaQueries.length) {
        mediaQueries.map(function (selector) {
          var mqSelector = selector;
          var mqStyles = styles[key][selector];
          var mqPseudos = [];
          var mqStylesheet = undefined;

          if (Array.isArray(selector)) {
            var _selector = _toArray(selector);

            var main = _selector[0];
            var _styles = _selector[1];

            var rest = _selector.slice(2);

            mqSelector = main;
            mqPseudos = rest;
            mqStyles = _styles;
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
              var pseudoClassName = '' + className + pseudo;

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
    var options = arguments.length <= 0 || arguments[0] === undefined ? { pretty: false } : arguments[0];
    var stylesheet = arguments.length <= 1 || arguments[1] === undefined ? globalStylesheet : arguments[1];

    var stylesheetEntries = stylesheet.entries();
    var css = '';
    var mediaQueries = '';

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = stylesheetEntries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var entry = _step.value;

        var _entry = _slicedToArray(entry, 2);

        var className = _entry[0];
        var styles = _entry[1];

        var isMap = styles instanceof Map;

        if (!isMap && (0, _utils.isEmpty)(styles)) continue;

        if (isMap) {
          var mediaQueryCSS = this.render(options, stylesheet.get(className));
          mediaQueries += options.pretty ? className + ' {\n' + mediaQueryCSS + '}\n' : className + '{' + mediaQueryCSS + '}';
          continue;
        }

        var markup = (0, _utils.createMarkup)(styles);
        css += options.pretty ? '.' + className + ' {\n' + markup.split(';').join(';\n') + '}\n' : '.' + className + '{' + markup + '}';
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
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
    var stylesheet = arguments.length <= 0 || arguments[0] === undefined ? globalStylesheet : arguments[0];

    stylesheet.clear();
    return !stylesheet.size;
  },

  Map: Map,

  __stylesheet: globalStylesheet
};
module.exports = exports['default'];
