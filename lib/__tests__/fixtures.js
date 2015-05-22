
export const basic = {
  style1: {
    color: 'tomato',
    fontSize: '1em'
  },
  style2: {
    color: 'purple',
    backgroundColor: 'papayawhip'
  }
};

export const duplicates = {
  style1: {
    width: 10,
    height: 10
  },
  style2: {
    height: 10,
    width: 10,
    border: null
  },
  style3: {
    border: false,
    height: 10,
    width: 10
  },
  style4: {
    height: 10,
    border: undefined,
    width: 10
  }
};

export const pseudos = {
  style1: {
    border: 1
  },
  style2: {
    border: 1,
    ':hover': {
      color: 'tomato'
    }
  },
  style3: {
    border: 1,
    ':active': {
      color: 'purple'
    }
  }
};

export const mediaQueries = {
  initial: {
    style1: {
      color: 'red',
      ['@media (max-width: 600px)']: {
        color: 'blue'
      }
    },
    style2: {
      color: 'red',
      ['@media (max-width: 600px)']: {
        color: 'green'
      }
    }
  },
  expected: ''
};
