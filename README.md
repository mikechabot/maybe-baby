# maybe-baby

[![Build Status](https://travis-ci.org/mikechabot/maybe-baby.svg?branch=master)](https://travis-ci.org/mikechabot/maybe-baby)
[![Coverage Status](https://coveralls.io/repos/github/mikechabot/maybe-baby/badge.svg?branch=master&cacheBuster=1)](https://coveralls.io/github/mikechabot/maybe-baby?branch=master)
[![Dependency Status](https://david-dm.org/mikechabot/maybe-baby.svg)](https://david-dm.org/mikechabot/maybe-baby)
[![devDependencies Status](https://david-dm.org/mikechabot/maybe-baby/dev-status.svg)](https://david-dm.org/mikechabot/maybe-baby?type=dev)

[![NPM](https://nodei.co/npm/maybe-baby.png)](https://nodei.co/npm/maybe-baby/)

* `maybe-baby` is the [Maybe monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad) implemented in JavaScript. 
* Credit to [James Sinclair](https://github.com/jrsinclair) for writing the must-read blogpost [The Marvellously Mysterious JavaScript Maybe Monad](http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/).

## Usage

Minimize defensive coding with `maybe-baby` when data is unreliable:

```javascript
import Maybe from 'maybe-baby';

// Create the monad
const foo = Maybe.of({ bar: { baz: 123 } });

if (foo.path('bar.baz').isJust()) {
  // Will enter
}

if (foo.path('bar.bar').isJust()) {
  // Will not enter
}

```

#### Use `isNothing` and `isJust` to determine whether the monad is `null` and/or `undefined`
```javascript
const noVal = Maybe.of(null);

noVal.join();         // null
noVal.isNothing();    // true
noVal.isJust();       // false

const someVal = Maybe.of(123);

someVal.join();         // 123
someVal.isNothing();    // false
someVal.isJust();       // true
```
#### Use `path`, `props`, or `prop` to get values at arbitrary depths

These functions serve the same ultimate purpose: to return a monad of the value at the specified path/location, however they each do it a bit differently. Keep in mind, these functions are chainable.

| Function | Description | Example 
| ----- | ---- | ----------- |
| `path(<string>)` | Period-delimited string path | `path('foo.bar.1')` |
| `props(...properties)` | Takes an indefinite list of arguments | `props('foo', 'bar', 1')` |
| `prop(<string\|number>)` | Takes a single argument | `prop('foo').prop('bar').prop(1)` |

```javascript
const deepObj = { foo: { bar: [123,456] } };

const deepVal = Maybe.of(deepObj);

// Prop function
deepVal.prop('foo').join();                       // { bar: [123,456] }
deepVal.prop('foo').prop('bar').join();           // [123,456]
deepVal.prop('foo').prop('bar').prop(1).join();   // 456

// Path function
deepVal.path('foo').join();                       // { bar: [123,456] }
deepVal.path('foo.bar').join();                   // [123,456]
deepVal.path('foo.bar.1').join();                 // 456

// Props function
deepVal.props('foo').join();                      // { bar: [123,456] }
deepVal.props('foo', 'bar').join();               // [123,456]
deepVal.props('foo', 'bar', 1).join();            // 456
```

## Installation

Install with yarn or npm:

* `$ npm install --save maybe-baby`
* `$ yarn add maybe-baby`
