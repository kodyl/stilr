import { isPropertyUnitfull } from './properties';

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
  const hash = extendedToString( createHash( stringifyObject(obj) ), 62);
  return hash
    ? '_' + hash
    : undefined;
}

export function isEmpty(obj) {
  return !Object.keys(obj).length;
}

export function isPseudo({ style, rule }) {
  return rule.charAt(0) === ':' && typeof style === 'object';
}

export function isMediaQuery({ style, rule }) {
  return rule.charAt(0) === '@' && typeof style === 'object';
}

function handle(type, acc, { style, rule }, pseudos = []) {
  const hash = createClassName( sortObject( style ));
  const rules = pseudos.length
    ? [[].concat(rule, style, pseudos)]
    : rule;

  acc[type] = acc[type].concat(rules);
  acc.style[rule] = hash;
  return acc;
}


export function seperateStyles (styles) {
  return Object.keys(styles).reduce( (acc, rule) => {
    const content = {
      style: styles[rule],
      rule
    };

    if ( isPseudo( content ) ) {
      return handle('pseudos', acc, content );
    }

    if ( isMediaQuery( content ) ) {
      const { style, pseudos } = seperateStyles( content.style );
      return handle('mediaQueries', acc, { rule, style }, pseudos );
    }

    acc.style[rule] = content.style;
    return acc;
  }, {
    style: {},
    pseudos: [],
    mediaQueries: []
  });
}

const isNumber = (value) => !isNaN(value);

export const hyphenate = (stringToBeHyphenated) => {
  return stringToBeHyphenated
    .replace( /([a-z])([A-Z])/g, '$1-$2' )
    .toLowerCase();
};

export const createMarkup = (styleDeclaration = {}) => {
  const rules = Object.keys(styleDeclaration).map((cssProperty) => {
    const rawCssValue = styleDeclaration[cssProperty];
    const hyphenatedProperty = hyphenate(cssProperty);

    let cssValue = rawCssValue;

    if(isNumber(cssValue) && isPropertyUnitfull(hyphenatedProperty)) {
      cssValue += 'px';
    }

    if(cssValue.trim) {
      cssValue = cssValue.trim();
    }

    return `${hyphenatedProperty}:${cssValue};`;
  });
  return rules.join('');
};
