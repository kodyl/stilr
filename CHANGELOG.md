# Changelog

> **Tags:**
> - [New Feature]
> - [Bug Fix]
> - [Breaking Change]
> - [Documentation]
> - [Internal]
> - [Polish]

_Note: Gaps between patch versions are faulty/broken releases._

## 0.3.0
  * Internal
    * Media queries are now inserted after normal CSS
    * Null and empty classes are now removed from rendered CSS

## 0.2.2
  * Bug Fix
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
