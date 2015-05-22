import StyleSheet from '../lib';
import React from 'react';

const { palm, lap, desk } = {
  palm: '@media screen and (max-width:600px)',
  lap: '@media screen and (min-width:601px)and (max-width:959px)',
  desk: '@media screen and (min-width:960px)'
};

class Block extends React.Component {
  render() {
    return (
      <div>
      </div>
    );
  }
}

export default Block;
