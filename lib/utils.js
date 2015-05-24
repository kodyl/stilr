import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations';

export function sortObject(obj) {
  return Object.keys( obj )
    .sort()
    .reduce( (acc, key) => {
      const val = obj[key];
      if ( val || val === 0 ) acc[key] = val;
      return acc;
    }, {});
}

export function createHash(str) {
  let i = str.length;
  if (i === 0) return 0;

  let hash = 5381;
  while (i)
    hash = (hash * 33) ^ str.charCodeAt(--i);

  return hash >>> 0;
}

export function stringifyObject(obj) {
  const keys = Object.keys(obj);
  let str = '';

  for (let i = 0, len = keys.length; i < len; i++) {
    str += keys[i] + obj[keys[i]];
  }

  return str;
}

export function createClassName(obj) {

  return '_' + createHash( stringifyObject(obj) ).toString(36);
}

export function createMarkup(obj) {
  return createMarkupForStyles( obj );
}


function isPseudo(key, val) {
  return key.charAt(0) === ':' && typeof val === 'object';
}

function isMediaQuery(key, val) {
  return key.charAt(0) === '@' && typeof val === 'object';
}

export function seperateStyles (styles) {
  return Object.keys(styles).reduce( (acc, entry) => {
    const style = styles[entry];

    if ( isPseudo( entry, style ) ) {
      let hash = createClassName( sortObject( style ));
      acc.pseudos.push(entry);
      acc.style[entry] = hash;
      return acc;
    }

    if ( isMediaQuery( entry, style ) ) {
      let hash = createClassName( sortObject( style ));
      acc.mediaQueries.push( entry );
      acc.style[entry] = hash;
      return acc;
    }

    acc.style[entry] = style;
    return acc;
  }, {
    style: {},
    pseudos: [],
    mediaQueries: []
  });
}
