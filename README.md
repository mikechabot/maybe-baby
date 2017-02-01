# maybe-baby

[![npm version](https://badge.fury.io/js/maybe-baby.svg)](https://badge.fury.io/js/maybe-baby)

Maybe monad for JavaScript

* Credit to [James Sinclair](https://github.com/jrsinclair)
* [The Marvellously Mysterious JavaScript Maybe Monad](http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/)

**Monad**
    
var Maybe = function (val) {
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

Maybe.prototype.prop = function (property) {
    return this.map(
        function (value) {
            return value[property];
        }
    );
};

Maybe.prototype.map = function (transform) {
    if (this.isNothing()) {
        return Maybe.of(null);
    }
    return Maybe.of(transform(this.join()));
};

Maybe.prototype.orElse = function (defaultVal) {
    if (this.isNothing()) {
        return Maybe.of(defaultVal);
    }
    return this;
};
