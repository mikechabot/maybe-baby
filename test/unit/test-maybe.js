'use strict';

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
            it('should have a path function', () => { expect(testMaybe.path).to.be.a('function'); });
            it('should have a prop function', () => { expect(testMaybe.prop).to.be.a('function'); });
            it('should have a props function', () => { expect(testMaybe.props).to.be.a('function'); });
        });
        describe('Private', () => {
            it('should have a private __value property', () => { expect(testMaybe).to.have.property('__value'); });
            it('should have a private __isValidPath function', () => { expect(testMaybe.__isValidPath).to.be.a('function'); });
        });
    });
    describe('Maybe.of(<value>)', () => {
        it('should be a function', () => {
            expect(Maybe.of).to.be.a('function');
        });
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
                it('should return this value as the default if isNothing() is true', () => {
                    const OR_ELSE_VALUE = 'foo';
                    NULL_UNDEFINED_VALUES.forEach(testValue => {
                        const testMaybe = Maybe.of(testValue).orElse(OR_ELSE_VALUE);
                        expect(testMaybe.join()).to.equal(OR_ELSE_VALUE);
                    });
                });
                it('should not return this value if isNothing() is false', () => {
                    const OR_ELSE_VALUE = 'foo';
                    VALID_TEST_VALUES.forEach(testValue => {
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
                it('should return an empty monad if null/undefined is passed', () => {
                    const testObject = Maybe.of({[TEST_PROPERTY]: { bar: 'baz' }});
                    [null, undefined].forEach(invalid => {
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
                    TEST_OBJECT[LAYER_1] = { [LAYER_2]: TEST_ARRAY };
                    const maybeObj = Maybe.of(TEST_OBJECT);
                    expect(maybeObj.props(LAYER_1, 0).join()).to.be.undefined;
                    expect(maybeObj.props(LAYER_1, 2).join()).to.be.undefined;
                });
                it('should return an empty monad if the argument list is empty', () => {
                    const maybeObj = Maybe.of(TEST_OBJECT);
                    expect(maybeObj.props().join()).to.be.undefined;
                });
                it('should return an empty monad if null/undefined is passed', () => {
                    const testObject = Maybe.of({[TEST_PROPERTY]: { bar: 'baz' }});
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
                    const testObject = Maybe.of({[TEST_PROPERTY]: { bar: 'baz' }});
                    [null, undefined].forEach(invalid => {
                        expect(testObject.path(invalid).isNothing()).to.be.true;
                        expect(testObject.path(invalid).join()).to.be.undefined;
                    });
                });
            });
        });
    });
    describe('Common Scenarios', () => {
        describe('Person 1', () => {
            let person1;
            let person1Maybe;
            beforeEach(() => {
                person1 = { firstName: 'Person', address: null };
                person1Maybe = Maybe.of(person1);
            });
            it('should return a monad containing the person object', () => {
                expect(person1Maybe.isJust).to.exist;
                expect(person1Maybe.isJust()).to.be.true;
                expect(person1Maybe.join()).to.equal(person1);
            });
            it('should return a monad with a value when searching for first name', () => {
                expect(person1Maybe.path('firstName').isNothing()).to.equal(false);
                expect(person1Maybe.props('firstName').isNothing()).to.equal(false);
                expect(person1Maybe.prop('firstName').isNothing()).to.equal(false);
            });
            it('should return a monad with an undefined value when searching for address', () => {
                expect(person1Maybe.path('address').isNothing()).to.equal(true);
                expect(person1Maybe.props('address').isNothing()).to.equal(true);
                expect(person1Maybe.prop('address').isNothing()).to.equal(true);
            });
            it('should return a monad with an undefined value when searching for street address', () => {
                expect(person1Maybe.path('address.street').isNothing()).to.equal(true);
                expect(person1Maybe.props('address', 'street').isNothing()).to.equal(true);
                expect(person1Maybe.prop('address').prop('street').isNothing()).to.equal(true);
            });
            it('should return the orElse value when searching for street address', () => {
                const OR_ELSE_VALUE = 'No Address';
                expect(person1Maybe.path('address.street').orElse(OR_ELSE_VALUE).join()).to.equal(OR_ELSE_VALUE);
                expect(person1Maybe.props('address', 'street').orElse(OR_ELSE_VALUE).join()).to.equal(OR_ELSE_VALUE);
                expect(person1Maybe.prop('address').prop('street').orElse(OR_ELSE_VALUE).join()).to.equal(OR_ELSE_VALUE);
            });
        });
        describe('Person 2', () => {
            let person2;
            let person2Maybe;
            beforeEach(() => {
                // More data, empty address
                person2 = { firstName: 'Person', lastName: 'Two', address: {} };
                person2Maybe = Maybe.of(person2);
            });
            it('should return a monad containing the person object', () => {
                expect(person2Maybe.isJust).to.exist;
                expect(person2Maybe.isJust()).to.be.true;
                expect(person2Maybe.join()).to.equal(person2);
            });
            it('should return a monad with a value when searching for first name', () => {
                expect(person2Maybe.path('firstName').isNothing()).to.equal(false);
                expect(person2Maybe.props('firstName').isNothing()).to.equal(false);
                expect(person2Maybe.prop('firstName').isNothing()).to.equal(false);
            });
            it('should return a monad with a value when searching for address', () => {
                // path check
                expect(person2Maybe.path('address').isNothing()).to.equal(false);
                expect(person2Maybe.path('address').join()).to.equal(person2.address);

                // props check
                expect(person2Maybe.props('address').isNothing()).to.equal(false);
                expect(person2Maybe.props('address').join()).to.equal(person2.address);

                // prop check
                expect(person2Maybe.prop('address').isNothing()).to.equal(false);
                expect(person2Maybe.prop('address').join()).to.equal(person2.address);
            });
            it('should return a monad with an undefined value searching for street address', () => {
                expect(person2Maybe.path('address.street').isNothing()).to.equal(true);
                expect(person2Maybe.props('address', 'street').isNothing()).to.equal(true);
                expect(person2Maybe.prop('address').prop('street').isNothing()).to.equal(true);
            });
            it('should return the orElse value when searching for street address', () => {
                const OR_ELSE_VALUE = 'No Address';
                expect(person2Maybe.path('address.street').orElse(OR_ELSE_VALUE).join()).to.equal(OR_ELSE_VALUE);
                expect(person2Maybe.props('address', 'street').orElse(OR_ELSE_VALUE).join()).to.equal(OR_ELSE_VALUE);
                expect(person2Maybe.prop('address').prop('street').orElse(OR_ELSE_VALUE).join()).to.equal(OR_ELSE_VALUE);
            });
        });
        describe('Person 3', () => {
            let person3;
            let person3Maybe;
            beforeEach(() => {
                // Lots of data
                person3 = {
                    firstName: 'Person',
                    lastName : 'Three',
                    address  : {
                        street: '123 Main St',
                        state : 'OR',
                        zip   : '12345'
                    }
                };
                person3Maybe = Maybe.of(person3);
            });
            it('should return a monad containing the person object', () => {
                expect(person3Maybe.isJust).to.exist;
                expect(person3Maybe.isJust()).to.be.true;
                expect(person3Maybe.join()).to.equal(person3);
            });
            it('should return a monad with a value when searching for first name', () => {
                expect(person3Maybe.path('firstName').isNothing()).to.equal(false);
                expect(person3Maybe.props('firstName').isNothing()).to.equal(false);
                expect(person3Maybe.prop('firstName').isNothing()).to.equal(false);
            });
            it('should return a monad with a value when searching for address', () => {
                expect(person3Maybe.path('address').isNothing()).to.equal(false);
                expect(person3Maybe.props('address').isNothing()).to.equal(false);
                expect(person3Maybe.prop('address').isNothing()).to.equal(false);
            });
            it('should return a monad with an value searching for street address', () => {
                // path check
                expect(person3Maybe.path('address.street').isNothing()).to.equal(false);
                expect(person3Maybe.path('address.street').join()).to.equal(person3.address.street);

                // props check
                expect(person3Maybe.props('address', 'street').isNothing()).to.equal(false);
                expect(person3Maybe.props('address', 'street').join()).to.equal(person3.address.street);

                // prop check
                expect(person3Maybe.prop('address').prop('street').isNothing()).to.equal(false);
                expect(person3Maybe.prop('address').prop('street').join()).to.equal(person3.address.street);
            });
            it('should not return the orElse value when searching for street address', () => {
                const OR_ELSE_VALUE = 'No Address';
                expect(person3Maybe.path('address.street').orElse(OR_ELSE_VALUE).join()).to.not.equal(OR_ELSE_VALUE);
                expect(person3Maybe.props('address', 'street').orElse(OR_ELSE_VALUE).join()).to.not.equal(OR_ELSE_VALUE);
                expect(person3Maybe.prop('address').prop('street').orElse(OR_ELSE_VALUE).join()).to.not.equal(OR_ELSE_VALUE);
            });
        });
    });
});
