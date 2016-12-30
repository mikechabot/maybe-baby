'use strict';

/**
 * maybe-baby: Maybe monad for JavaScript
 * Credit to James Sinclair (https://twitter.com/jrsinclair)
 * http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/
 */

const Maybe = function (val) {
    this.__value = val;
};

Maybe.of = function (val) {
    return new Maybe(val);
};

Maybe.prototype.isNothing = function () {
    return (this.__value === null || this.__value === undefined);
};

Maybe.prototype.isJust = function () {
    return !this.isNothing();
};

Maybe.prototype.join = function () {
    return this.__value;
};

Maybe.prototype.chain = function (transform) {
    return this.map(transform).join();
};

Maybe.prototype.prop = function (value) {
    function getProp (value) {
        return function (monad) {
            return monad[value];
        };
    }
    return this.map(getProp(value));
};

Maybe.prototype.map = function (transform) {
    if (this.isNothing()) {
        return Maybe.of(null);
    }
    return Maybe.of(transform(this.__value));
};

Maybe.prototype.orElse = function (defaultVal) {
    if (this.isNothing()) {
        return Maybe.of(defaultVal);
    }
    return this;
};

module.exports = Maybe;

