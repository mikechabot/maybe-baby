

const expect = require('chai').expect;
const Maybe = require('../../lib');
const TEST_TYPES = require('../common/test-const').TEST_TYPES;

describe('maybe-baby', () => {
  describe('Prototype', () => {
    let testMaybe;
    beforeEach(() => {
      testMaybe = Maybe.of();
    });
    describe('Public API', () => {
      it('should have an isJust function', () => { expect(testMaybe.isJust).to.be.a('function'); });
      it('should have an isNothing function', () => { expect(testMaybe.isNothing).to.be.a('function'); });
      it('should have a join function', () => { expect(testMaybe.join).to.be.a('function'); });
      it('should have an orElse function', () => { expect(testMaybe.orElse).to.be.a('function'); });
      it('should have a map function', () => { expect(testMaybe.map).to.be.a('function'); });
      it('should have a chain function', () => { expect(testMaybe.chain).to.be.a('function'); });
      it('should have a path function', () => { expect(testMaybe.path).to.be.a('function'); });
      it('should have a prop function', () => { expect(testMaybe.prop).to.be.a('function'); });
      it('should have a props function', () => { expect(testMaybe.props).to.be.a('function'); });
    });
    describe('Private', () => {
      it('should have a private __value property', () => { expect(testMaybe).to.have.property('__value'); });
    });
  });
  describe('Maybe.of(<value>)', () => {
    it('should be a function', () => {
      expect(Maybe.of).to.be.a('function');
    });
    TEST_TYPES.forEach((testType) => {
      it(`should return a monad when passed ${testType.label}`, () => {
        const testMaybe = Maybe.of(testType.value);
        expect(testMaybe.__value).to.equal(testType.value);
      });
    });
    it('should return a monad when passed an function with direct object access (defined)', () => {
      const foo = { bar: { baz: [1, 2, 3] } };
      const testMaybe = Maybe.of(() => foo.bar.baz[0]);
      expect(testMaybe.__value).to.equal(1);
    });
    it('should return a monad when passed an function with direct object access (undefined)', () => {
      const foo = {};
      const testMaybe = Maybe.of(() => foo.bar.baz[0]);
      expect(testMaybe.__value).to.equal(undefined);
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
          expect(testMaybe.__value).to.equal(testValue);
          expect(testMaybe.join()).to.equal(testValue);
        });
      });
    });
    describe('isJust()', () => {
      it('should return true when __value is not null or undefined', () => {
        VALID_TEST_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isJust()).to.equal(true);
        });
      });
      it('should return false __value is null or undefined', () => {
        NULL_UNDEFINED_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isJust()).to.equal(false);
        });
      });
    });
    describe('isNothing()', () => {
      it('should return false when __value is not null or undefined', () => {
        VALID_TEST_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isNothing()).to.equal(false);
        });
      });
      it('should return true __value is null or undefined', () => {
        NULL_UNDEFINED_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue);
          expect(testMaybe.isNothing()).to.equal(true);
        });
      });
    });
    describe('orElse(<value>)', () => {
      it('should return this value as the default if isNothing() is true', () => {
        const OR_ELSE_VALUE = 'foo';
        NULL_UNDEFINED_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
          expect(testMaybe.join()).to.equal(OR_ELSE_VALUE);
        });
      });
      it('should not return this value if isNothing() is false', () => {
        const OR_ELSE_VALUE = 'foo';
        VALID_TEST_VALUES.forEach((testValue) => {
          const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
          expect(testMaybe.join()).to.equal(testValue);
        });
      });
      it('should return undefined (no value was passed) if isNothing() is true', () => {
        const testMaybe = Maybe.of().orElse();
        expect(testMaybe.join()).to.equal(undefined);
      });
      it('should not return undefined if isNothing() is false', () => {
        const testMaybe = Maybe.of(123).orElse();
        expect(testMaybe.join()).to.not.equal(undefined);
      });
    });
    describe('map(transform)', () => {
      it('should throw an error if transform is not a function', () => {
        const underTest = Maybe.of(1);
        expect(() => { underTest.map(); }).to.throw('transform must be a function');
      });
      it('should apply the transformation to the monad\'s value (numeric)', () => {
        const addOne = monadVal => monadVal + 1;
        const underTest = Maybe.of(1).map(addOne);
        expect(underTest.join()).to.equal(2);
      });
      it('should apply the transformation to the monad\'s value (object)', () => {
        const TEST_PROPERTY = 'foo';
        const TEST_VALUE = 'bar';
        const TEST_OBJECT = { [TEST_PROPERTY]: TEST_VALUE };
        const underTest = Maybe.of(TEST_OBJECT).map(obj => obj[TEST_PROPERTY]);
        expect(underTest.join()).to.equal(TEST_VALUE);
      });
      it('should apply the transformation to the monad\'s value (string)', () => {
        const foo = 'foo';
        const bar = 'bar';
        const underTest = Maybe.of(foo).map(obj => (obj + bar));
        expect(underTest.join()).to.equal(`${foo}${bar}`);
      });
    });
    describe('chain(transform)', () => {
      it('should throw an error if transform is not a function', () => {
        const underTest = Maybe.of(1);
        expect(() => { underTest.chain(); }).to.throw('transform must be a function');
      });
      it('should apply the transformation to the monad\'s value (numeric)', () => {
        function addOne(bar) {
          return Maybe.of(bar + 1);
        }
        const underTest = Maybe
          .of(1)
          .chain(addOne)
          .chain(addOne);
        expect(underTest.join()).to.equal(3);
      });
      it('should apply the transformation to the monad\'s value (object)', () => {
        const TEST_PROPERTY_1 = 'foo';
        const TEST_PROPERTY_2 = 'bar';
        const TEST_VALUE = [123, 567];
        const TEST_OBJECT = { [TEST_PROPERTY_1]: { [TEST_PROPERTY_2]: TEST_VALUE } };

        function getFoo(obj) {
          return Maybe.of(obj).prop('foo');
        }

        function getBar(obj) {
          return Maybe.of(obj).prop('bar');
        }

        const underTest = Maybe
          .of(TEST_OBJECT)
          .chain(getFoo)
          .chain(getBar);

        expect(underTest.join()).to.equal(TEST_VALUE);
      });
      it('should apply the transformation to the monad\'s value (string)', () => {
        const underTest = Maybe
          .of('a')
          .chain(val => Maybe.of(`${val}b`))
          .chain(val => Maybe.of(`${val}c`));
        expect(underTest.join()).to.equal('abc');
      });
    });
    describe('Property and Path Functions', () => {
      const LAYER_1 = 'layer1';
      const LAYER_2 = 'layer2';
      const LAYER_3 = 'layer3';

      let TEST_OBJECT;
      let TEST_ARRAY;
      const TEST_PROPERTY = 'foo';
      const TEST_VALUE = 'bar';
      beforeEach(() => {
        TEST_OBJECT = { [TEST_PROPERTY]: TEST_VALUE };
        TEST_ARRAY = [TEST_PROPERTY, TEST_VALUE];
      });

      describe('prop(<string|number>)', () => {
        it('should return a monad by using the argument as a property or array index (object)', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.prop(TEST_PROPERTY).join()).to.equal(TEST_VALUE);
        });
        it('should return a monad by using the argument as a property or array index (array)', () => {
          const maybeObj = Maybe.of(TEST_ARRAY);
          expect(maybeObj.prop(0).join()).to.equal(TEST_PROPERTY);
          expect(maybeObj.prop(1).join()).to.equal(TEST_VALUE);
        });
        it('should return a monad by chaining together .prop() calls for deep relationships', () => {
          TEST_OBJECT[LAYER_1] = { [LAYER_2]: { [LAYER_3]: TEST_ARRAY } };

          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.prop(LAYER_1).prop(LAYER_2).prop(LAYER_3).prop(0)
            .join()).to.equal(TEST_PROPERTY);
          expect(maybeObj.prop(LAYER_1).prop(LAYER_2).prop(LAYER_3).prop(1)
            .join()).to.equal(TEST_VALUE);
        });
        it('should return an empty monad if the value does not exist', () => {
          const maybeObj = Maybe.of({});
          expect(maybeObj.prop(TEST_PROPERTY).join()).to.be.undefined;
          expect(maybeObj.prop(0).join()).to.be.undefined;
        });
        it('should return an empty monad if no argument is passed', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.prop().join()).to.be.undefined;
        });
        it('should return an empty monad if null/undefined is passed', () => {
          const testObject = Maybe.of({ [TEST_PROPERTY]: { bar: 'baz' } });
          [null, undefined].forEach((invalid) => {
            expect(testObject.prop(TEST_PROPERTY).isNothing()).to.be.false;
            expect(testObject.prop(invalid).isNothing()).to.be.true;
            expect(testObject.prop(invalid).join()).to.be.undefined;
          });
        });
      });
      describe('props(...properties)', () => {
        it('should return a monad by using the argument list as keys / array indexes (object)', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.props(TEST_PROPERTY).join()).to.equal(TEST_VALUE);
        });
        it('should return a monad by using the argument list as keys / array indexes (array)', () => {
          const maybeObj = Maybe.of(TEST_ARRAY);
          expect(maybeObj.props(0).join()).to.equal(TEST_PROPERTY);
          expect(maybeObj.props(1).join()).to.equal(TEST_VALUE);
        });
        it('should return a monad using the deep argument list', () => {
          TEST_OBJECT[LAYER_1] = { [LAYER_2]: { [LAYER_3]: TEST_ARRAY } };
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.props(LAYER_1, LAYER_2, LAYER_3, 0).join()).to.equal(TEST_PROPERTY);
          expect(maybeObj.props(LAYER_1, LAYER_2, LAYER_3, 1).join()).to.equal(TEST_VALUE);
        });
        it('should return an empty monad if the value does not exist', () => {
          const maybeObj = Maybe.of(null);
          expect(maybeObj.props(LAYER_1, 0).join()).to.be.undefined;
          expect(maybeObj.props(LAYER_1, 2).join()).to.be.undefined;
        });
        it('should return an empty monad if the argument list is empty', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.props().join()).to.be.undefined;
        });
        it('should return an empty monad if null/undefined is passed', () => {
          const testObject = Maybe.of({ [TEST_PROPERTY]: { bar: 'baz' } });
          expect(testObject.props(TEST_PROPERTY).isNothing()).to.be.false;
          expect(testObject.props(TEST_PROPERTY, null, undefined).isNothing()).to.be.true;
          expect(testObject.props(TEST_PROPERTY, null, undefined).join()).to.be.undefined;
        });
      });
      describe('path(<string>)', () => {
        it('should return a monad by parsing the path (object)', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.path(TEST_PROPERTY).join()).to.equal(TEST_VALUE);
        });
        it('should return a monad by parsing the path (array)', () => {
          const maybeObj = Maybe.of(TEST_ARRAY);
          expect(maybeObj.path('0').join()).to.equal(TEST_PROPERTY);
          expect(maybeObj.path('1').join()).to.equal(TEST_VALUE);
        });
        it('should return a monad by parsing the deep object path (object & array)', () => {
          TEST_OBJECT[LAYER_1] = { [LAYER_2]: { [LAYER_3]: TEST_ARRAY } };

          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.path(`${LAYER_1}.${LAYER_2}.${LAYER_3}.0`).join()).to.equal(TEST_PROPERTY);
          expect(maybeObj.path(`${LAYER_1}.${LAYER_2}.${LAYER_3}.1`).join()).to.equal(TEST_VALUE);
        });
        it('should return an empty monad if the value does not exist', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.path('foo.bar.baz').join()).to.be.undefined;
        });
        it('should return an empty monad if the path is empty', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.path().join()).to.be.undefined;
        });
        it('should return an empty monad if the path is not a string', () => {
          const maybeObj = Maybe.of(['foo', 'bar']);
          expect(maybeObj.path(1).join()).to.be.undefined;
        });
        it('should return an empty monad if null/undefined is passed', () => {
          const testObject = Maybe.of({ [TEST_PROPERTY]: { bar: 'baz' } });
          [null, undefined].forEach((invalid) => {
            expect(testObject.path(invalid).isNothing()).to.be.true;
            expect(testObject.path(invalid).join()).to.be.undefined;
          });
        });
      });
      describe('path, prop, props', () => {
        it('should return the same results for a simple path', () => {
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.path(TEST_PROPERTY).join()).to.equal(TEST_VALUE);
          expect(maybeObj.prop(TEST_PROPERTY).join()).to.equal(TEST_VALUE);
          expect(maybeObj.props(TEST_PROPERTY).join()).to.equal(TEST_VALUE);
        });
        it('should return the same results for a deep path', () => {
          TEST_OBJECT[LAYER_1] = { [LAYER_2]: { [LAYER_3]: TEST_ARRAY } };
          const maybeObj = Maybe.of(TEST_OBJECT);
          expect(maybeObj.path(`${LAYER_1}.${LAYER_2}.${LAYER_3}.1`).join()).to.equal(TEST_VALUE);
          expect(maybeObj.prop(LAYER_1).prop(LAYER_2).prop(LAYER_3).prop(1)
            .join()).to.equal(TEST_VALUE);
          expect(maybeObj.props(LAYER_1, LAYER_2, LAYER_3, 1).join()).to.equal(TEST_VALUE);
        });
      });
    });
  });
});
