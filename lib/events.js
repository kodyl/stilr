import stilr from './index';

import create from 'lodash.create';
import EventEmitter from 'emmett';

const emitter = new EventEmitter();

export default create(stilr, {
  create(styles, stylesheet = stilr.__stylesheet) {
    var rtn = stilr.create(styles, stylesheet);
    emitter.emit('update');
    return rtn;
  },
  on(...args) {
    emitter.on(...args);
  }
});
