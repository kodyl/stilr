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

const SYMBOL_SET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export function extendedToString(num, base) {
  let conversion = '';

  if (base > SYMBOL_SET.length || base <= 1 || !Number.isInteger(base))
    throw new Error(`${base} should be an integer between 1 and ${SYMBOL_SET.length}`);

  while (num >= 1) {
    conversion = SYMBOL_SET[(num - (base * Math.floor(num / base)))] + conversion;
    num = Math.floor(num / base);
  }

  return (base < 11) ? parseInt(conversion) : conversion;
}

export function createClassName(obj) {
  return '_' + extendedToString( createHash( stringifyObject(obj) ), 62);
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
