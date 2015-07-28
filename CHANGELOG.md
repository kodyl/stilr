# Changelog

> **Tags:**
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]

_Note: Gaps between patch versions are faulty/broken releases._

## 1.2.1
  * Feature
    * Exposes the Map class that's used internally to create
      stylesheet.
      Usage: `import Stylesheet from 'stilr'` `Stylesheet.Map`
  * Bug
    * Fixed stylesheet instanceof check

## 1.1.0
  * __Internal__
    * Added babel-runtime as a dependency.

## 1.0.0
__Yeah, 1.0.0!__
The Api have been solidified, It's used in production, there's good test
coverage, let's :shipit: !

  * __Feature__
    * It's now possible to use pseudo selectors inside media queries.

## 0.3.0
  * __Internal__
    * Media queries are now inserted after normal CSS
    * Null and empty classes are now removed from rendered CSS

## 0.2.2
  * __Bug Fix__
    * Media queries are now inserted after parent entry. Thanks @MicheleBertoli
      !
    * New entries in existing media queries don't overwrite existing entries

## 0.2.0

 * **Internal**
  * Implemented extentedToString, now we have even shorter class names!

## 0.1.0

 * **Internal**
  * createHash was split into 3 helpers. `createHash`, `stringifyObject`, `createClassName`
  * Optimized stringifyObject.
  * renamed normalizeObj to sortObject.


## 0.0.1

  * Initial Release
