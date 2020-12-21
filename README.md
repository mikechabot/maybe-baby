# maybe-baby

> 2.x will be maintained, however, if possible for your repository, you should opt to use TypeScript's [optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html), which was introduced in 3.7

<div align="center">
Minimize defensive coding. A JavaScript implementation of the <a href="https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad">Maybe monad</a>.
<br /><br />
  <a href="https://www.npmjs.com/package/maybe-baby">
    <img src="https://img.shields.io/npm/v/maybe-baby.svg?style=flat-square" alt="npm version" />
  </a>
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
- [Migration](#migration)
- [API](#api)
  - [of](#of)
  - [isJust](#isjust)
  - [isNothing](#isnothing)
  - [join](#join)
  - [orElse](#orelse)
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
const getZipCode = (user) => {
  if (user !== null && user !== undefined) {
    if (user.address !== null && user.address !== undefined) {
      return user.address.zipCode
    }
  }
}
```

2. Use [`_.get()`](https://lodash.com/docs/4.17.4#get) or something similar, but these libraries have large footprints, and most likely won't be implementing the monadic structure.

3. Wait for [optional chaining](https://github.com/tc39/proposal-optional-chaining) to be approved in ECMA, or use [babel-plugin-transform-optional-chaining](https://www.npmjs.com/package/babel-plugin-transform-optional-chaining).

4. Use TypeScript's [optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) 

### A Better Solution?

1. Use `maybe-baby` to minimize defensive coding:

```javascript
import Maybe from 'maybe-baby';

// Use a function getter
const getZipCode = (user) => Maybe.of(() => user.address.zipCode).join();

```

Now we can safely get the `zipCode` without worrying about the shape of the object, or encountering `TypeErrors`:

```js
const zipCode = getZipCode(user);
console.log(zipCode);  // undefined
```

----

## <a id="docs">Docs</a>

Documentation generated via [JSDoc](https://github.com/jsdoc3/jsdoc).

* [https://mikechabot.github.io/maybe-baby/](https://mikechabot.github.io/maybe-baby/)

---

## <a id="migration">Migrating from 1.x to 2.x</a>

Breaking changes were introduced in 2.0.0; the following redundant function were removed.

> Maybe.of(<func>) can replicate the behavior of `prop`, `props`, and `path`.

### `prop(val: string | number)`

```javascript
const obj = Maybe.of({ 
  foo: { 
    bar: [123, 456] 
  } 
});

// Incorrect
const bar = obj.prop("foo").join(); // { bar: [123, 456] }

// Correct
Maybe.of(() => obj.join().foo).join(); // { bar: [123, 456] }

// Incorrect
obj
  .prop("foo")
  .prop("bar")
  .prop(1)
  .join(); // 456

// Correct
Maybe.of(() => obj.join().foo.bar[1]).join() // 456
```

### `props(...args)`

```javascript
const obj = Maybe.of({
  foo: 'bar',
  baz: [1,2,3]
});

// Incorrect
obj.props('baz', 0).join(); // 1

// Correct
Maybe.of(() => obj.join().baz[0]).join(); // 1
```

### `props(val: string)`

```javascript
const obj = Maybe.of({
  foo: 'bar',
  baz: [1,2,3]
});

// Incorrect
obj.path('baz.0').join() // 1

// Correct
Maybe.of(() => obj.join().baz[0]).join(); // 1
```

---

## <a id="api">API</a>

Check out the API below, or the complete [documentation](https://mikechabot.github.io/maybe-baby/).

### <a id="of">`of(val: unknown | OfTypeFunc<T>)`</a>

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

```typescript
type OfTypeFunc<T> = () => T;

const user = {};
const mZipCode = Maybe.of(() => user.address.zipCode);

console.log(mZipCode.join()); // undefined
```
----

### <a id="isjust">`isJust(): boolean`</a>

Returns `true` if the value is not `null` or `undefined`:

```javascript
Maybe.of(123).isJust();   // true
Maybe.of(null).isJust();  // false
```

----

### <a id="isnothing">`isNothing(): boolean`</a>

Returns `true` if the value is `null` or `undefined`:

```javascript
Maybe.of(123).isNothing();   // false
Maybe.of(null).isNothing();  // true
```
----

### <a id="join">`join(): T`</a>

Returns the value:

```javascript
Maybe.of(123).join();   // 123
Maybe.of(null).join();  // null
```

----

### <a id="orelse">`orElse(defaultValue: unknown): Maybe`</a>

Chain to the end of a monad to return as the default value if `isNothing()` is `true`:

```javascript
Maybe.of(undefined)
  .orElse('No Value')
  .join();  // 'No Value'
```

----

### <a id="mapfunc">`map(transform: (val: T) => T | Maybe<T>): Maybe`</a>

Apply a transformation to the monad, and return a new monad:

```javascript
const val = 1;
const newVal = Maybe.of(val).map(val => val + 1);

newVal.join(); // 2;
```

----

### <a id="chainfunc">`chain(chain: (val: T) => Maybe<T>): Maybe`</a>

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
