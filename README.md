[![Build Status](https://travis-ci.org/mikechabot/maybe-baby.svg?branch=master)](https://travis-ci.org/mikechabot/maybe-baby)
[![Coverage Status](https://coveralls.io/repos/github/mikechabot/maybe-baby/badge.svg?branch=master&cacheBuster=1)](https://coveralls.io/github/mikechabot/maybe-baby?branch=master)
[![Dependency Status](https://david-dm.org/mikechabot/maybe-baby.svg)](https://david-dm.org/mikechabot/maybe-baby)
[![devDependencies Status](https://david-dm.org/mikechabot/maybe-baby/dev-status.svg)](https://david-dm.org/mikechabot/maybe-baby?type=dev)

[![NPM](https://nodei.co/npm/maybe-baby.png)](https://nodei.co/npm/maybe-baby/)

# maybe-baby

`maybe-baby` is the [Maybe monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad) implemented in JavaScript. 
Credit to [James Sinclair](https://github.com/jrsinclair) for writing the must-read blogpost [The Marvellously Mysterious JavaScript Maybe Monad](http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/).

- [Docs](#docs)
- [Usage](#usage)
  - [isJust() / isNothing()](#isjust--isnothing)
  - [path(), prop(), props()](#props)
- [Installation](#installation)

## <a name="maybe-baby#docs">Docs</a>

* https://mikechabot.github.io/maybe-baby/

## <a name="maybe-baby#usage">Usage</a>

When data is unreliable, minimize defensive coding with `maybe-baby` :

```javascript
// Some data with missing values
const person = { 
  name: {
    first: 'John',
    last : null
  },
  accountDetails: {
    insuranceCode: 'BDX2321'
  }
};
```
It looks like we're missing the `address` attribute on the `accountDetails` object. That's too bad since we're in a situation where we need the `zipCode` of the `person`, which lives on the `address`. Accessing it via dot notation will result in a `TypeError` (i.e. `person.accountDetails.address.zipCode`). 

One way to solve the problem is to write in some null checks, but that doesn't scale well. Another would be to use [`_.get()`](https://lodash.com/docs/4.17.4#get) or something similar, but these libs may have larger footprints than `maybe-baby`, and most likely wouldn't be implementing the monadic structure.

Anyway, let's safely get the zip code. Although we're attempting to access properties on an undefined object, with `maybe-baby`, we're guaranteed to never encounter a `TypeError`:

```javascript
import Maybe from 'maybe-baby';

function getZipCode(person) {
  return Maybe.of(person)
    .prop('accountDetails')
    .prop('address')
    .prop('zipCode')
    .join();
}
```

### <a name="usage#isJust">isJust(), isNothing()</a>

Use `isNothing` and `isJust` to determine whether the monad is `null` and/or `undefined`

```javascript
const noVal = Maybe.of(null);
noVal.isNothing();  // true
noVal.isJust();     // false

const aVal = Maybe.of(123);
aVal.isNothing();  // false
aVal.isJust();     // true
```

### <a name="usage#props">path(), prop(), props()</a>

* Use `path`, `props`, or `prop` to get values at arbitrary depths
* These functions share the same purpose: to return value the specified path/location (wrapped in a monad), however they each do it a bit differently. Keep in mind, these functions are chainable:

| Function | Description | Example 
| ----- | ---- | ----------- |
| `path(<string>)` | Period-delimited string path | `path('foo.bar.1')` |
| `props(...properties)` | Takes an indefinite list of arguments | `props('foo', 'bar', 1)` |
| `prop(<string\|number>)` | Takes a single argument | `prop('foo').prop('bar').prop(1)` |

```javascript
const someDeepObj = { foo: { bar: [123, 456] } };
const maybeObj = Maybe.of(someDeepObj);
```

#### `prop(<string|number>)`
```javascript
maybeObj.prop('foo').join();                       // { bar: [123, 456] }
maybeObj.prop('foo').prop('bar').join();           // [123, 456]
maybeObj.prop('foo').prop('bar').prop(1).join();   // 456
```

#### `path(<string>)`
```javascript
maybeObj.path('foo').join();        // { bar: [123, 456] }
maybeObj.path('foo.bar').join();    // [123, 456]
maybeObj.path('foo.bar.1').join();  // 456
```

#### `path(<string|number>)`
```javascript
maybeObj.props('foo').join();           // { bar: [123, 456] }
maybeObj.props('foo', 'bar').join();    // [123, 456]
maybeObj.props('foo', 'bar', 1).join(); // 456
```

## <a name="maybe-baby#installation">Installation</a>

Install with yarn or npm:

* `$ npm install --save maybe-baby`
* `$ yarn add maybe-baby`
