'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DELIMITER = '.';

/**
 * Private constructor. Use <code>Maybe.of()</code> instead.
 * @param val {*} Object, string, or number
 * @constructor
 */
var Maybe = function Maybe(val) {
    this.__value = val;
};

/**
 * Public constructor. Creates an instance of Maybe.
 * @param val {*} Object, string, number, or function (direct object access)
 * @example const exampleObj = {
 *      foo: 'bar',
 *      baz: [1,2,3]
 * };
 *
 * const maybe1 = Maybe.of(exampleObj);
 * const maybe2 = Maybe.of(() => exampleObj.baz.1);
 * @returns {Maybe} A Maybe monad
 */
Maybe.of = function (val) {
    if (typeof val === 'function') {
        try {
            return Maybe.of(val());
        } catch (error) {
            return Maybe.of(undefined);
        }
    } else {
        return new Maybe(val);
    }
};

/**
 * Get the monad's value
 * @example const maybe1 = Maybe.of(123);
 * const maybe2 = Maybe.of(null);
 *
 * maybe1.join();   // 123
 * maybe2.join();   // null
 * @returns {*} Returns the value of the monad
 */
Maybe.prototype.join = function () {
    return this.__value;
};

/**
 * Determine whether the monad's value exists
 * @example const maybe1 = Maybe.of(123);
 * const maybe2 = Maybe.of(undefined);
 *
 * maybe1.isJust();    // true
 * maybe2.isJust();    // false
 * @returns {boolean} <code>true</code> if the value is defined, <code>false</code> if the monad is null or undefined.
 */
Maybe.prototype.isJust = function () {
    return !this.isNothing();
};

/**
 * Determine whether the monad's value is null or undefined
 * @example const maybe1 = Maybe.of(null);
 * const maybe2 = Maybe.of(123);
 *
 * maybe1.isNothing();    // true
 * maybe2.isNothing()     // false
 * @returns {boolean} <code>true</code> if the value is null or undefined, <code>false</code> if the value is defined.
 */
Maybe.prototype.isNothing = function () {
    return this.__value === null || this.__value === undefined;
};

/**
 * Chain to the end of <code>prop</code>, <code>props</code>, or <code>path</code> as the
 * default value to return if the <code>isNothing()</code> is true
 * @param defaultValue {string} Return this value when <code>join()</code> is called and <code>isNothing()</code> is true
 * @example const maybe1 = Maybe.of(null);
 *
 * maybe1.orElse('N/A');
 * maybe1.join();   // 'N/A'
 * @returns {Maybe} A monad containing the default value
 */
Maybe.prototype.orElse = function (defaultValue) {
    if (this.isNothing()) {
        return Maybe.of(defaultValue);
    }
    return this;
};

/**
 * Get a value on the monad given a single property
 * @param property {string|number} Look for this property on the monad
 * @example const exampleObj = {
 *      foo: 'bar',
 *      baz: [1,2,3]
 * };
 *
 * const maybeBar = Maybe.of(exampleObj).prop('foo');
 *
 * maybeBar.join();     // 'bar'
 * @returns {Maybe} A monad containing the value of a given property or index
 */
Maybe.prototype.prop = function (property) {
    return this.map(function (value) {
        return value[property];
    });
};

/**
 * Get a value on the monad given a property path in argument form
 * @param properties {string|number} Argument list that represents the property path to search
 * @example const exampleObj = {
 *      foo: 'bar',
 *      baz: [1,2,3]
 * };
 *
 * const maybeArrayVal = Maybe.of(exampleObj).props('baz', 0);
 *
 * maybeArrayVal.join();     // 1
 * @returns {Maybe} A monad containing the value at a given path
 */
Maybe.prototype.props = function () {
    for (var _len = arguments.length, properties = Array(_len), _key = 0; _key < _len; _key++) {
        properties[_key] = arguments[_key];
    }

    if (properties.length === 0) {
        return Maybe.of(undefined);
    } else {
        var maybeValue = this.prop(properties.shift());
        return properties.length > 0 ? maybeValue.props.apply(maybeValue, properties) : maybeValue;
    }
};

/**
 * Get a value on the monad given a property path in string form
 * @param path {string} A period delimited string representing the path (e.g. 'foo.bar.baz) to search
 * @example const exampleObj = {
 *      foo: 'bar',
 *      baz: [1,2,3]
 * };
 *
 * const maybeArrayVal = Maybe.of(exampleObj).path('baz.0');
 *
 * maybeArrayVal.join();     // 1
 * @returns {Maybe} A monad containing the value at a given path
 */
Maybe.prototype.path = function (path) {
    return this.__isValidPath(path) ? this.props.apply(this, _toConsumableArray(path.split(DELIMITER))) : Maybe.of(undefined);
};

/**
 * Apply a transformation to the monad
 * @param transform {function} The transformation function to apply to the monad
 * @example Maybe.of(1).map(val => val + 1);
 * @returns {Maybe} A monad created from the result of the transformation
 */
Maybe.prototype.map = function (transform) {
    if (typeof transform !== 'function') throw new Error('transform must be a function');
    if (this.isNothing()) {
        return Maybe.of(undefined);
    }
    return Maybe.of(transform(this.join()));
};

/**
 * Chain together functions that return Maybe monads
 * @param fn {function} Function that is passed the value of the calling monad, and returns a monad.
 * @example function addOne (val) {
 *   return Maybe.of(val + 1);
 * }
 *
 * const three = Maybe.of(1)
 *  .chain(addOne)
 *  .chain(addOne)
 *  .join();
 * @returns {Maybe} A monad created from the result of the transformation
 */
Maybe.prototype.chain = function (fn) {
    return this.map(fn).join();
};

/**
 * Determine whether a path argument is valid
 * @param path {string}
 * @returns {boolean} <code>true</code> if the path is valid, <code>false</code> if not
 * @private
 */
Maybe.prototype.__isValidPath = function (path) {
    if (path === null || path === undefined) return false;
    return typeof path === 'string' && path.length > 0;
};

module.exports = Maybe;