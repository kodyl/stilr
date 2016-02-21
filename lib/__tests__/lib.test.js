// Use plain old commonjs require to ensure it works everywhere...
const StyleSheet = require('../');
import assert from 'assert';
import { parse } from 'css' ;
import * as style from './fixtures';

const unique = arr => [...new Set(arr)];
const values = obj => Object.keys(obj).map( key => obj[key] );

describe('stilr', () => {
  it('exports the Map class used for making stylesheets', () => {
    assert.ok(StyleSheet.Map)
  });

  describe('#create(obj)', () => {
    beforeEach(() => {
      StyleSheet.clear();
    });

    it('contains create method', () => {
      assert.equal(typeof StyleSheet.create, 'function')
    });


    it('creates an entry in the stylesheet', () => {
      const entries = Object.keys(style.basic);
      StyleSheet.create(style.basic);
      assert.equal(
        StyleSheet.__stylesheet.size,
        entries.length
      );
    });

    it('returns an object', () => {
      const styles = StyleSheet.create(style.basic);
      assert.equal( typeof styles, 'object' );
    });

    it('has the same keys', () => {
      const keys = Object.keys( StyleSheet.create(style.basic) );
      const originalKeys = Object.keys( style.basic );

      assert.equal(
        keys.join(''),
        originalKeys.join('')
      );
    });

    it('assigns the same class name to duplicate styles', () => {
      const styles = StyleSheet.create( style.duplicates );
      const classNames = Object.keys( styles );

      classNames.map(
        className => assert.equal( styles[classNames[0]], styles[className] )
      );
    });

    it('handles pseudo classes', () => {
      const styles = StyleSheet.create( style.pseudos );
      assert.equal(
        unique( values(styles) ).length,
        Object.keys(styles).length,
        `All classnames should be unique: .${ values( styles ).join(' .') }`
      );
    });

    it('handles media queries', () => {
      const styles = StyleSheet.create( style.mediaQueries );

      assert.equal(
        unique( values(styles) ).length,
        Object.keys(styles).length,
        `All classnames should be unique: .${ values( styles ).join(' .') }`
      );
    });

    it('accepts a alternative stylesheet', () => {
      const altStylesheet = new Map();
      const entries = Object.keys(style.basic);
      StyleSheet.create( style.basic, altStylesheet );

      StyleSheet.create(style.basic);
      assert.equal(
        altStylesheet.size,
        entries.length
      );

      assert.notEqual(
        altStylesheet,
        StyleSheet.__stylesheet
      );
    });

    it('assigns unique class names', () => {
      const uniqueStyles = StyleSheet.create({
        unique1: {
          justifyContent: 'center'
        },
        unique2: {
          alignItems: 'center'
        },
        unique3: {
          textAlign: 'center'
        },
        unique4: {
          color: 'red',
          ':hover': {
            color: 'green'
          }
        },
        unique5: {
          color: 'red',
          ':active': {
            color: 'green'
          }
        }
      });
      const keys = Object.keys(uniqueStyles);
      const classes = unique( values(uniqueStyles) );

      assert.equal(
        keys.length,
        classes.length
      );
    });

  });

  describe('#render()', () => {
    beforeEach(() => {
      StyleSheet.clear();
    });

    it('contains render method', () => {
      assert.equal(typeof StyleSheet.render, 'function')
    });

    it('returns a string', () => {
      StyleSheet.create(style.basic);
      const stylesheet = StyleSheet.render();
      assert.equal( typeof stylesheet, 'string' );
    });

    it('is parseable css', () => {
      StyleSheet.create(style.basic);
      const parsedCss = parse( StyleSheet.render() );
      assert.ok( parsedCss );

      const renderedClassNames = parsedCss.stylesheet.rules.map( rule => rule.selectors[0] );

      for ( let className of StyleSheet.__stylesheet.keys() ) {
        assert.ok( !!~renderedClassNames.indexOf( `.${ className }` ), `.${ className } should be part of the rendered css classes: '${ renderedClassNames }'`);
      }
    });

    it('outputs pseudo classes correctly', () => {
      const hover = /(\._[\s\S]+)(:hover{)/g;

      StyleSheet.create({
        style: {
          color: 'tomato',
          ':hover': {
            color: 'red'
          }
        }
      });

      const css = StyleSheet.render();
      assert.ok(
        css.match(hover).length === 1
      );
    });

    it('outputs media queries correctly', () => {
      const breakpoint = '@media (max-width: 600px)';
      const mediaQueryStyles = {
        style1: {
          color: 'blue',
          [breakpoint]: {
            color: 'red'
          }
        },
        style2: {
          color: 'green',
          [breakpoint]: {
            color: 'blue'
          }
        }
      };

      StyleSheet.create(mediaQueryStyles);

      const css = StyleSheet.render();
      const rules = parse(css).stylesheet.rules;
      assert.equal(rules[0].type, 'rule', 'Rule should be before media queries');
      assert.equal(rules[2].type, 'media');
      assert.equal(rules[2].media, breakpoint.replace('@media ', ''));

      const mediaQueryContent = rules[2].rules;
      assert.equal(
        mediaQueryContent.length, 2,
        'Media query should contain two rules'
      );

      const mediaQueryStyleEntry1 = mediaQueryContent[0].declarations[0];
      assert.equal(
        mediaQueryStyleEntry1.value,
        mediaQueryStyles.style1[breakpoint][mediaQueryStyleEntry1.property]
      );

      const mediaQueryStyleEntry2 = mediaQueryContent[1].declarations[0];
      assert.equal(
        mediaQueryStyleEntry2.value,
        mediaQueryStyles.style2[breakpoint][mediaQueryStyleEntry2.property]
      );
    });

    it('should not output empty styles', () => {
      const breakpoint = '@media (max-width: 600px)';
      const emptyStyles = StyleSheet.create({
        beforeBreakpoint: {
          [breakpoint]: {
            color: 'red'
          }
        },
        withEmptyPseudo: {
          color: 'red',
          ':hover': {}
        },
        all: {}
      });

      const css = StyleSheet.render();
      const parsedCss = parse(css);

      assert.equal(
        emptyStyles.all, '',
        'should return empty class string when style is empty'
      );
      assert.equal(
        parsedCss.stylesheet.rules.length, 2,
        'stylesheet should contain two rules'
      );
      assert.equal(
        parsedCss.stylesheet.rules[1].rules.length, 1,
        '[beforeBreakpoint]-media-query should contain one rule'
      );
    });

    it('handles nested pseudo selectors in media queries', () => {
      const breakpoint = '@media (max-width: 600px)';
      const styles = {
        base: {
          color: 'red',
          ':hover': {
            color: 'blue'
          },
          ':active': {
            color: 'papayawhip'
          },
          [breakpoint]: {
            color: 'orange',
            ':hover': {
              color: 'green'
            },
            ':active': {
              color: 'tomato'
            }
          }
        }
      };

      StyleSheet.create(styles);
      const css = StyleSheet.render({ pretty: true });
      const { rules } = parse(css).stylesheet;


      assert.equal(rules[0].declarations[0].value, styles.base.color);
      assert.equal(rules[1].declarations[0].value, styles.base[':hover'].color);
      assert.equal(rules[2].declarations[0].value, styles.base[':active'].color);

      // Media Query
      assert.equal(rules[3].type, 'media');
      const mediaRules = rules[3].rules;
      assert.equal(mediaRules[0].declarations[0].value, styles.base[breakpoint].color);
      assert.equal(mediaRules[1].declarations[0].value, styles.base[breakpoint][':hover'].color);
      assert.equal(mediaRules[2].declarations[0].value, styles.base[breakpoint][':active'].color);
    });

    it('handles values as arrays', () => {
      const styles = {
        base: {
          boxShadow: [
            '1px 1px black',
            '0 0 5px red'
          ]
        }
      };
      StyleSheet.create(styles);

      const css = StyleSheet.render({ pretty: true });
      const { rules } = parse(css).stylesheet;
      assert.equal(rules[0].declarations[0].value, styles.base.boxShadow.join(','));
    });
  });


  describe('#clear()', () => {
    beforeEach(() => {
      StyleSheet.clear();
    });

    it('contains clear method', () => {
      assert.equal(typeof StyleSheet.clear, 'function')
    });

    it('clears the stylesheet store', () => {
      StyleSheet.create(style.basic);
      assert.equal(StyleSheet.clear(), true);
      assert.equal(StyleSheet.__stylesheet.size, 0);
    });
  });
});
