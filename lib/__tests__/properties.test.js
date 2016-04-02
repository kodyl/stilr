import assert from 'assert';
import {
  isPropertyUnitfull
} from '../properties';

describe('#isPropertyUnitfull', () => {
  it('font-size isn\'t unitless', () => {
    assert(isPropertyUnitfull('fontSize'))
  });

  it('opacity is unitless', () => {
    assert(!isPropertyUnitfull('opacity'))
  });
});

