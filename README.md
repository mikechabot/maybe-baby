# maybe-baby
Maybe monad for JavaScript

* Credit to [James Sinclair](https://github.com/jrsinclair)
* [The Marvellously Mysterious JavaScript Maybe Monad](http://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/)

**Monad**

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
