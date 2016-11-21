/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

 // ExecutionEnvironment.js

 const canUseDOM = !!(
   typeof window !== 'undefined' &&
   window.document &&
   window.document.createElement
 );

 /**
  * Simple, lightweight module assisting with the detection and context of
  * Worker. Helps avoid circular dependencies and allows code to reason about
  * whether or not they are in a Worker, even if they never include the main
  * `ReactWorker` dependency.
  */
 export const ExecutionEnvironment = {

   canUseDOM: canUseDOM,

   canUseWorkers: typeof Worker !== 'undefined',

   canUseEventListeners:
     canUseDOM && !!(window.addEventListener || window.attachEvent),

   canUseViewport: canUseDOM && !!window.screen,

   isInWorker: !canUseDOM // For now, this is true - might change in the future.

 };


 // ---------------------

// hypenate.js

const _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}


// ---------------------

// hyphenateStyleName.js

const msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
export function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}


// ---------------------

// camelize.js

const _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(string) {
  return string.replace(_hyphenPattern, function(_, character) {
    return character.toUpperCase();
  });
}

// ---------------------

// camelizeStyleName.js

const dashMsPattern = /^-ms-/; // renamed from msPattern to avoid name conflict

/**
 * Camelcases a hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('background-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTransition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @param {string} string
 * @return {string}
 */
export function camelizeStyleName(string) {
  return camelize(string.replace(dashMsPattern, 'ms-'));
}


// ---------------------

// memoizeStringOnly.js

/**
 * Memoizes the return value of a function that accepts one string argument.
 */
export function memoizeStringOnly(callback) {
  const cache = {};
  return function(string) {
    if (!cache.hasOwnProperty(string)) {
      cache[string] = callback.call(this, string);
    }
    return cache[string];
  };
}


// ---------------------

// warning.js

export const warning = function(){};

// if (__DEV__) {
//   function printWarning(format, ...args) {
//     var argIndex = 0;
//     var message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++]);
//     if (typeof console !== 'undefined') {
//       console.error(message);
//     }
//     try {
//       // --- Welcome to debugging React ---
//       // This error was thrown as a convenience so that you can use this stack
//       // to find the callsite that caused this warning to fire.
//       throw new Error(message);
//     } catch (x) {}
//   }
//
//   warning = function(condition, format, ...args) {
//     if (format === undefined) {
//       throw new Error(
//         '`warning(condition, format, ...args)` requires a warning ' +
//         'message argument'
//       );
//     }
//     if (!condition) {
//       printWarning(format, ...args);
//     }
//   };
// }
