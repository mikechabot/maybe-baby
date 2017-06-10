'use strict';

/**
 * maybe-baby: Maybe monad for JavaScript
 * Credit to James Sinclair (https://twitter.com/jrsinclair)
 * http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/
 */

var Maybe = function (val) {
    this.__value = val;
};

/**
 * Create a Maybe instance
 * @param val
 * @returns {Maybe}
 */
Maybe.of = function (val) {
    return new Maybe(val);
};

/**
 * Return true if the Maybe does not contain a value
 * @returns {boolean}
 */
Maybe.prototype.isNothing = function () {
    return (this.__value === null || this.__value === undefined);
};

/**
 * Return true if the Maybe contains a value
 * @returns {boolean}
 */
Maybe.prototype.isJust = function () {
    return !this.isNothing();
};

/**
 * Get the Maybe's value
 * @returns {*}
 */
Maybe.prototype.join = function () {
    return this.__value;
};

/**
 * Chain together functions that return Maybes
 * @param transform
 * @returns {string}
 */
Maybe.prototype.chain = function (transform) {
    return this.map(transform).join();
};

/**
 * Get a property value from a Maybe
 * @param property
 */
Maybe.prototype.prop = function (property) {
    return this.map(
        function (value) {
            return value[property];
        }
    );
};

Maybe.prototype.props = function (...properties) {
    if (properties) {
        const maybeValue = this.prop(properties.shift());
        return properties.length > 0
            ? maybeValue.props(...properties)
            : maybeValue;
    }
};

/**
 * Perform a transformation on a Maybe value
 * @param transform
 */
Maybe.prototype.map = function (transform) {
    if (this.isNothing()) {
        return Maybe.of(null);
    }
    return Maybe.of(transform(this.join()));
};

/**
 * Return a default value if the Maybe is nothing
 * @param defaultVal
 * @returns {Maybe}
 */
Maybe.prototype.orElse = function (defaultVal) {
    if (this.isNothing()) {
        return Maybe.of(defaultVal);
    }
    return this;
};

module.exports = Maybe;

