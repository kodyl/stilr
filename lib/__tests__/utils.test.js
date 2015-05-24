import assert from 'assert';
import * as utils from '../utils';

describe('utils', () => {

  describe('.sortObject(obj)', () => {
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
  const HASH_NUM = utils.createHash(utils.stringifyObject( STYLES ));

  describe('.createClassName(obj)', () => {
    const hashString = utils.createClassName( STYLES );

    it('retuns string', () => {
      assert.equal( typeof hashString, 'string', `${ hashString } , should be string`);
    });

    it('is really a base36 number with a lodash prepended...', () => {
      assert.equal(
        parseInt( hashString.replace('_', ''), 36 ),
        HASH_NUM
      );
    });
  });

  describe('.createMarkup(obj)', () => {
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
