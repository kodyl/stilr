import assert from 'assert';
import * as utils from '../utils';

describe('utils', () => {

  describe('.normalizeObj(obj)', () => {
    it('removes falsy', () => {
      const fixture = {
        truthy: '.',
        zero: 0,
        nany: NaN,
        nully: null,
        falsy: false,
        undefiny: undefined
      };

      const normalized = utils.normalizeObj( fixture );

      assert.equal(
        JSON.stringify( normalized ),
        JSON.stringify( { truthy: '.', zero: 0 } )
      );
    });

    it('returns objects sorted by key', () => {
      const obj1 = { a: '.', b: '.', c: '.', d: '.' };
      const obj2 = { d: '.', c: '.', b: '.', a: '.' };

      const normalized1 = utils.normalizeObj( obj1 );
      const normalized2 = utils.normalizeObj( obj2 );

      assert.equal(
        Object.keys( normalized1 ).join(''),
        Object.keys( normalized2 ).join('')
      );
    });
  });

  const STYLES = {
    width: 10,
    height: 10,
    color: 'tomato'
  };
  const STYLES_CSS = 'width:10px;height:10px;color:tomato;';
  const HASH_NUM = 3183006313;

  describe('.createHash(obj)', () => {
    const hashString = utils.createHash( STYLES );

    it('retuns string', () => {
      assert.equal( typeof hashString, 'string', `${ hashString } , should be string`);
    });

    it('is really a base36 number', () => {
      assert.equal(
        parseInt( hashString, 36 ),
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
