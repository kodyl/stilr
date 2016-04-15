'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var globalStylesheet = new _map2.default();

exports.default = {
  create: function create(styles) {
    var stylesheet = arguments.length <= 1 || arguments[1] === undefined ? globalStylesheet : arguments[1];

    if (!(stylesheet instanceof _map2.default)) throw new Error(stylesheet + ' should be a Map');

    return (0, _keys2.default)(styles).reduce(function (acc, key) {
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
          var mqStylesheet = void 0;

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

          mqStylesheet = mqStylesheet || stylesheet.set(mqSelector, new _map2.default()).get(mqSelector);

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
      for (var _iterator = (0, _getIterator3.default)(stylesheetEntries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var entry = _step.value;

        var className = entry[0];
        var styles = entry[1];
        var isMap = styles instanceof _map2.default;

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
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
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


  Map: _map2.default,

  __stylesheet: globalStylesheet
};
module.exports = exports['default'];
