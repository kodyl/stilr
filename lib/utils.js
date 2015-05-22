import { createMarkupForStyles } from 'react/lib/CSSPropertyOperations';

export function normalizeObj(obj) {
  return Object.keys( obj )
    .sort()
    .reduce( (acc, key) => {
      const val = obj[key];
      if ( val || val === 0 ) acc[key] = val;
      return acc;
    }, {});
}

export function createHash(obj) {
  const str = [ for (key of Object.keys(obj)) obj[key] ].join('');
  let hash = 5381;
  let i = str.length;
  if (i === 0) return 0;

  while (i)
    hash = (hash * 33) ^ str.charCodeAt(--i);

  return '_' + ( hash >>> 0 ).toString(36);
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
      let hash = createHash( normalizeObj( style ));
      acc.pseudos.push(entry);
      acc.style[entry] = hash;
      return acc;
    }

    if ( isMediaQuery( entry, style ) ) {
      let hash = createHash( normalizeObj( style ));
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
