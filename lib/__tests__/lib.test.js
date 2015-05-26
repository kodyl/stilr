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
      const media = /(@media[\s\S]\([\s\S]+\){._)/g;
      StyleSheet.create({
        style: {
          color: 'blue',
          '@media (max-width: 600px)': {
            color: 'red'
          }
        }
      });

      const CSS = StyleSheet.render();
      const rules = css.parse(CSS).stylesheet.rules;
      assert.ok(
        CSS.match(media).length === 1
      );
      assert.equal(rules[0], 'rule', 'Rule should be before media queries');
      assert.equal(rules[1], 'media');
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
