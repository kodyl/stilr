import {
  sortObject,
  createClassName,
  createMarkup,
  seperateStyles,
  isEmpty,
} from './utils';

import EventEmitter from 'emmett';

const emitter = new EventEmitter();

let globalStylesheet = new Map();

export default {
  create( styles, stylesheet = globalStylesheet ) {
    if ( !(stylesheet instanceof Map) ) throw new Error(`${ stylesheet } should be a Map`);

    var rtn = Object.keys( styles ).reduce( ( acc, key ) => {

      let { style, pseudos, mediaQueries } = seperateStyles( styles[key] );
      const className = createClassName( sortObject( style ));

      if (className === undefined) {
        acc[ key ] = '';
        return acc;
      }

      if ( !stylesheet.has( className ) )
        stylesheet.set( className, style );

      if ( pseudos.length ) {
        pseudos.map( selector => {
          delete style[selector];
          const pseudoClassName = `${className}${selector}`;

          if ( stylesheet.has( pseudoClassName ) ) return false;

          stylesheet.set( pseudoClassName, styles[key][selector] );
        });
      }

      if ( mediaQueries.length ) {
        mediaQueries.map( selector => {
          let mqSelector = selector;
          let mqStyles = styles[key][selector];
          let mqPseudos = [];
          let mqStylesheet;

          if ( Array.isArray(selector) ) {
            let [ main, styles, ...rest ] = selector;
            mqSelector = main;
            mqPseudos = rest;
            mqStyles = styles;
          }

          delete style[mqSelector];


          if ( stylesheet.has( mqSelector ) ) {
            mqStylesheet = stylesheet.get( mqSelector );

            if ( mqStylesheet.has( className )) return false;
          }

          mqStylesheet = mqStylesheet
            || stylesheet.set( mqSelector, new Map() ).get( mqSelector );

          mqStylesheet.set( className, mqStyles );

          if ( mqPseudos.length ) {
            mqPseudos.map( pseudo => {
              delete mqStyles[pseudo];
              const pseudoClassName = `${className}${pseudo}`;

              if ( mqStylesheet.has( pseudoClassName ) ) return false;
              mqStylesheet.set( pseudoClassName, styles[key][mqSelector][pseudo] );
            });
          }
        });
      }

      acc[ key ] = className;
      return acc;
    }, {});

    // Make sure this emitting step comes after the above stylesheet parsing
    // step completes.
    // Otherwise, when users access things like #render() inside the event
    // callback, they may not get the newest stylesheet.
    emitter.emit('update');

    return rtn;
  },

  render(options = { pretty: false }, stylesheet = globalStylesheet ) {
    const stylesheetEntries = stylesheet.entries();
    let css = '';
    let mediaQueries = '';

    for ( let entry of stylesheetEntries ) {
      const [ className, styles ] = entry;
      const isMap = styles instanceof Map;

      if (!isMap && isEmpty(styles)) continue;

      if (isMap) {
        const mediaQueryCSS = this.render(options, stylesheet.get( className ) );
        mediaQueries += options.pretty
          ? `${ className } {\n${ mediaQueryCSS }}\n`
          : `${ className }{${ mediaQueryCSS }}`;
        continue;
      }

      const markup = createMarkup( styles );
      css += options.pretty
        ? `.${ className } {\n${ markup.split(';').join(';\n')}}\n`
        : `.${ className }{${ markup }}`;
    }

    return css + mediaQueries;
  },

  clear( stylesheet = globalStylesheet ) {
    stylesheet.clear();
    return !stylesheet.size;
  },

  on(...args) {
    emitter.on(...args);
  },

  Map,

  __stylesheet: globalStylesheet
};
