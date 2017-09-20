'use strict';

const DELIMITER = '.';

/**
 * Private constructor. Use <code>Maybe.of()</code> instead.
 * @param val {*} Object, string, or number
 * @constructor
 */
const Maybe = function Maybe (val) {
    this.__value = val;
};

/**
 * Public constructor. Creates an instance of Maybe.
 * @param val {*} Object, string, or number
 * @example const myMaybe = Maybe.of({ foo: 'bar', baz: [1,2,3] });
 * @returns {Maybe} A Maybe monad
 */
Maybe.of = function (val) {
    return new Maybe(val);
};

/**
 * Get the monad's value
 * @example myMaybe.join();
 * @returns {*} Returns the value of the monad
 */
Maybe.prototype.join = function () {
    return this.__value;
};

/**
 * Determine whether the monad's value is defined
 * @example myMaybe.isJust();
 * @returns {boolean} <code>true</code> if the value is defined, <code>false</code> if the monad is null or undefined.
 */
Maybe.prototype.isJust = function () {
    return !this.isNothing();
};

/**
 * Determine whether the monad's value is null or undefined
 * @example myMaybe.isNothing();
 * @returns {boolean} <code>true</code> if the value is null or undefined, <code>false</code> if the value is defined.
 */
Maybe.prototype.isNothing = function () {
    return this.__value === null || this.__value === undefined;
};

/**
 * Chain to the end of <code>prop</code>, <code>props</code>, or <code>path</code> as the
 * default value to return if the <code>isNothing()</code> is true
 * @param defaultValue {string} Return this value when <code>join()</code> is called and <code>isNothing()</code> is true
 * @example myMaybe.prop('qux').orElse(myDefault).join();
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
 * @example myMaybe.prop('foo');
 * myMaybe.prop('baz').prop(2);
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
 * @example myMaybe.props('foo');
 * myMaybe.props('baz', 2);
 * @returns {Maybe} A monad containing the value at a given path
 */
Maybe.prototype.props = function (...properties) {
    if (properties.length === 0) {
        return Maybe.of(undefined);
    } else {
        const maybeValue = this.prop(properties.shift());
        return properties.length > 0
            ? maybeValue.props(...properties)
            : maybeValue;
    }
};

/**
 * Get a value on the monad given a property path in string form
 * @param path {string} A period delimited string representing the path (e.g. 'foo.bar.baz) to search
 * @example myMaybe.path('foo');
 * myMaybe.path('baz.2');
 * @returns {Maybe} A monad containing the value at a given path
 */
Maybe.prototype.path = function (path) {
    return this.__isValidPath(path)
        ? this.props(...path.split(DELIMITER))
        : Maybe.of(undefined);
};

/**
 * Apply a transformation to the monad
 * @param transform {function} The transformation function to apply to the monad
 * @example Maybe.of(1).map(val => val + 1);
 * @returns {Maybe} A monad created from the result of the transformation
 */
Maybe.prototype.map = function (transform) {
    if (this.isNothing()) {
        return Maybe.of(undefined);
    }
    return Maybe.of(transform(this.join()));
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
