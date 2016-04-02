import assert from 'assert';
import * as utils from '../utils';

describe('utils', () => {
  describe('#hyphenateStyleName', () => {
    it('hyphanates fontSize', () => {
      const hyphenatedStyleName = utils.hyphenate('fontSize');
      assert.equal(hyphenatedStyleName, 'font-size');
    });

    it('doesn\'t hyphenates opacity', () => {
      const hyphenatedStyleName = utils.hyphenate('opacity');
      assert.equal(hyphenatedStyleName, 'opacity');
    });

    it('doesn\'t hyphenates already hyphanated property', () => {
      const hyphenatedStyleName = utils.hyphenate('font-size');
      assert.equal(hyphenatedStyleName, 'font-size');
    });

    it('supports vendor prefixes', () => {
      const hyphenatedStyleName = utils.hyphenate('-moz-opacity');
      assert.equal(hyphenatedStyleName, '-moz-opacity');
    });
  });

  describe('#createMarkup', () => {
    it('creates markup', () => {
      const markup = utils.createMarkup({opacity: 0});
      assert.equal(markup, 'opacity:0;')
    });

    it('creates hyphenate css property', () => {
      const markup = utils.createMarkup({fontSize: '10px'});
      assert.equal(markup, 'font-size:10px;')
    });

    it('trims property value', () => {
      const markup = utils.createMarkup({fontSize: ' 10px '});
      assert.equal(markup, 'font-size:10px;')
    });

    it('converts numbers to px values', () => {
      const markup = utils.createMarkup({fontSize: 10});
      assert.equal(markup, 'font-size:10px;');
    });

    it('creates no markup for empty object', () => {
      const markup = utils.createMarkup({});
      assert.equal(markup, '')
    });

    it('creates no markup for undefined styles', () => {
      const markup = utils.createMarkup(undefined);
      assert.equal(markup, '')
    });
  });

  describe('#sortObject(obj)', () => {
    it('removes falsy', () => {
      const fixture = {
        truthy: '.',
        zero: 0,
        nany: NaN,
        nully: null,
        falsy: false,
        undefiny: undefined
      };

      const sorted = utils.sortObject( fixture );

      assert.equal(
        JSON.stringify( sorted ),
        JSON.stringify( { truthy: '.', zero: 0 } )
      );
    });

    it('returns objects sorted by key', () => {
      const obj1 = { a: '.', b: '.', c: '.', d: '.' };
      const obj2 = { d: '.', c: '.', b: '.', a: '.' };

      const sorted1 = utils.sortObject( obj1 );
      const sorted2 = utils.sortObject( obj2 );

      assert.equal(
        Object.keys( sorted1 ).join(''),
        Object.keys( sorted2 ).join('')
      );
    });
  });

  const STYLES = {
    width: 10,
    height: 10,
    color: 'tomato'
  };
  const STYLES_CSS = 'width:10px;height:10px;color:tomato;';

  describe('#createClassName(obj)', () => {
    const className = utils.createClassName( STYLES );

    it('retuns a class string', () => {
      assert.equal( typeof className, 'string', `${ className } , should be string`);
      assert.equal( className.charAt(0), '_' );
    });
  });

  describe('#createMarkup(obj)', () => {
    const markup = utils.createMarkup( STYLES );

    it('returns a css string', () => {
      assert.equal( typeof markup, 'string', `${ markup } , should be string`);
      assert.equal(
        markup,
        STYLES_CSS
      );
    });

  });
});
