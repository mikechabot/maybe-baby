[![Build Status](https://travis-ci.org/mikechabot/maybe-baby.svg?branch=master)](https://travis-ci.org/mikechabot/maybe-baby)
[![Coverage Status](https://coveralls.io/repos/github/mikechabot/maybe-baby/badge.svg?branch=master&cacheBuster=1)](https://coveralls.io/github/mikechabot/maybe-baby?branch=master)
[![Dependency Status](https://david-dm.org/mikechabot/maybe-baby.svg)](https://david-dm.org/mikechabot/maybe-baby)
[![devDependencies Status](https://david-dm.org/mikechabot/maybe-baby/dev-status.svg)](https://david-dm.org/mikechabot/maybe-baby?type=dev)

[![NPM](https://nodei.co/npm/maybe-baby.png)](https://nodei.co/npm/maybe-baby/)

[![GitHub stars](https://img.shields.io/github/stars/mikechabot/maybe-baby.svg?style=social&label=Star)](https://github.com/mikechabot/maybe-baby)
[![GitHub forks](https://img.shields.io/github/forks/mikechabot/maybe-baby.svg?style=social&label=Fork)](https://github.com/mikechabot/maybe-baby)

# maybe-baby

Minimize defensive coding with `maybe-baby`. A JavaScript implementation of the [Maybe monad](https://en.wikipedia.org/wiki/Monad_(functional_programming)#The_Maybe_monad). 

- [Installing](#installing)
- [Getting Started](#getting-started)
- [Docs](#docs)
- [API](#api)
  - [of](#of)
  - [isJust, isNothing](#isjust-isnothing)
  - [path, prop, props](#path-prop-props)
  - [map](#mapfunc)
  - [chain](#chainfunc)
- [Example Usage](#example-usage)
- [Credit](#credit)

## <a id="installing">Installing</a>

Install with yarn or npm:

* `$ npm install --save maybe-baby`
* `$ yarn add maybe-baby`

---

## <a id="getting-started">Getting Started</a>

Data can be unreliable; often missing important properties. For example:

`user_1` has a `null` `address`:
```javascript
const user_1 = { 
  email: 'foo@bar.com',
  accountDetails: {
    type: 'employee',
    insuranceCode: 'BDX2321',
    address: null
  }
};
```

`user_2` is almost completely empty:
```javascript
const user_3 = { 
  email: 'qux@bar.com'
};
```

**Problem**

What if we need the `zipCode` of each user, which happens to live on the `address`? Accessing it via dot notation (i.e. `user.accountDetails.address.zipCode`) will result in a `TypeError`. 

**Solutions?**

1. Write some null checks, but that doesn't scale well, and is ugly.

```javascript
// Purposely obnoxious
function getZipCode(user) {
  if (user !== null && user !== undefined) {
    if (user.accountDetails !== null && user.accountDetails !== undefined) {
      if (user.accountDetails.address !== null && user.accountDetails.address !== undefined) {
      	return user.accountDetails.address.zipCode
      }
    }
  }
}
```

2. Use [`_.get()`](https://lodash.com/docs/4.17.4#get) or something similar, but these libs can have large footprints, and most likely won't be implementing the monadic structure.

**A better aproach?**

1. The Maybe monad.

How does that work? Let's find out. Keep in mind, regardless of what our data looks like, with `maybe-baby`, we're **guaranteed** to never encounter a `TypeError`:

```js
import Maybe from 'maybe-baby';

// Short-circuit and return undefined if any errors are thrown
function getZipCode(user) {
  return Maybe.of(user)
    .prop('accountDetails')
    .prop('address')
    .prop('zipCode')
    .join();
}
```
Can we make that more succinct?

```js
// Short-circuit and return undefined if any errors are thrown
function getZipCode(user) {
  return Maybe.of(() => user.accountDetails.address.zipCode).join();
}
```

Now we can safely get the `zipCode` without having to worry about the shape of the object:

```js
const zip1 = getZipCode(user_1);  // undefined
const zip2 = getZipCode(user_2);  // undefined
```

----

## <a id="#docs">Docs</a>

Documentation generated via [JSDoc](https://github.com/jsdoc3/jsdoc).

* https://mikechabot.github.io/maybe-baby/

---

## <a id="#api">API</a>

There's lots of ways to access your data using `maybe-baby`. Check out the API below or the complete [documentation](https://mikechabot.github.io/maybe-baby/).

### <a id="of">`of(val|func)`</a>

##### Value

`of` accepts a value of any type, and returns a monad. When a `function` is passed, the return value is set as the monad's value.

> If `val(func)` results in an error, the monad's value is set to `undefined`.

```javascript
// Accepts any type
Maybe.of('foo');              // string
Maybe.of(123);                // number
Maybe.of(true);               // boolean
Maybe.of({});                 // object
Maybe.of([]);                 // array
Maybe.of(null);               // null
Maybe.of(undefined);          // undefined
Maybe.of(() => foo.bar.baz);  // function
```
----

### <a id="isjust-isnothing">`isJust()`, `isNothing()`</a>

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

### <a name="usage#props">`path`, `prop`, `props`</a>

* Use `path`, `props`, or `prop` to get values at arbitrary depths.
* Each functions identically to the others; they only differ in their input parameters.
* As with every monadic function, they are chainable.

```javascript
const myObject = { 
  foo: { 
    bar: [123, 456] 
  } 
};
const mObj = Maybe.of(myObject);
```

#### `path(<string>)`

Accepts a period-delimited string:

```javascript
mObj.path('foo').join();        // { bar: [123, 456] }
mObj.path('foo.bar').join();    // [123, 456]
mObj.path('foo.bar.1').join();  // 456
```

#### `props(...properties)`

Accepts an indefinite list of arguments of string or number:

```javascript
mObj.props('foo').join();           // { bar: [123, 456] }
mObj.props('foo', 'bar').join();    // [123, 456]
mObj.props('foo', 'bar', 1).join(); // 456
```


#### `prop(<string|number>)`

Accepts a single argument:

```javascript
mObj.prop('foo').join();                       // { bar: [123, 456] }
mObj.prop('foo').prop('bar').join();           // [123, 456]
mObj.prop('foo').prop('bar').prop(1).join();   // 456
```

----

### <a name="usage#map">`map(func)`</a>

Apply a transformation to the monad, and return a new monad:

```javascript
const val = 1;
const newVal = Maybe.of(val).map(val => val + 1);

newVal.join(); // 2;
```

----

### <a name="usage#chain">`chain(func)`</a>

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

#### Verbose

```javascript

const FLAT_PROPS = {
  FIRST_NAME: 'firstName',
  LAST_NAME : 'lastName',
  ACCT_DTLS : 'accountDetails',
  INSR_CODE : 'insuranceCode',
  ADDRESS   : 'address',
  ZIP_CODE  : 'zipCode'
}

const PersonService = {
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

#### Compact

```js
const PersonService = {
    getFirsName (person) {
        return Maybe.of(() => person.firstName);
    },
    getLastName (person) {
        return Maybe.of(() => person.lastName);
    },
    getAccountDetails (person) {
        return Maybe.of(() => person.accountDetails);
    },
    getInsuranceCode (person) {
         return Maybe.of(() => person.accountDetails.insuranceCode);
    },
    getAddress (person) {
        return Maybe.of(() => person.accountDetails.address);
    },
    getZipCode (person) {
        return Maybe.of(() => person.accountDetails.address.zipCode);
    }
};
```

3. Get monad-wrapped values from service.

```javascript
const firstName      = PersonService.getFirsName(person);
const lastName       = PersonService.getLastName(person);
const accountDetails = PersonService.getAccountDetails(person);
const insuranceCode  = PersonService.getInsuranceCode(person);
const address        = PersonService.getAddress(person);
const zipCode        = PersonService.getZipCode(person);
```

4. Get values from the Maybes.

```javascript
firstName.join();       // 'John'
lastName.join();        // null
accountDetails.join();  // { insuranceCode: 'BDX2321', address: null }
insuranceCode.join();   // 'BDX2321'
address.join();         // null
zipCode.join();         // undefined
```

----

## <a name="maybe-baby#credit">Credit</a>

Credit to [James Sinclair](https://github.com/jrsinclair) for writing [The Marvellously Mysterious JavaScript Maybe Monad](http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/).
