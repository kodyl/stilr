import assert from 'assert';
import {
  isPropertyUnitless,
  isPropertyUnitfull
} from '../properties';

describe('#isPropertyUnitless', () => {
  it('font-size isn\'t unitless', () => {
    assert(!isPropertyUnitless('fontSize'))
  });

  it('opacity is unitless', () => {
    assert(isPropertyUnitless('opacity'))
  });
});

describe('#isPropertyUnitfull', () => {
  it('font-size isn\'t unitless', () => {
    assert(isPropertyUnitfull('fontSize'))
  });

  it('opacity is unitless', () => {
    assert(!isPropertyUnitfull('opacity'))
  });
});

