
const DELIMITER = '.';

/**
 * Create an instance of Maybe
 * @param val
 * @constructor
 */
let Maybe = function Maybe (val) {
    this.__value = val;
};

/**
 * Create an instance of Maybe (shortcut)
 * @param val
 * @returns {Maybe}
 */
Maybe.of = function (val) {
    return new Maybe(val);
};

/**
 * Return true of the monad's value is null/undefined
 * @returns {boolean}
 */
Maybe.prototype.isNothing = function () {
    return this.__value === null || this.__value === undefined;
};

/**
 * Return true if the monad's value is not null/undefined
 * @returns {boolean}
 */
Maybe.prototype.isJust = function () {
    return !this.isNothing();
};

/**
 * Return the monad's value
 * @returns {*}
 */
Maybe.prototype.join = function () {
    return this.__value;
};

/**
 * Set this as the default value, which will
 * be returned if the monad's value is null/undefined
 * @param defaultVal
 * @returns {Maybe}
 */
Maybe.prototype.orElse = function (defaultVal) {
    if (this.isNothing()) {
        return Maybe.of(defaultVal);
    }
    return this;
};

/**
 * Get a property value on the monad
 *      Example: maybeInstance.prop('foo');
 * @param property
 */
Maybe.prototype.prop = function (property) {
    return this.map(function (value) {
        return value[property];
    });
};

/**
 * Given the argument list, get a property value on the monad
 *      Example: maybeInstance.props('foo', 'bar', 1);
 * @param properties
 * @returns {*}
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
 * Given a string path, get a property value on the monad
 *      Example: maybeInstance.path('foo.bar.0');
 * @param path
 * @returns {*}
 */
Maybe.prototype.path = function (path) {
    return path === null || path === undefined
        ? Maybe.of(undefined)
        : this.props(...path.split(DELIMITER));
};

/**
 * Apply a transformation to the monad
 * @param transform
 * @returns {Maybe}
 */
Maybe.prototype.map = function (transform) {
    if (this.isNothing()) {
        return Maybe.of(undefined);
    }
    return Maybe.of(transform(this.join()));
};

module.exports = Maybe;
