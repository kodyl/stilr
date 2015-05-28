import assert from 'assert';
import StyleSheet from '../';
import css from 'css' ;
import * as style from './fixtures';

const unique = arr => [...new Set(arr)];
const values = obj => Object.keys(obj).map( key => obj[key] );

describe('stilr', () => {

  describe('#create(obj)', () => {
    beforeEach(() => {
      StyleSheet.clear();
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

    it('returns a string', () => {
      StyleSheet.create(style.basic);
      const stylesheet = StyleSheet.render();
      assert.equal( typeof stylesheet, 'string' );
    });

    it('is parseable css', () => {
      StyleSheet.create(style.basic);
      const parsedCss = css.parse( StyleSheet.render() );
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

      const CSS = StyleSheet.render();
      assert.ok(
        CSS.match(hover).length === 1
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

      const CSS = StyleSheet.render();
      const rules = css.parse(CSS).stylesheet.rules;
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
        mediaQueryStyles.style1[breakpoint][mediaQueryStyleEntry1.property],
      );

      const mediaQueryStyleEntry2 = mediaQueryContent[1].declarations[0];
      assert.equal(
        mediaQueryStyleEntry2.value,
        mediaQueryStyles.style2[breakpoint][mediaQueryStyleEntry2.property],
      );
    });
  });

  describe('#clear()', () => {
    beforeEach(() => {
      StyleSheet.clear();
    });

    it('clears the stylesheet store', () => {
      StyleSheet.create(style.basic);
      assert.equal(StyleSheet.clear(), true);
      assert.equal(StyleSheet.__stylesheet.size, 0);
    });
  });
});
