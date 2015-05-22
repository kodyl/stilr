import {
  normalizeObj,
  createHash,
  createMarkup,
  seperateStyles
} from './utils';

let globalStylesheet = new Map();

export default {
  create( styles ) {
    return Object.keys( styles ).reduce( ( acc, key ) => {

      let { style, pseudos, mediaQueries } = seperateStyles( styles[key] );
      const className = createHash( normalizeObj( style ));

      if ( pseudos.length ) {
        pseudos.map( selector => {
          const pseudoClassName = `${className}${selector}`;
          delete style[selector]; // Remove selector. We don't need that in the stylesheet.

          if ( globalStylesheet.has( pseudoClassName ) ) return;

          globalStylesheet.set( pseudoClassName, styles[key][selector] );
        });
      }

      if ( mediaQueries.length ) {
        mediaQueries.map( selector => {
          delete style[selector]; // Remove selector. We don't need that in the stylesheet.
          if ( globalStylesheet.has( selector ) ) {
            if ( globalStylesheet.get( selector ).has( className )) return;

            globalStylesheet.get( selector ).set( className, styles[key][selector] );
          }

          globalStylesheet
            .set( selector, new Map() )
            .get( selector )
            .set( className, styles[key][selector] );
        });
      }

      if ( !globalStylesheet.has( className ) )
        globalStylesheet.set( className, style );

      acc[ key ] = className;
      return acc;
    }, {});
  },

  render(options = { pretty: false }, stylesheet = globalStylesheet ) {
    const stylesheetEntries = stylesheet.entries();
    let css = '';

    for ( let entry of stylesheetEntries ) {
      const [ className, styles ] = entry;

      if (styles instanceof Map) {
        const mediaQueryCSS = this.render(options, stylesheet.get( className ) );
        css += options.pretty
          ? `${ className } {\n${ mediaQueryCSS }}\n`
          : `${ className }{${ mediaQueryCSS }}`;
        continue;
      }

      const markup = createMarkup( styles );
      css += options.pretty
        ? `.${ className } {\n${ markup.split(';').join(';\n')}}\n`
        : `.${ className }{${ markup }}`;
    }

    return css;
  },

  clear() {
    globalStylesheet.clear();
    return !globalStylesheet.size;
  },

  __stylesheet: globalStylesheet
};
