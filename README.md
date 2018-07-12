# maybe-baby

<div align="center">
Minimize defensive coding. A JavaScript implementation of the <a href="https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad">Maybe monad</a>
<br /><br />
  <a href="https://travis-ci.org/mikechabot/maybe-baby">
    <img src="https://travis-ci.org/mikechabot/maybe-baby.svg?branch=master" alt="build status" />
  </a>
  <a href="https://coveralls.io/github/mikechabot/maybe-baby?branch=master">
    <img src="https://coveralls.io/repos/github/mikechabot/maybe-baby/badge.svg?branch=master&cacheBuster=1" alt="coverage status" />
  </a>
  <a href="https://david-dm.org/mikechabot/maybe-baby">
    <img src="https://david-dm.org/mikechabot/maybe-baby.svg" alt="dependency status" />
  </a>
  <a href="https://david-dm.org/mikechabot/maybe-baby?type=dev">
    <img src="https://david-dm.org/mikechabot/maybe-baby/dev-status.svg" alt="devDependency status" />
  </a>
</div>

<hr />

- [Install](#install)
- [Getting Started](#getting-started)
- [Docs](#docs)
- [API](#api)
  - [of](#of)
  - [isJust, isNothing](#isjust-isnothing)
  - [path, prop](#props)
  - [map](#mapfunc)
  - [chain](#chainfunc)
- [Credit](#credit)

## <a id="install">Install</a>

* `$ npm install maybe-baby`

---

## <a id="getting-started">Getting Started</a>

What if we need the `zipCode` of the user below, which lives on the `address` object? 

```javascript
const user = { 
  email: 'foo@bar.com',
  address: null,
  name: {
     first: 'John',
     last: null,
     middle: null
  }
};
```

Accessing it via dot notation will result in an error: 

```javascript
const zipCode = user.address.zipCode;  // Uncaught TypeError: Cannot read property 'zipCode' of undefined
```

### Possible Solutions?

1. Write some ugly null checks that don't scale well:

```javascript
function getZipCode(user) {
  if (user !== null && user !== undefined) {
     if (user.address !== null && user.address !== undefined) {
      	return user.address.zipCode
      }
  }
}
```

2. Use [`_.get()`](https://lodash.com/docs/4.17.4#get) or something similar, but these libaries have large footprints, and most likely won't be implementing the monadic structure.

3. Wait for [optional chaining](https://github.com/tc39/proposal-optional-chaining) to be approved in ECMA, or use [babel-plugin-transform-optional-chaining](https://www.npmjs.com/package/babel-plugin-transform-optional-chaining).

### A Better Solution?

1. Use `maybe-baby` to minimize defensive coding:

```javascript
import Maybe from 'maybe-baby';

function getZipCode(user) {
  return Maybe.of(user)
    .prop('address')
    .prop('zipCode')
    .join();
}
```
Can we make that more succinct?

```js
function getZipCode(user) {
  return Maybe.of(() => user.address.zipCode).join();
}
```

Now we can safely get the `zipCode` without worrying about the shape of the object, or encountering `TypeErrors`:

```js
console.log(getZipCode(user));   // undefined
```

----

## <a id="docs">Docs</a>

Documentation generated via [JSDoc](https://github.com/jsdoc3/jsdoc).

* [https://mikechabot.github.io/maybe-baby/](https://mikechabot.github.io/maybe-baby/)

---

## <a id="api">API</a>

Check out the API below, or the complete [documentation](https://mikechabot.github.io/maybe-baby/).

### <a id="of">`of(val|func)`</a>

Accepts a value of any type, and returns a monad:

```javascript
const str = Maybe.of('foo');
const num = Maybe.of(123);
const bool = Maybe.of(true);
const obj = Maybe.of({});
const arr = Maybe.of([]);
const empty = Maybe.of(null);
const undef = Maybe.of(undefined);
```

Accepts a function, and sets the function's return value as the monad's value, returns a monad. 

> If the function results in an error, the monad's value is set to `undefined`.

```javascript
const user = {};
const mZipCode = Maybe.of(() => user.address.zipCode);

console.log(mZipCode.join()); // undefined
```
----

### <a id="isjust-isnothing">`isJust()`, `isNothing()`</a>

Use `isNothing` and `isJust` to determine whether the monad is `null` and/or `undefined`

```javascript
const noVal = Maybe.of(null);
noVal.isJust();     // false
noVal.isNothing();  // true


const aVal = Maybe.of(123);
aVal.isJust();     // true
aVal.isNothing();  // false
```

----

### <a id="props">`path`, `prop`</a>

* Use `path` or `prop` to get values at arbitrary depths.

```javascript
const myObject = { 
  foo: { 
    bar: [123, 456] 
  } 
};
```

#### `prop(<string|number>)`

Accepts a single argument:

```javascript
const mObj = Maybe.of(myObject);

mObj.prop('foo').join();                       // { bar: [123, 456] }
mObj.prop('foo').prop('bar').join();           // [123, 456]
mObj.prop('foo').prop('bar').prop(1).join();   // 456
```

#### `path(<string>)`

Accepts a period-delimited string:

```javascript
const mObj = Maybe.of(myObject);

mObj.path('foo').join();        // { bar: [123, 456] }
mObj.path('foo.bar').join();    // [123, 456]
mObj.path('foo.bar.1').join();  // 456
```

----

### <a id="mapfunc">`map(func)`</a>

Apply a transformation to the monad, and return a new monad:

```javascript
const val = 1;
const newVal = Maybe.of(val).map(val => val + 1);

newVal.join(); // 2;
```

----

### <a id="chainfunc">`chain(func)`</a>

Chain together functions that return Maybe monads:

```javascript
function addOne (val) {
  return Maybe.of(val + 1);
}

const three = Maybe.of(1)
 .chain(addOne)
 .chain(addOne);

 three.join(); // 3
```

----

## <a id="credit">Credit</a>

Credit to [James Sinclair](https://github.com/jrsinclair) for writing [The Marvellously Mysterious JavaScript Maybe Monad](http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/).
