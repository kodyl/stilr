import {
  sortObject,
  createClassName,
  createMarkup,
  seperateStyles
} from './utils';

let globalStylesheet = new Map();

export default {
  create( styles, stylesheet = globalStylesheet ) {
    if ( !stylesheet instanceof Map ) throw new Error(`${ stylesheet } should be a Map`);

    return Object.keys( styles ).reduce( ( acc, key ) => {

      let { style, pseudos, mediaQueries } = seperateStyles( styles[key] );
      const className = createClassName( sortObject( style ));

      if ( !stylesheet.has( className ) )
        stylesheet.set( className, style );

      if ( pseudos.length ) {
        pseudos.map( selector => {
          const pseudoClassName = `${className}${selector}`;
          delete style[selector]; // Remove selector. We don't need that in the stylesheet.

          if ( stylesheet.has( pseudoClassName ) ) return false;

          stylesheet.set( pseudoClassName, styles[key][selector] );
        });
      }

      if ( mediaQueries.length ) {
        mediaQueries.map( selector => {
          delete style[selector]; // Remove selector. We don't need that in the stylesheet.
          if ( stylesheet.has( selector ) ) {
            if ( stylesheet.get( selector ).has( className )) return false;

            return stylesheet.get( selector ).set( className, styles[key][selector] );
          }

          stylesheet
            .set( selector, new Map() )
            .get( selector )
            .set( className, styles[key][selector] );
        });
      }

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

  clear( stylesheet = globalStylesheet ) {
    stylesheet.clear();
    return !stylesheet.size;
  },

  __stylesheet: globalStylesheet
};
