export type OfTypeFunc<T> = () => T;

class Maybe<T = unknown> {
  private readonly __value: T;

  /**
   * Private constructor. Use <code>Maybe.of()</code> instead.
   * @constructor
   */
  private constructor(val: T) {
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
  static of<T>(val: unknown | OfTypeFunc<T>): Maybe {
    try {
      return new Maybe(typeof val === 'function' ? val() : val);
    } catch (error) {
      return new Maybe(undefined);
    }
  }

  /**
   * Get the monad's value
   * @example const maybe1 = Maybe.of(123);
   * const maybe2 = Maybe.of(null);
   *
   * maybe1.join();   // 123
   * maybe2.join();   // null
   * @returns {*} Returns the value of the monad
   */
  join(): T {
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
  isJust(): boolean {
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
  isNothing(): boolean {
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
  orElse(defaultValue: unknown): Maybe {
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
  map(transform: (val: T) => T | Maybe<T>): Maybe {
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
  chain(chain: (val: T) => Maybe<T>): Maybe {
    if (typeof chain !== 'function') throw new Error('chain must be a function');
    return this.map(chain).join() as Maybe
  }
}

export default Maybe;
