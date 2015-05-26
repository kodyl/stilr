# Stilr [![Build Status](https://travis-ci.org/chriskjaer/stilr.svg)](https://travis-ci.org/chriskjaer/stilr) [![npm version](https://badge.fury.io/js/stilr.svg)](http://badge.fury.io/js/stilr)

Encapsulated styling for your javascript components with all the power of
javascript and CSS combined.

- Unique class names
- Useable on the server
- Allows nested pseudo selectors
- Allows nested media queries
- No namespacing / Class name collisions.

...oh, and did I mention you get duplicate style elimination for free?

## API

#### `object StyleSheet.create(object spec)`
Stilr extracts the styles from the style object and returns an object with the
same keys mapped to class names.

__Example__
```javascript
import StyleSheet from 'stilr';

const palm = '@media screen and (max-width:600px)';

const styles = StyleSheet.create({
  container: {
    color: '#fff',
    ':hover': {                 // Pseudo Selectors are allowed
      color: '#000'
    },
    [palm]: {                   // Media Queries are allowed
      fontSize: 16
    }
  }
});

console.log(styles.container);  // => '_xsrhhm' -- (The class name for this style.)
```

#### `string StyleSheet.render()`
Stilr outputs the contents of its internal stylesheet as a string of css

__Example__
```javascript
import StyleSheet from 'stilr';

StyleSheet.create({
  container: {
    color: '#fff'
  }
});

const CSS = StyleSheet.render();

console.log(CSS);             // => '._yiw79c{color:#fff;}'
```

#### `bool StyleSheet.clear()`
Clear Stilr internal stylesheet

__Example__
```javascript
import StyleSheet from 'stilr';

const styles = StyleSheet.create({
  container: {
    color: '#fff'
  }
});

StyleSheet.clear();

const CSS = StyleSheet.render();

console.log(CSS);             // => ''
```


## Examples

#### Basic Button Component Example.
Let's start of by creating our styles. If you have ever used React Native, this
will be familiar to you:

```javascript
import StyleSheet from 'stilr';
import { palm } from './breakpoints';
import { color, font } from './theme';

const styles = StyleSheet.create({
  base: {
    transition: 'background-color .25s',
    borderRadius: 2,
    textAlign: 'center',
    fontSize: 20,
    padding: 6,
    color: '#fff',
    border: `${ color.border } 1px solid`,
    [palm]: {
      fontSize: 18
    }
  },
  primary: {
    backgroundColor: color.primary,
    ':hover': {
      color: 'tomato'
    }
  },
  secondary: {
    backgroundColor: 'tomato',
    color: '#eee'
  }
});
```

Stilr will now generate a set of class names based on the content of your styles
and return an object with the same keys mapped to those classes.

Note that you're able to use pseudo selectors and media queries.
Pseudo selectors are written like you normally would in CSS, e.g.: `:hover`, `:active`,
`:before` etc.
Media queries are the same, e.g. `palm` in the example is just a string: `@media screen and (max-width:600px)`. Any valid media query is allowed.

Since we just have a bunch of class names now, we can use these in our React
Component.

```javascript
import React, { PropTypes } from 'react';

class Button extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(['primary', 'secondary'])
  }

  render() {
    const { type, children } = this.props;
    const buttonStyles = [
      styles.base,
      styles[ type ]
    ].join(' ');

    return (
      <button className={ buttonStyles }>
        { children }
      </button>
    );
}
```

Next up, let's render our css and mount our app:

```javascript
import React from 'react';
import Button from './button';
import StyleSheet from 'stilr';

React.render(
  <Button type='primary' />,
  document.getElementById('root')
);

document.getElementById('stylesheet').textContent = StyleSheet.render();
```

This step could also have been done on the server. Since StyleSheet.render just
returns a string of css. In our case, it would look something like this in a
prettified version:
```css
@media screen and (max-width:600px) {
  ._82uwp6 {
    font-size: 18px;
  }
}

._82uwp6 {
  transition: background-color .25s;
  border-radius: 2px;
  text-align: center;
  font-size: 20px;
  padding: 6px;
  color: #fff;
  border: #fff 1px solid;
}

._11jt6vs:hover {
  color: tomato;
}

._11jt6vs {
  background-color: red;
}

._1f4wq27 {
  background-color: tomato;
  color: #eee;
}
```

In case you were wondering: Yes, this would would be an ideal place to add something like autoprefixer, minification etc.


## Duplicate Style Elimation
```javascript
import StyleSheet from 'stilr';

const styles = StyleSheet.create({
  same: {
    fontSize: 18,
    color: '#000'
  },
  sameSame: {
    fontSize: 18,
    color: '#000'
  }
});

console.log( styles.same );        => '_1v3qejj'
console.log( styles.sameSame );    => '_1v3qejj'
```

...magic.

Under the hood, stilr creates class names based on a content hash of your style object
which means that when the content is the same, the same hash will always be
returned. 


## Extracting your styles.

#### Server
If you do serverside rendering, you should be able to extract your styles right after you load your app.

```javascript
import React from 'react';
import StyleSheet from 'stilr';
import App from '../your-app.js';

const css = StyleSheet.render();
const html = React.renderToStaticMarkup(<App />);

// Extract css to a file or insert it in a file at the top of your html document
```
Apply autoprefixer here, or other preprocess goodness here. 
If you're really fancy, you only do the required autoprefixes based on the user agent.

#### Makefile
```Makefile
extract-styles:
	@node -p "var s = require('stilr'); require('./your-app.js'); s.render()" >> ./build/styles.css
```

#### Webpack
Not implemented yet. Contributions are welcome!

## TODO:
- [ ] Removed React as a dependency
- [ ] More examples

