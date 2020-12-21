"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Maybe = /*#__PURE__*/function () {
  /**
   * Private constructor. Use <code>Maybe.of()</code> instead.
   * @constructor
   */
  function Maybe(val) {
    _classCallCheck(this, Maybe);

    _defineProperty(this, "__value", void 0);

    this.__value = val;
  }
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


  _createClass(Maybe, [{
    key: "join",

    /**
     * Get the monad's value
     * @example const maybe1 = Maybe.of(123);
     * const maybe2 = Maybe.of(null);
     *
     * maybe1.join();   // 123
     * maybe2.join();   // null
     * @returns {*} Returns the value of the monad
     */
    value: function join() {
      return this.__value;
    }
    /**
     * Determine whether the monad's value exists
     * @example const maybe1 = Maybe.of(123);
     * const maybe2 = Maybe.of(undefined);
     *
     * maybe1.isJust();    // true
     * maybe2.isJust();    // false
     * @returns {boolean} <code>true</code> if the value is defined,
     * <code>false</code> if the monad is null or undefined.
     */

  }, {
    key: "isJust",
    value: function isJust() {
      return !this.isNothing();
    }
    /**
     * Determine whether the monad's value is null or undefined
     * @example const maybe1 = Maybe.of(null);
     * const maybe2 = Maybe.of(123);
     *
     * maybe1.isNothing();    // true
     * maybe2.isNothing()     // false
     * @returns {boolean} <code>true</code> if the value is null or
     * undefined, <code>false</code> if the value is defined.
     */

  }, {
    key: "isNothing",
    value: function isNothing() {
      return this.__value === null || this.__value === undefined;
    }
    /**
     * Chain to the end of a monad as the default value to return if the <code>isNothing()</code> is true
     * @param defaultValue {string} Return this value when
     * <code>join()</code> is called and <code>isNothing()</code> is true
     * @example const maybe1 = Maybe.of(null);
     *
     * maybe1.orElse('N/A');
     * maybe1.join();   // 'N/A'
     * @returns {Maybe} A monad containing the default value
     */

  }, {
    key: "orElse",
    value: function orElse(defaultValue) {
      if (this.isNothing()) {
        return Maybe.of(defaultValue);
      }

      return this;
    }
    /**
     * Apply a transformation to the monad
     * @param transform {function} The transformation function to apply to the monad
     * @example Maybe.of(1).map(val => val + 1);
     * @returns {Maybe} A monad created from the result of the transformation
     */

  }, {
    key: "map",
    value: function map(transform) {
      if (typeof transform !== 'function') throw new Error('transform must be a function');

      if (this.isNothing()) {
        return Maybe.of(undefined);
      }

      return Maybe.of(transform(this.join()));
    }
    /**
     * Chain together functions that return Maybe monads
     * @param chain {function} Function that is passed the value of the calling monad, and returns a monad.
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

  }, {
    key: "chain",
    value: function chain(_chain) {
      if (typeof _chain !== 'function') throw new Error('chain must be a function');
      return this.map(_chain).join();
    }
  }], [{
    key: "of",
    value: function of(val) {
      try {
        return new Maybe(typeof val === 'function' ? val() : val);
      } catch (error) {
        return new Maybe(undefined);
      }
    }
  }]);

  return Maybe;
}();

var _default = Maybe;
exports.default = _default;