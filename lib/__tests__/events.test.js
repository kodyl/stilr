const TEST_EVENTS = process.env.TEST_EVENTS == 1;

import StyleSheet from '../events';

if (TEST_EVENTS) {

  describe('stilr', () => {
    it('emits "update" every time create() is invoked / listens', (done) => {
      const specialColorCode = '#a339d2';

      StyleSheet.on('update', () => {
        const newCSS = StyleSheet.render();
        if (newCSS.indexOf(specialColorCode) !== -1) {
          done();
        }
      });
      StyleSheet.create({x: {color: specialColorCode}});
    });
  });

}
