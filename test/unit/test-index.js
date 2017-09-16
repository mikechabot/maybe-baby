'use strict';

const expect = require('chai').expect;
const Maybe = require('../../src');
const TEST_TYPES = require('../common/test-const').TEST_TYPES;

describe('maybe-baby', () => {
    describe('prototype', () => {
        let testMaybe;
        beforeEach(() => {
            testMaybe = Maybe.of();
        });
        it('should have an isJust function', () => { expect(testMaybe.isJust).to.be.a('function'); });
        it('should have an isNothing function', () => { expect(testMaybe.isNothing).to.be.a('function'); });
        it('should have a join function', () => { expect(testMaybe.join).to.be.a('function'); });
        it('should have an orElse function', () => { expect(testMaybe.orElse).to.be.a('function'); });
        it('should have a map function', () => { expect(testMaybe.map).to.be.a('function'); });
        it('should have a path function', () => { expect(testMaybe.path).to.be.a('function'); });
        it('should have a prop function', () => { expect(testMaybe.prop).to.be.a('function'); });
        it('should have a props function', () => { expect(testMaybe.props).to.be.a('function'); });
        it('should have a private __value property', () => { expect(testMaybe).to.have.property('__value'); });
        it('should have a private __isValidPath function', () => { expect(testMaybe.__isValidPath).to.be.a('function'); });
    });
    describe('Maybe.of(<value>) (factory)', () => {
        TEST_TYPES.forEach(testType => {
            it(`should return valid monad when passed ${testType.label}`, () => {
                const testMaybe = Maybe.of(testType.value);
                expect(testMaybe.__value).to.equal(testType.value);
            });
        });
    });
    describe('Monad functions', () => {
        let NULL_UNDEFINED_VALUES;
        let VALID_TEST_VALUES;
        beforeEach(() => {
            NULL_UNDEFINED_VALUES = [null, undefined];
            VALID_TEST_VALUES = [123, 'foo', '', [], {}, 0, false];
        });
        describe('Common Functions', () => {
            describe('join()', () => {
                it('should return the value of __value', () => {
                    VALID_TEST_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue);
                        expect(testMaybe.__value).to.equal(testValue);
                        expect(testMaybe.join()).to.equal(testValue);
                    });
                });
                it('should return the value passed to orElse if isNothing() is true', () => {
                    const OR_ELSE_VALUE = 'foo';
                    NULL_UNDEFINED_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
                        expect(testMaybe.join()).to.equal(OR_ELSE_VALUE);
                    });
                });
            });
            describe('isJust()', () => {
                it('should return true when __value is not null or undefined', () => {
                    VALID_TEST_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue);
                        expect(testMaybe.isJust()).to.equal(true);
                    });
                });
                it('should return false __value is null or undefined', () => {
                    NULL_UNDEFINED_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue);
                        expect(testMaybe.isJust()).to.equal(false);
                    });
                });
            });
            describe('isNothing()', () => {
                it('should return false when __value is not null or undefined', () => {
                    VALID_TEST_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue);
                        expect(testMaybe.isNothing()).to.equal(false);
                    });
                });
                it('should return true __value is null or undefined', () => {
                    NULL_UNDEFINED_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue);
                        expect(testMaybe.isNothing()).to.equal(true);
                    });
                });
            });
            describe('orElse(<value>)', () => {
                it('should return this value when join() is called, if isNothing() is true', () => {
                    const OR_ELSE_VALUE = 'foo';
                    NULL_UNDEFINED_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
                        expect(testMaybe.join()).to.equal(OR_ELSE_VALUE);
                    });
                });
                it('should not return this value when join() is called, if isNothing() is true', () => {
                    const OR_ELSE_VALUE = 'foo';
                    VALID_TEST_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
                        expect(testMaybe.join()).to.equal(testValue);
                    });
                });
            });
        });
        describe('Property and Path Functions', () => {
            const LAYER_1 = 'layer1';
            const LAYER_2 = 'layer2';
            const LAYER_3 = 'layer3';

            let TEST_OBJECT;
            let TEST_ARRAY;
            let TEST_PROPERTY = 'foo';
            let TEST_VALUE = 'bar';
            beforeEach(() => {
                TEST_OBJECT = {[TEST_PROPERTY]: TEST_VALUE};
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
                    expect(maybeObj.prop(LAYER_1).prop(LAYER_2).prop(LAYER_3).prop(0).join()).to.equal(TEST_PROPERTY);
                    expect(maybeObj.prop(LAYER_1).prop(LAYER_2).prop(LAYER_3).prop(1).join()).to.equal(TEST_VALUE);
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
                    TEST_OBJECT[LAYER_1] = { [LAYER_2]: TEST_ARRAY };
                    const maybeObj = Maybe.of(TEST_OBJECT);
                    expect(maybeObj.props(LAYER_1, 0).join()).to.be.undefined;
                    expect(maybeObj.props(LAYER_1, 2).join()).to.be.undefined;
                });
                it('should return an empty monad if the argument list is empty', () => {
                    const maybeObj = Maybe.of(TEST_OBJECT);
                    expect(maybeObj.props().join()).to.be.undefined;
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
            });
        });
    });
});
