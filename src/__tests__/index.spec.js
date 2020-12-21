import Maybe from '../../lib';

describe('maybe-baby', () => {
  describe('Public API', () => {
    it('should have an isJust function', () => {
      expect(typeof Maybe.of(undefined).isJust).toEqual('function');
    });

    it('should have an isNothing function', () => {
      expect(typeof Maybe.of(undefined).isNothing).toEqual('function');
    });

    it('should have a join function', () => {
      expect(typeof Maybe.of(undefined).join).toEqual('function');
    });

    it('should have an orElse function', () => {
      expect(typeof Maybe.of(undefined).orElse).toEqual('function');
    });

    it('should have a map function', () => {
      expect(typeof Maybe.of(undefined).map).toEqual('function');
    });

    it('should have a chain function', () => {
      expect(typeof Maybe.of(undefined).chain).toEqual('function');
    });

    describe('Private', () => {
      it('should have a private __value property', () => {
        expect(Maybe.of(undefined)).toHaveProperty('__value');
      });
    });
  });

  describe('Maybe.of(<value>)', () => {
    const TEST_TYPES = [
      { label: 'null', value: null },
      { label: 'undefined', value: undefined },
      { label: 'true', value: true },
      { label: 'false', value: false },
      { label: 'object', value: { foo: 'bar' } },
      { label: 'array', value: [1, 2, 3] },
      { label: 'number (primitive)', value: 123 },
      { label: 'number (object wrapper)', value: new Number(123) },
      { label: 'string (primitive)', value: 'foo' },
      { label: 'string (object wrapper)', value: new String('foo') },
    ];

    it('should be a function', () => {
      expect(typeof Maybe.of).toEqual('function');
    });

    TEST_TYPES.forEach((testType) => {
      it(`should return a monad when passed ${testType.label}`, () => {
        const testMaybe = Maybe.of(testType.value);
        expect(testMaybe.__value).toEqual(testType.value);
      });
    });

    it('should return a monad when passed an function with direct object access (defined)', () => {
      const foo = { bar: { baz: [1, 2, 3] } };
      const testMaybe = Maybe.of(() => foo.bar.baz[0]);
      expect(testMaybe.__value).toEqual(1);
    });

    it('should return a monad when passed an function with direct object access (undefined)', () => {
      const foo = {};
      const testMaybe = Maybe.of(() => foo.bar.baz[0]);
      expect(testMaybe.__value).toEqual(undefined);
    });
  });

  describe('Monad functions', () => {
    let NULL_UNDEFINED_VALUES;
    let VALID_TEST_VALUES;

    beforeEach(() => {
      NULL_UNDEFINED_VALUES = [null, undefined];
      VALID_TEST_VALUES = [123, 'foo', '', [], {}, 0, false];
    });

    describe('join()', () => {
      it('should return the value of __value (unchecked)', () => {
        [].concat(NULL_UNDEFINED_VALUES, VALID_TEST_VALUES).forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.__value).toEqual(testValue);
          expect(testMaybe.join()).toEqual(testValue);
        });
      });

      it('should return replicate 1.x prop getter', () => {
        const bar = {
          bar: [123, 456]
        };

        const obj = Maybe.of({
          foo: bar
        });

        expect(Maybe.of(() => obj.join().foo).join()).toEqual(bar);
        expect(Maybe.of(() => obj.join().foo.bar[1]).join()).toEqual(456);
      });

      it('should return replicate 1.x props getter', () => {
        const obj = Maybe.of({
          foo: 'bar',
          baz: [1,2,3]
        });

        expect(Maybe.of(() => obj.join().baz[0]).join()).toEqual(1);
      });

      it('should return replicate 1.x path getter', () => {
        const obj = Maybe.of({
          foo: 'bar',
          baz: [1,2,3]
        });

        expect(Maybe.of(() => obj.join().baz[0]).join()).toEqual(1);
      });
    });

    describe('isJust()', () => {
      it('should return true when __value is not null or undefined', () => {
        VALID_TEST_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isJust()).toEqual(true);
        });
      });

      it('should return false __value is null or undefined', () => {
        NULL_UNDEFINED_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isJust()).toEqual(false);
        });
      });
    });

    describe('isNothing()', () => {
      it('should return false when __value is not null or undefined', () => {
        VALID_TEST_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isNothing()).toEqual(false);
        });
      });

      it('should return true __value is null or undefined', () => {
        NULL_UNDEFINED_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isNothing()).toEqual(true);
        });
      });
    });

    describe('orElse(<value>)', () => {
      it('should return this value as the default if isNothing() is true', () => {
        const OR_ELSE_VALUE = 'foo';
        NULL_UNDEFINED_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
          expect(testMaybe.join()).toEqual(OR_ELSE_VALUE);
        });
      });

      it('should not return this value if isNothing() is false', () => {
        const OR_ELSE_VALUE = 'foo';
        VALID_TEST_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
          expect(testMaybe.join()).toEqual(testValue);
        });
      });

      it('should return undefined (no value was passed) if isNothing() is true', () => {
        const testMaybe = Maybe.of().orElse();
        expect(testMaybe.join()).toEqual(undefined);
      });

      it('should not return undefined if isNothing() is false', () => {
        const testMaybe = Maybe.of(123).orElse();
        expect(testMaybe.join()).not.toEqual(undefined);
        expect(testMaybe.join()).toEqual(123);
      });
    });

    describe('map(transform)', () => {
      it('should throw an error if transform is not a function', () => {
        const underTest = Maybe.of(1);
        expect(() => {
          underTest.map();
        }).toThrow('transform must be a function');
      });

      it("should apply the transformation to the monad's value (numeric)", () => {
        const addOne = (monadVal) => monadVal + 1;
        const underTest = Maybe.of(1).map(addOne);
        expect(underTest.join()).toEqual(2);
      });

      it("should apply the transformation to the monad's value (object)", () => {
        const TEST_PROPERTY = 'foo';
        const TEST_VALUE = 'bar';
        const TEST_OBJECT = { [TEST_PROPERTY]: TEST_VALUE };
        const underTest = Maybe.of(TEST_OBJECT).map((obj) => obj[TEST_PROPERTY]);
        expect(underTest.join()).toEqual(TEST_VALUE);
      });

      it("should apply the transformation to the monad's value (string)", () => {
        const foo = 'foo';
        const bar = 'bar';
        const underTest = Maybe.of(foo).map((obj) => obj + bar);
        expect(underTest.join()).toEqual(`${foo}${bar}`);
      });
    });

    describe('chain(transform)', () => {
      it('should throw an error if transform is not a function', () => {
        const underTest = Maybe.of(1);
        expect(() => {
          underTest.chain();
        }).toThrow('chain must be a function');
      });

      it("should apply the transformation to the monad's value (numeric)", () => {
        function addOne(bar) {
          return Maybe.of(bar + 1);
        }
        const underTest = Maybe.of(1).chain(addOne).chain(addOne);
        expect(underTest.join()).toEqual(3);
      });

      it("should apply the transformation to the monad's value (object)", () => {
        const TEST_PROPERTY_1 = 'foo';
        const TEST_PROPERTY_2 = 'bar';
        const TEST_VALUE = [123, 567];
        const TEST_OBJECT = { [TEST_PROPERTY_1]: { [TEST_PROPERTY_2]: TEST_VALUE } };

        function getFoo(obj) {
          return Maybe.of(() => obj.foo);
        }

        function getBar(obj) {
          return Maybe.of(() => obj.bar);
        }

        const underTest = Maybe.of(TEST_OBJECT).chain(getFoo).chain(getBar);

        expect(underTest.join()).toEqual(TEST_VALUE);
      });

      it("should apply the transformation to the monad's value (string)", () => {
        const underTest = Maybe.of('a')
          .chain((val) => Maybe.of(`${val}b`))
          .chain((val) => Maybe.of(`${val}c`));
        expect(underTest.join()).toEqual('abc');
      });
    });
  });
});
