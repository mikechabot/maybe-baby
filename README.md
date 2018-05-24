[![Build Status](https://travis-ci.org/mikechabot/maybe-baby.svg?branch=master)](https://travis-ci.org/mikechabot/maybe-baby)
[![Coverage Status](https://coveralls.io/repos/github/mikechabot/maybe-baby/badge.svg?branch=master&cacheBuster=1)](https://coveralls.io/github/mikechabot/maybe-baby?branch=master)
[![Dependency Status](https://david-dm.org/mikechabot/maybe-baby.svg)](https://david-dm.org/mikechabot/maybe-baby)
[![devDependencies Status](https://david-dm.org/mikechabot/maybe-baby/dev-status.svg)](https://david-dm.org/mikechabot/maybe-baby?type=dev)

[![NPM](https://nodei.co/npm/maybe-baby.png)](https://nodei.co/npm/maybe-baby/)

[![GitHub stars](https://img.shields.io/github/stars/mikechabot/maybe-baby.svg?style=social&label=Star)](https://github.com/mikechabot/maybe-baby)
[![GitHub forks](https://img.shields.io/github/forks/mikechabot/maybe-baby.svg?style=social&label=Fork)](https://github.com/mikechabot/maybe-baby)

# maybe-baby

Minimize defensive coding. `maybe-baby` is the [Maybe monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad) implemented in JavaScript. 

> Credit to [James Sinclair](https://github.com/jrsinclair) for writing [The Marvellously Mysterious JavaScript Maybe Monad](http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/).

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Docs](#docs)
- [API](#api)
  - [of](#of)
  - [isJust, isNothing](#isjust-isnothing)
  - [path, prop, props](#path-prop-props)
  - [map](#mapfunc)
  - [chain](#chainfunc)
- [Example Usage](#example-usage)

## <a name="maybe-baby#installation">Installation</a>

Install with yarn or npm:

* `$ npm install --save maybe-baby`
* `$ yarn add maybe-baby`

---

## <a name="maybe-baby#getting-started">Getting Started</a>

When data is unreliable, minimize defensive coding with `maybe-baby` :

```javascript
// Domain object with NULL address
const user = { 
  email: 'foo@bar.com'
  accountDetails: {
    type: 'employee',
    insuranceCode: 'BDX2321',
    address: null
  }
};
```

**Problem**

It looks like we're missing the `address` attribute on the `accountDetails` object. That's too bad since we're in a situation where we need the `zipCode`, which happens to live on the `address`. Accessing it via dot notation (`person.accountDetails.address.zipCode`) will result in a `TypeError`. 

**Solutions?**

1. Write some null checks, but that doesn't scale well, and is ugly.
2. Use [`_.get()`](https://lodash.com/docs/4.17.4#get) or something similar, but these libs can have large footprints, and most likely won't be implementing the monadic structure.

**A better aproach?**

1. The Maybe monad.

How does that work? Let's find out -- and rememeber, with `maybe-baby`, we're **guaranteed** to never encounter a `TypeError` when trying to access the properties of an `undefined` object.

```js
import Maybe from 'maybe-baby';

// Short-circuit and return undefined if any errors are thrown
function getZipCode(person) {
  return Maybe.of(person)
    .prop('accountDetails')
    .prop('address')
    .prop('zipCode')
    .join();
}
```
Can we make that more succinct?

```js
// Short-circuit and return undefined if any errors are thrown
function getZipCode(person) {
  return Maybe.of(() => person.accountDetails.address.zipCode).join();
}
```

----

## <a name="maybe-baby#docs">Docs</a>

Documentation generated via [JSDoc](https://github.com/jsdoc3/jsdoc).

* https://mikechabot.github.io/maybe-baby/

---

## <a name="maybe-baby#api">API</a>

There's lots of ways to access your data using `maybe-baby`. Check out the API below or the complete [documentation](https://mikechabot.github.io/maybe-baby/).

### <a name="usage#of">of</a>

##### Values

`of` accepts a value of any type, and stores it as the monad's value. A monad is returned.

```javascript
Maybe.of('foo');      // string
Maybe.of(123);        // number
Maybe.of(true);       // boolean
Maybe.of({});         // object
Maybe.of([]);         // array
Maybe.of(null);       // null
Maybe.of(undefined);  // undefined
```

#### Functions

If a function is passed, the result will be passed as the monad's value. However, if the function throws an `error`, the monad's value is set to `undefined`.

```javascript
const person = {
    accountDetails: {
        address: null
    }
};

const zipCode = Maybe.of(() => person.accountDetails.address.zipCode);
zipCode.join();   // undefined
```

----

### <a name="usage#isJust">isJust, isNothing</a>

Use `isNothing` and `isJust` to determine whether the monad is `null` and/or `undefined`

```javascript
const noVal = Maybe.of(null);
noVal.isNothing();  // true
noVal.isJust();     // false

const aVal = Maybe.of(123);
aVal.isNothing();  // false
aVal.isJust();     // true
```

----

### <a name="usage#props">path, prop, props</a>

* Use `path`, `props`, or `prop` to get values at arbitrary depths.
* Each functions identically to the others; they only differ in their input parameters.
* As with every monadic function, they are chainable.

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

#### `props(<string|number>)`
```javascript
maybeObj.props('foo').join();           // { bar: [123, 456] }
maybeObj.props('foo', 'bar').join();    // [123, 456]
maybeObj.props('foo', 'bar', 1).join(); // 456
```

----

### <a name="usage#map">map(func)</a>

Apply a transformation to the monad, and return a new monad:

```javascript
const val = 1;
const newVal = Maybe.of(val).map(val => val + 1);

newVal.join(); // 2;
```

----

### <a name="usage#chain">chain(func)</a>

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

## <a name="maybe-baby#usage">Example Usage</a>

1. Some object with an arbitrary shape.

```javascript
const person = {
    firstName     : 'John',
    lastName      : null,
    accountDetails: {
        insuranceCode: 'BDX2321'
        address      : null
    }
};
```

2. Example domain service that implements `maybe-baby` (`chain` and `prop`) to safely retrieve values from an object.

```javascript

const FLAT_PROPS = {
  FIRST_NAME: 'firstName',
  LAST_NAME : 'lastName',
  ACCT_DTLS : 'accountDetails',
  INSR_CODE : 'insuranceCode',
  ADDRESS   : 'address',
  ZIP_CODE  : 'zipCode'
}

let svc = {};
const PersonService = svc = {
    getFirsName (person) {
        return Maybe
            .of(person)
            .prop(FLAT_PROPS.FIRST_NAME);
    },
    getLastName (person) {
        return Maybe
            .of(person)
            .prop(FLAT_PROPS.LAST_NAME);
    },
    getAccountDetails (person) {
        return Maybe
            .of(person)
            .prop(FLAT_PROPS.ACCT_DTLS);
    },
    getInsuranceCode (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .prop(FLAT_PROPS.INSR_CODE);
    },
    getAddress (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .prop(FLAT_PROPS.ADDRESS);
    },
    getZipCode (person) {
        return Maybe
            .of(person)
            .chain(svc.getAccountDetails)
            .chain(svc.getAddress)
            .prop(FLAT_PROPS.ZIP_CODE);
    }
};
```

3. Get monad-wrapped values from service.

```javascript
const firstName = PersonService.getFirsName(person);
const lastName = PersonService.getLastName(person);
const accountDetails = PersonService.getAccountDetails(person);
const insuranceCode = PersonService.getInsuranceCode(person);
const address = PersonService.getAddress(person);
const zipCode = PersonService.getZipCode(person);
```

4. Get values from the Maybes.

```javascript
firstName.join();      // 'John'
lastName.join();       // null
accountDetails.join(); // { insuranceCode: 'BDX2321', address: null }
insuranceCode.join();  // 'BDX2321'
address.join();        // null
zipCode.join();        // undefined
```
