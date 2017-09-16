module.exports = {
    TEST_TYPES: [
        { label: 'null', value: null },
        { label: 'undefined', value: undefined },
        { label: 'true', value: true},
        { label: 'false', value: false},
        { label: 'object', value: { foo: 'bar' }},
        { label: 'array', value: [ 1, 2, 3 ]},
        { label: 'number (primitive)', value: 123},
        { label: 'number (object wrapper)', value: new Number(123)},
        { label: 'string (primitive)', value: 'foo'},
        { label: 'string (object wrapper)', value: new String('foo')}
    ]
};
